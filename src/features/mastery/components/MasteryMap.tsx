import { MasteryLevel } from "@myt/shared";
import { cn } from "@/utils/cn";
import type { SubjectMasterySummary } from "../types";

const LEVEL_META: Record<MasteryLevel, { label: string; className: string }> = {
  [MasteryLevel.NOT_STARTED]: { label: "Not started", className: "bg-muted text-muted-foreground border-border" },
  [MasteryLevel.EMERGING]: { label: "Needs practice", className: "bg-destructive/10 text-destructive border-destructive/20" },
  [MasteryLevel.DEVELOPING]: { label: "Developing", className: "bg-warning/15 text-warning-foreground border-warning/30" },
  [MasteryLevel.SECURE]: { label: "Secure", className: "bg-secondary/10 text-secondary border-secondary/20" },
  [MasteryLevel.MASTERED]: { label: "Strong", className: "bg-success/15 text-success border-success/30" },
};

/**
 * A simple, legible mastery visualization: Subject -> Topic -> Skill level,
 * as a grid of labeled chips (deliberately not a complex graph — see the
 * product brief's "keep it understandable" guidance).
 */
export function MasteryMap({ summary }: { summary: SubjectMasterySummary }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {summary.records.map((record) => {
        const meta = LEVEL_META[record.level];
        return (
          <div key={record.id} className={cn("flex items-center justify-between rounded-md border px-3 py-2 text-sm", meta.className)}>
            <span className="font-medium">{record.topic}</span>
            <span className="text-xs">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}
