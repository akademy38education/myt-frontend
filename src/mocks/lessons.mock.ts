import { LessonStatus, type Lesson } from "@myt/shared";

/**
 * `Lesson` (what actually happened in a booking) is a scaffolded backend
 * entity — this mock stands in for it. `Booking` (the schedule/slot itself)
 * is real and comes from the live backend via `bookingsService`; the
 * student "My Lessons" experience merges the two — see
 * `features/lessons/lessonMeta.ts` for how a lesson's rich detail (topic,
 * prep, resources) is keyed onto a real booking id.
 */
export const mockLessons: Lesson[] = [
  {
    id: "lesson-1",
    bookingId: "booking-past-1",
    status: LessonStatus.COMPLETED,
    startedAt: "2026-08-25T16:00:00.000Z",
    endedAt: "2026-08-25T17:00:00.000Z",
    summary:
      "Covered factorising quadratics and completed 8 practice questions. Amelia is confident with simple cases; still needs practice with negative coefficients.",
    recordingId: "recording-1",
    createdAt: "2026-08-25T17:05:00.000Z",
    updatedAt: "2026-08-25T17:05:00.000Z",
  },
  {
    id: "lesson-2",
    bookingId: "booking-past-2",
    status: LessonStatus.COMPLETED,
    startedAt: "2026-08-18T09:00:00.000Z",
    endedAt: "2026-08-18T10:00:00.000Z",
    summary:
      "Close-read Act 3 of Macbeth, focusing on imagery of blood and guilt. Amelia wrote a strong opening paragraph; we'll work on integrating quotations next time.",
    recordingId: "recording-2",
    createdAt: "2026-08-18T10:05:00.000Z",
    updatedAt: "2026-08-18T10:05:00.000Z",
  },
  {
    id: "lesson-3",
    bookingId: "booking-past-3",
    status: LessonStatus.MISSED,
    createdAt: "2026-08-11T16:00:00.000Z",
    updatedAt: "2026-08-11T16:00:00.000Z",
  },
];
