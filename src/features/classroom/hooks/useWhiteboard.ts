import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { WhiteboardStroke } from "@myt/shared";
import { whiteboardService } from "../services/whiteboardService";

const SAVE_DEBOUNCE_MS = 1200;

/**
 * Owns the whiteboard's stroke log — the single source of truth both the
 * canvas renders from and what gets persisted/broadcast. A "stroke" is
 * only added here once the user finishes drawing it (pointer-up), so
 * undo/redo/persistence all operate on complete, replayable units rather
 * than per-pixel deltas (Phase 7 spec §82: no expensive per-pixel React
 * state updates).
 */
export function useWhiteboard(bookingId: string, onLocalStroke: (stroke: WhiteboardStroke) => void) {
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardStroke[]>([]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();
  const hasLoaded = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["lesson-whiteboard", bookingId],
    queryFn: () => whiteboardService.get(bookingId),
    enabled: Boolean(bookingId),
  });

  useEffect(() => {
    if (data && !hasLoaded.current) {
      setStrokes(data.strokes);
      hasLoaded.current = true;
    }
  }, [data]);

  const persist = useCallback(
    (next: WhiteboardStroke[]) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        whiteboardService.save(bookingId, next).catch(() => undefined);
      }, SAVE_DEBOUNCE_MS);
    },
    [bookingId]
  );

  const addStroke = useCallback(
    (stroke: WhiteboardStroke, broadcast = true) => {
      setStrokes((current) => {
        const next = [...current, stroke];
        persist(next);
        return next;
      });
      setRedoStack([]);
      if (broadcast) onLocalStroke(stroke);
    },
    [persist, onLocalStroke]
  );

  const addRemoteStroke = useCallback((stroke: WhiteboardStroke) => {
    setStrokes((current) => (current.some((s) => s.id === stroke.id) ? current : [...current, stroke]));
  }, []);

  const undo = useCallback(() => {
    setStrokes((current) => {
      if (current.length === 0) return current;
      const last = current[current.length - 1]!;
      setRedoStack((redo) => [...redo, last]);
      const next = current.slice(0, -1);
      persist(next);
      return next;
    });
  }, [persist]);

  const redo = useCallback(() => {
    setRedoStack((redoCurrent) => {
      if (redoCurrent.length === 0) return redoCurrent;
      const last = redoCurrent[redoCurrent.length - 1]!;
      setStrokes((current) => {
        const next = [...current, last];
        persist(next);
        return next;
      });
      return redoCurrent.slice(0, -1);
    });
  }, [persist]);

  const clear = useCallback(() => {
    setStrokes([]);
    setRedoStack([]);
    persist([]);
  }, [persist]);

  return { strokes, isLoading, addStroke, addRemoteStroke, undo, redo, clear, canUndo: strokes.length > 0, canRedo: redoStack.length > 0 };
}
