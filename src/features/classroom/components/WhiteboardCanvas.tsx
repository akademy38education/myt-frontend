import { useEffect, useRef, useState } from "react";
import type { WhiteboardStroke, WhiteboardTool, LessonParticipantRole } from "@myt/shared";
import { randomUUID } from "@/utils/uuid";
import { Input } from "@/components/ui/input";

type Point = { x: number; y: number };

export interface WhiteboardCanvasProps {
  strokes: WhiteboardStroke[];
  tool: WhiteboardTool;
  color: string;
  size: number;
  authorRole: LessonParticipantRole;
  canEdit: boolean;
  onStrokeComplete: (stroke: WhiteboardStroke) => void;
}

/** Points are stored normalized (0–1, relative to canvas size) so a stroke drawn on one participant's screen renders correctly at any other screen size. */
function toNormalized(point: Point, canvas: HTMLCanvasElement): Point {
  return { x: point.x / canvas.width, y: point.y / canvas.height };
}
function toPixel(point: Point, canvas: HTMLCanvasElement): Point {
  return { x: point.x * canvas.width, y: point.y * canvas.height };
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: WhiteboardStroke, canvas: HTMLCanvasElement) {
  const pixelPoints = stroke.points.map((p) => toPixel(p, canvas));
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = stroke.size;

  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color;
    ctx.globalAlpha = stroke.tool === "highlighter" ? 0.35 : 1;
  }

  if (stroke.tool === "text") {
    ctx.globalAlpha = 1;
    ctx.fillStyle = stroke.color;
    ctx.font = `${12 + stroke.size * 2}px system-ui, sans-serif`;
    ctx.fillText(stroke.text ?? "", pixelPoints[0]?.x ?? 0, pixelPoints[0]?.y ?? 0);
  } else if ((stroke.tool === "rectangle" || stroke.tool === "ellipse") && pixelPoints.length >= 2) {
    const start = pixelPoints[0]!;
    const end = pixelPoints[pixelPoints.length - 1]!;
    if (stroke.tool === "rectangle") {
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else {
      ctx.beginPath();
      ctx.ellipse((start.x + end.x) / 2, (start.y + end.y) / 2, Math.abs(end.x - start.x) / 2, Math.abs(end.y - start.y) / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (pixelPoints.length > 0) {
    ctx.beginPath();
    pixelPoints.forEach((point, index) => (index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
    ctx.stroke();
  }
  ctx.restore();
}

export function WhiteboardCanvas({ strokes, tool, color, size, authorRole, canEdit, onStrokeComplete }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveStroke, setLiveStroke] = useState<WhiteboardStroke | null>(null);
  const [textDraft, setTextDraft] = useState<{ x: number; y: number } | null>(null);
  const isDrawing = useRef(false);

  // Keep the canvas's pixel buffer matched to its displayed size (and redraw on resize) so strokes stay sharp and normalized points stay accurate.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      repaint();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function repaint() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokes) drawStroke(ctx, stroke, canvas);
    if (liveStroke) drawStroke(ctx, liveStroke, canvas);
  }

  useEffect(repaint, [strokes, liveStroke]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return toNormalized({ x: e.clientX - rect.left, y: e.clientY - rect.top }, canvas);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canEdit) return;
    const point = getPoint(e);
    if (!point) return;

    if (tool === "text") {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      setTextDraft({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      return;
    }

    isDrawing.current = true;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    setLiveStroke({ id: randomUUID(), tool, color, size, points: [point], authorRole });
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !liveStroke) return;
    const point = getPoint(e);
    if (!point) return;
    if (tool === "rectangle" || tool === "ellipse") {
      setLiveStroke({ ...liveStroke, points: [liveStroke.points[0]!, point] });
    } else {
      setLiveStroke({ ...liveStroke, points: [...liveStroke.points, point] });
    }
  }

  function handlePointerUp() {
    if (!isDrawing.current || !liveStroke) return;
    isDrawing.current = false;
    onStrokeComplete(liveStroke);
    setLiveStroke(null);
  }

  function commitText(value: string) {
    if (value.trim() && textDraft && canvasRef.current) {
      const point = toNormalized(textDraft, canvasRef.current);
      onStrokeComplete({ id: randomUUID(), tool: "text", color, size, points: [point], text: value.trim(), authorRole });
    }
    setTextDraft(null);
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-white">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={canEdit ? "h-full w-full touch-none cursor-crosshair" : "h-full w-full touch-none"}
        role="img"
        aria-label="Lesson whiteboard"
      />
      {textDraft && (
        <Input
          autoFocus
          placeholder="Type and press Enter…"
          className="absolute w-40"
          style={{ left: textDraft.x, top: textDraft.y - 14 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText((e.target as HTMLInputElement).value);
            if (e.key === "Escape") setTextDraft(null);
          }}
          onBlur={(e) => commitText(e.target.value)}
        />
      )}
    </div>
  );
}
