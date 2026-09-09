import { Eraser, Highlighter, Minus, Pencil, Redo2, RectangleHorizontal, Circle, Type, Undo2, Download, Trash2 } from "lucide-react";
import type { WhiteboardTool } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

const TOOLS: Array<{ tool: WhiteboardTool; icon: typeof Pencil; label: string }> = [
  { tool: "pen", icon: Pencil, label: "Pen" },
  { tool: "highlighter", icon: Highlighter, label: "Highlighter" },
  { tool: "eraser", icon: Eraser, label: "Eraser" },
  { tool: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
  { tool: "ellipse", icon: Circle, label: "Ellipse" },
  { tool: "text", icon: Type, label: "Text" },
];

const COLORS = ["#0f172a", "#dc2626", "#15803d", "#2563eb", "#d97706"];

export interface WhiteboardToolbarProps {
  tool: WhiteboardTool;
  onToolChange: (tool: WhiteboardTool) => void;
  color: string;
  onColorChange: (color: string) => void;
  size: number;
  onSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  canEdit: boolean;
}

export function WhiteboardToolbar({ tool, onToolChange, color, onColorChange, size, onSizeChange, canUndo, canRedo, onUndo, onRedo, onClear, onExport, canEdit }: WhiteboardToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2">
      {canEdit && (
        <div className="flex items-center gap-1">
          {TOOLS.map(({ tool: t, icon: Icon, label }) => (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <Button variant={tool === t ? "secondary" : "ghost"} size="icon" aria-label={label} aria-pressed={tool === t} onClick={() => onToolChange(t)}>
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {canEdit && (
        <>
          <div className="mx-1 h-6 w-px bg-border" />
          <div className="flex items-center gap-1" role="group" aria-label="Colour">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Colour ${c}`}
                aria-pressed={color === c}
                onClick={() => onColorChange(c)}
                className={cn("h-6 w-6 rounded-full border-2 transition-transform", color === c ? "scale-110 border-foreground" : "border-transparent")}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5" aria-label="Stroke size">
            <Minus className="h-3 w-3 text-muted-foreground" />
            <input type="range" min={1} max={16} value={size} onChange={(e) => onSizeChange(Number(e.target.value))} className="w-16 accent-primary" aria-label="Stroke size" />
          </div>
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Undo" disabled={!canUndo} onClick={onUndo}>
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Redo" disabled={!canRedo} onClick={onRedo}>
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
        {canEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Clear whiteboard" onClick={onClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Download whiteboard" onClick={onExport}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download PNG</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
