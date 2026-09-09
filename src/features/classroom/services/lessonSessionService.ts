import { LessonStatus, type Booking, type EndLessonInput, type Lesson, type StartLessonInput } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockStudents, mockTutors } from "@/mocks";
import type { LessonParticipants } from "../types";

export type JoinState = "too-early" | "starting-soon" | "live" | "completed";
const STARTING_SOON_WINDOW_MS = 60 * 60 * 1000;

/** Mock-mode-only in-memory lesson state — good enough for exercising the join/start/end flow without a backend; not persisted across a page reload (unlike the zustand-backed mock stores elsewhere), since a "live lesson session" isn't meaningful to resume after a refresh anyway. */
const mockLessons = new Map<string, Lesson>();

function emptyLesson(bookingId: string): Lesson {
  const now = new Date().toISOString();
  return { id: `lesson-${bookingId}`, bookingId, status: LessonStatus.SCHEDULED, createdAt: now, updatedAt: now };
}

export const lessonSessionService = {
  /** Purely time-derived — becomes a fallback once the real `Lesson.status` exists (see `get`), since a booking can be "within its scheduled window" before the tutor has actually pressed Start. */
  getJoinState(booking: Booking): JoinState {
    const start = new Date(booking.scheduledStart).getTime();
    const end = new Date(booking.scheduledEnd).getTime();
    const now = Date.now();
    if (now > end) return "completed";
    if (now >= start) return "live";
    if (start - now <= STARTING_SOON_WINDOW_MS) return "starting-soon";
    return "too-early";
  },

  minutesUntilStart(booking: Booking): number {
    return Math.max(0, Math.round((new Date(booking.scheduledStart).getTime() - Date.now()) / 60000));
  },

  async get(bookingId: string): Promise<Lesson> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return mockLessons.get(bookingId) ?? emptyLesson(bookingId);
    }
    return apiRequest<Lesson>(ENDPOINTS.lessons.byBooking(bookingId));
  },

  async start(bookingId: string, input: StartLessonInput): Promise<Lesson> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const lesson: Lesson = { ...emptyLesson(bookingId), ...mockLessons.get(bookingId), status: LessonStatus.IN_PROGRESS, startedAt: new Date().toISOString(), objectives: input.objectives };
      mockLessons.set(bookingId, lesson);
      return lesson;
    }
    return apiRequest<Lesson>(ENDPOINTS.lessons.start(bookingId), { method: "POST", body: input });
  },

  async end(bookingId: string, input: EndLessonInput): Promise<Lesson> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const current = mockLessons.get(bookingId) ?? emptyLesson(bookingId);
      const lesson: Lesson = { ...current, status: LessonStatus.COMPLETED, endedAt: new Date().toISOString(), summary: input.summary, objectives: input.objectives ?? current.objectives, nextSteps: input.nextSteps };
      mockLessons.set(bookingId, lesson);
      return lesson;
    }
    return apiRequest<Lesson>(ENDPOINTS.lessons.end(bookingId), { method: "POST", body: input });
  },

  /**
   * Lets a tutor write or revise a lesson's summary/objectives/next-steps
   * after the fact — Phase 8's Lesson Summary Editor and its "unfinished
   * summaries" dashboard nudge, both reached outside the live classroom
   * (unlike `end`, which only runs during an in-progress lesson).
   */
  async updateSummary(bookingId: string, input: EndLessonInput): Promise<Lesson> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const current = mockLessons.get(bookingId) ?? emptyLesson(bookingId);
      const lesson: Lesson = { ...current, summary: input.summary ?? current.summary, objectives: input.objectives ?? current.objectives, nextSteps: input.nextSteps ?? current.nextSteps };
      mockLessons.set(bookingId, lesson);
      return lesson;
    }
    return apiRequest<Lesson>(ENDPOINTS.lessons.summary(bookingId), { method: "PATCH", body: input });
  },

  async getParticipants(bookingId: string, booking: Pick<Booking, "studentId" | "tutorId">): Promise<LessonParticipants> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      const student = mockStudents.find((s) => s.id === booking.studentId);
      const tutor = mockTutors.find((t) => t.id === booking.tutorId);
      return {
        student: { role: "student", id: booking.studentId, userId: student?.userId ?? "", name: student?.fullName ?? "Student" },
        tutor: { role: "tutor", id: booking.tutorId, userId: tutor?.userId ?? "", name: tutor?.headline ?? "Tutor" },
      };
    }
    return apiRequest<LessonParticipants>(ENDPOINTS.lessons.participants(bookingId));
  },
};
