import { useLessonTimer } from "../hooks/useLessonTimer";

/** Its own component boundary on purpose — the once-a-second tick re-renders only this, never the rest of the classroom (Phase 7 spec §81). */
export function LessonTimerDisplay({ startedAt }: { startedAt: string | undefined }) {
  const { label } = useLessonTimer(startedAt);
  return <span className="font-mono text-sm font-semibold tabular-nums">{label}</span>;
}
