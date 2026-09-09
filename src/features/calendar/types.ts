import type { Booking } from "@myt/shared";

export type CalendarEventType = "lesson" | "homework" | "goal" | "exam" | "blocked";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  /** Start timestamp (ISO) — for a `lesson`/`blocked` event this is the real scheduled/blocked start, used for time-of-day display. */
  date: string;
  endDate?: string;
  link?: string;
  /** Present only on `type: "lesson"` events — lets `CalendarEventDetailsDialog` show Join/Reschedule/Cancel without a second fetch. */
  booking?: Booking;
  tutorName?: string;
  subjectName?: string;
}
