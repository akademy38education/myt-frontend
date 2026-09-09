import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

const STAGES = ["Introduction", "Concept", "Practice", "Review"];

export interface LessonProgressProps {
  stage: number;
  onAdvance?: (stage: number) => void;
  editable: boolean;
}

/** A tutor-advanced checklist of where the lesson is at — purely presentational/local state relayed over the socket (see `useLessonRealtime`'s `broadcastProgress`), not a stored backend field, since it's a live-session cue rather than a durable record. */
export function LessonProgress({ stage, onAdvance, editable }: LessonProgressProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson progress</p>
      <ol className="space-y-1.5">
        {STAGES.map((label, index) => {
          const isDone = index < stage;
          const isCurrent = index === stage;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!editable}
                onClick={() => onAdvance?.(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm transition-colors",
                  editable && "hover:bg-muted",
                  isCurrent && "font-semibold text-primary"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    isDone ? "border-primary bg-primary text-primary-foreground" : isCurrent ? "border-primary" : "border-border"
                  )}
                >
                  {isDone ? <Check className="h-2.5 w-2.5" /> : isCurrent ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
