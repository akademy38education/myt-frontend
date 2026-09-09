import type { TutorAvailabilityDay, TutorProfile } from "@myt/shared";
import { zonedTimeToUtc } from "@/utils/timezone";

/**
 * Mirrors `backend/src/modules/tutors/availabilityTags.ts`'s
 * `AVAILABILITY_WINDOWS` + `tutorsService.getAvailability` exactly, so mock
 * mode produces the same slots a real API call would. dayOfWeek follows
 * JS `Date#getDay()` (0 = Sunday). Slot labels are the tutor's own local
 * time — see `zonedTimeToUtc` for why "is it in the past / already booked"
 * must convert through the tutor's timezone rather than the caller's own.
 */
const AVAILABILITY_WINDOWS: Record<string, { days: number[]; startHour: number; endHour: number }> = {
  "Weekday mornings": { days: [1, 2, 3, 4, 5], startHour: 8, endHour: 10 },
  "Weekday afternoons": { days: [1, 2, 3, 4, 5], startHour: 13, endHour: 16 },
  "Weekday evenings": { days: [1, 2, 3, 4, 5], startHour: 17, endHour: 20 },
  Weekends: { days: [0, 6], startHour: 10, endHour: 16 },
};

export function computeAvailabilityDays(tutor: TutorProfile, bookedStarts: Date[], daysAhead = 7): TutorAvailabilityDay[] {
  const days: TutorAvailabilityDay[] = [];
  const now = new Date();
  const timezone = tutor.timezone ?? "Europe/London";

  for (let offset = 0; offset < daysAhead; offset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    const dateKey = date.toISOString().slice(0, 10);
    const dayOfWeek = date.getDay();

    const slots: string[] = [];
    for (const tag of tutor.availabilitySlots) {
      const window = AVAILABILITY_WINDOWS[tag];
      if (!window || !window.days.includes(dayOfWeek)) continue;

      for (let hour = window.startHour; hour < window.endHour; hour++) {
        for (const minute of [0, 30]) {
          const timeLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
          const slotInstant = zonedTimeToUtc(dateKey, timeLabel, timezone);
          if (slotInstant.getTime() <= now.getTime()) continue;

          const isBooked = bookedStarts.some((booked) => Math.abs(booked.getTime() - slotInstant.getTime()) < 30 * 60 * 1000);
          if (isBooked) continue;

          slots.push(timeLabel);
        }
      }
    }

    if (slots.length > 0) days.push({ date: dateKey, slots: Array.from(new Set(slots)).sort() });
  }

  return days;
}
