import { Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export interface AvailabilityRange {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface AvailabilityEditorProps {
  value: AvailabilityRange[];
  onChange: (value: AvailabilityRange[]) => void;
  className?: string;
}

/**
 * A weekly availability editor: toggle a day on/off, add one or more time
 * ranges per day. Reused by tutor onboarding's availability step today, and
 * intended for the booking system's tutor-availability management later —
 * see docs/product/README.md's `calendar` module.
 */
export function AvailabilityEditor({ value, onChange, className }: AvailabilityEditorProps) {
  function rangesFor(day: number) {
    return value.filter((r) => r.dayOfWeek === day);
  }

  function setDayEnabled(day: number, enabled: boolean) {
    if (enabled) {
      onChange([...value, { dayOfWeek: day, startTime: "18:00", endTime: "21:00" }]);
    } else {
      onChange(value.filter((r) => r.dayOfWeek !== day));
    }
  }

  function addRange(day: number) {
    onChange([...value, { dayOfWeek: day, startTime: "18:00", endTime: "21:00" }]);
  }

  function updateRange(day: number, index: number, patch: Partial<AvailabilityRange>) {
    const dayRanges = rangesFor(day);
    const target = dayRanges[index];
    if (!target) return;
    const targetPos = value.indexOf(target);
    const next = [...value];
    next[targetPos] = { ...target, ...patch };
    onChange(next);
  }

  function removeRange(day: number, index: number) {
    const dayRanges = rangesFor(day);
    const target = dayRanges[index];
    if (!target) return;
    onChange(value.filter((r) => r !== target));
  }

  return (
    <div className={cn("divide-y divide-border rounded-lg border border-border", className)}>
      {DAYS.map((label, day) => {
        const dayRanges = rangesFor(day);
        const enabled = dayRanges.length > 0;
        return (
          <div key={label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={enabled} onCheckedChange={(checked) => setDayEnabled(day, checked)} aria-label={`${label} availability`} />
                <span className={cn("font-medium", !enabled && "text-muted-foreground")}>{label}</span>
              </div>
              {!enabled && <span className="text-xs text-muted-foreground">Unavailable</span>}
            </div>

            {enabled && (
              <div className="mt-3 space-y-2 pl-11">
                {dayRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={range.startTime}
                      onChange={(e) => updateRange(day, index, { startTime: e.target.value })}
                      className="w-32"
                      aria-label={`${label} start time`}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={range.endTime}
                      onChange={(e) => updateRange(day, index, { endTime: e.target.value })}
                      className="w-32"
                      aria-label={`${label} end time`}
                    />
                    {dayRanges.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeRange(day, index)} aria-label="Remove time range">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={() => addRange(day)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add availability
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
