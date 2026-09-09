import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from "date-fns";
import type { CalendarEvent } from "../types";

export interface EventCalendarProps {
  events: CalendarEvent[];
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  month: Date;
  onMonthChange: (date: Date) => void;
}

/** Month-view calendar (built on the existing react-day-picker-based Calendar primitive) with a dot under any day that has an event. */
export function EventCalendar({ events, selected, onSelect, month, onMonthChange }: EventCalendarProps) {
  const eventDates = events.map((e) => new Date(e.date));

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      month={month}
      onMonthChange={onMonthChange}
      modifiers={{ hasEvent: (date) => eventDates.some((d) => isSameDay(d, date)) }}
      modifiersClassNames={{ hasEvent: "myt-calendar-has-event" }}
      className="w-full"
    />
  );
}
