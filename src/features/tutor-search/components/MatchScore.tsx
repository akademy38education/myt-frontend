import { cn } from "@/utils/cn";

export interface MatchScoreProps {
  score: number;
  size?: "sm" | "lg";
  className?: string;
}

function labelFor(score: number): string {
  if (score >= 90) return "Great Match";
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Good Match";
  return "Fair Match";
}

function toneFor(score: number): string {
  if (score >= 90) return "bg-success/15 text-success";
  if (score >= 75) return "bg-primary/15 text-primary";
  if (score >= 60) return "bg-secondary/15 text-secondary";
  return "bg-muted text-muted-foreground";
}

/**
 * A score is only ever shown alongside its label and (via `MatchReasonsList`
 * nearby) the reasons behind it — never a bare percentage. See the Phase 5
 * spec's "match score transparency" requirement. Never present this as a
 * scientifically precise measurement; it's a mock/rule-based estimate.
 */
export function MatchScore({ score, size = "sm", className }: MatchScoreProps) {
  const rounded = Math.round(score);
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5", toneFor(rounded), size === "lg" && "px-3.5 py-2", className)}>
      <span className={cn("font-bold leading-none", size === "lg" ? "text-2xl" : "text-base")}>{rounded}%</span>
      <span className={cn("font-medium leading-tight", size === "lg" ? "text-sm" : "text-xs")}>{labelFor(rounded)}</span>
    </div>
  );
}
