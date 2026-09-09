import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorCompareStore, MAX_COMPARE_TUTORS } from "../store";
import { getMarketplaceContext } from "@/features/tutor-search/marketplaceContext";

/** A floating action bar that appears once at least one tutor is selected for comparison — Phase 5 spec §27. */
export function CompareBar() {
  const { tutorIds, clear } = useTutorCompareStore();
  const navigate = useNavigate();

  if (tutorIds.length === 0) return null;

  const context = getMarketplaceContext(window.location.pathname);
  const comparePath = context === "public" ? "/tutors/compare" : `/${context}/tutors/compare`;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-lg">
        <span className="text-sm font-medium">
          {tutorIds.length} of {MAX_COMPARE_TUTORS} tutors selected
        </span>
        <Button size="sm" onClick={() => navigate(comparePath)}>
          Compare
        </Button>
        <button type="button" onClick={clear} aria-label="Clear comparison" className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
