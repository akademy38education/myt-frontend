import { useEffect, useState } from "react";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Ticks every second off an AUTHORITATIVE `startedAt` (the backend's
 * `Lesson.startedAt`, set once by `POST /lessons/:id/start`) — never a
 * purely client-side clock, so the displayed duration is correct even if
 * this tab was opened after the lesson actually began (Phase 7 spec §38).
 * Deliberately its own hook/component boundary so the once-a-second
 * re-render never touches the rest of the classroom (spec §81).
 */
export function useLessonTimer(startedAt: string | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  if (!startedAt) return { label: "00:00", elapsedMs: 0 };
  const elapsedMs = now - new Date(startedAt).getTime();
  return { label: formatElapsed(elapsedMs), elapsedMs };
}
