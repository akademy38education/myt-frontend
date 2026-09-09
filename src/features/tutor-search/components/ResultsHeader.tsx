import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SortDropdown } from "./SortDropdown";
import type { TutorSortOrder } from "../types";

export interface ResultsHeaderProps {
  title: string;
  count: number;
  sort: TutorSortOrder | undefined;
  onSortChange: (sort: TutorSortOrder) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export function ResultsHeader({ title, count, sort, onSortChange, onOpenFilters, activeFilterCount }: ResultsHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {count} tutor{count === 1 ? "" : "s"} found
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="lg:hidden" onClick={onOpenFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && <Badge className="ml-1 h-5 px-1.5">{activeFilterCount}</Badge>}
        </Button>
        <div className="ml-auto">
          <SortDropdown value={sort} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
