import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TutorSearchFilter } from "../types";

export interface NoResultsSuggestionsProps {
  filter: TutorSearchFilter;
  onWidenBudget: () => void;
  onClearOneFilter: (key: keyof TutorSearchFilter) => void;
  onClearAll: () => void;
}

const FILTER_LABELS: Partial<Record<keyof TutorSearchFilter, string>> = {
  yearLevel: "year level",
  curriculum: "curriculum",
  teachingStyle: "teaching style",
  availability: "availability",
  language: "language",
  minRating: "minimum rating",
  verifiedOnly: "verified only",
  trialAvailable: "trial lesson required",
};

/** Turns "no results" into concrete, clickable next steps rather than a dead end — Phase 5 spec §43. */
export function NoResultsSuggestions({ filter, onWidenBudget, onClearOneFilter, onClearAll }: NoResultsSuggestionsProps) {
  const activeSecondaryFilters = (Object.keys(FILTER_LABELS) as Array<keyof TutorSearchFilter>).filter((key) => filter[key]);

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <SearchX className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h3 className="font-semibold">We couldn't find a tutor matching all of those filters</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Try widening your budget or availability, or remove a filter below.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {filter.maxPrice && (
          <Button variant="outline" size="sm" onClick={onWidenBudget}>
            Expand budget
          </Button>
        )}
        {activeSecondaryFilters.map((key) => (
          <Button key={key} variant="outline" size="sm" onClick={() => onClearOneFilter(key)}>
            Remove {FILTER_LABELS[key]}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear all filters
        </Button>
      </div>
    </div>
  );
}
