import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface MatchReasonsListProps {
  reasons: string[];
  className?: string;
}

/**
 * Renders the structured reasons behind a match score (from
 * `TutorMatchResult.matchReasons`, generated server-side in
 * `smartMatch.service.ts`) — never hardcoded per-tutor copy in a card
 * component. Empty reasons render nothing rather than an empty heading.
 */
export function MatchReasonsList({ reasons, className }: MatchReasonsListProps) {
  if (reasons.length === 0) return null;
  return (
    <ul className={cn("space-y-1", className)}>
      {reasons.map((reason) => (
        <li key={reason} className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
          {reason}
        </li>
      ))}
    </ul>
  );
}
