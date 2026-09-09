import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIMEZONES } from "@/constants/tutoring";
import { getBrowserTimezone, timezoneOffsetLabel } from "@/utils/timezone";

export interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}

/** Defaults callers to `getBrowserTimezone()`; always includes it in the list even if outside the curated `TIMEZONES` set, so a real detected timezone is never silently replaced by the closest guess. */
export function TimezoneSelector({ value, onChange, className }: TimezoneSelectorProps) {
  const browserTimezone = getBrowserTimezone();
  const options = TIMEZONES.includes(browserTimezone) ? TIMEZONES : [browserTimezone, ...TIMEZONES];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className} aria-label="Timezone">
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((tz) => (
          <SelectItem key={tz} value={tz}>
            {tz.replace("_", " ")} ({timezoneOffsetLabel(tz)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
