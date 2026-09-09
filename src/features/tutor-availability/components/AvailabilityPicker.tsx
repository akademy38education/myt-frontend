import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/utils/cn";
import { useTutorAvailability } from "../hooks/useTutorAvailability";
import { AvailabilityError } from "./AvailabilityError";

export interface SelectedSlot {
  date: string;
  time: string;
}

function dayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

/** Real bookable slots for a tutor, next ~7 days — used both on the tutor profile's Availability tab and to seed the BookingDialog with a chosen time. Phase 5 spec §37. */
export function AvailabilityPicker({ tutorId, selected, onSelect }: { tutorId: string; selected?: SelectedSlot; onSelect: (slot: SelectedSlot) => void }) {
  const { data, isLoading, isError, refetch } = useTutorAvailability(tutorId);
  const [expandedCount, setExpandedCount] = useState(3);

  if (isLoading) return <LoadingState label="Loading availability..." />;
  if (isError) return <AvailabilityError onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return <EmptyState title="No availability in the next week" description="Message this tutor to ask about other times." className="py-8" />;
  }

  const visibleDays = data.slice(0, expandedCount);

  return (
    <div className="space-y-5">
      {visibleDays.map((day) => (
        <div key={day.date}>
          <p className="mb-2 text-sm font-medium">{dayLabel(day.date)}</p>
          <div className="flex flex-wrap gap-2">
            {day.slots.map((time) => {
              const isSelected = selected?.date === day.date && selected?.time === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelect({ date: day.date, time })}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {expandedCount < data.length && (
        <Button variant="ghost" size="sm" onClick={() => setExpandedCount((c) => c + 4)}>
          Show more days
        </Button>
      )}
    </div>
  );
}
