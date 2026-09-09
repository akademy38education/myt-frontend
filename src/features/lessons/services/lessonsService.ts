import { BookingStatus, type Booking } from "@myt/shared";
import { bookingsService } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { SUBJECTS } from "@/constants/subjects";
import { mockLessons } from "@/mocks";
import { getLessonMeta } from "../lessonMeta";
import type { LessonView, LessonViewState } from "../types";

const STARTING_SOON_WINDOW_MS = 60 * 60 * 1000; // within 1 hour counts as "starting soon"

function computeState(booking: Booking): LessonViewState {
  if (booking.status === BookingStatus.CANCELLED) return "cancelled";
  if (booking.status === BookingStatus.NO_SHOW) return "missed";
  if (booking.status === BookingStatus.COMPLETED) return "completed";

  const start = new Date(booking.scheduledStart).getTime();
  const end = new Date(booking.scheduledEnd).getTime();
  const now = Date.now();
  if (now >= start && now <= end) return "ready-to-join";
  if (start - now <= STARTING_SOON_WINDOW_MS && start > now) return "starting-soon";
  return "upcoming";
}

async function toLessonView(booking: Booking, tutorNameById: Map<string, string>): Promise<LessonView> {
  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
  const lesson = mockLessons.find((l) => l.bookingId === booking.id);
  const meta = getLessonMeta(booking.id);

  return {
    booking,
    lesson,
    meta,
    tutorName: tutorNameById.get(booking.tutorId) ?? "Your tutor",
    subjectName,
    state: computeState(booking),
  };
}

export const lessonsService = {
  /**
   * The student's full lesson history — real `Booking` data from the live
   * backend, merged with mock `Lesson`/`LessonMeta` detail (topic, prep,
   * resources) since those entities are still backend-scaffolded. See
   * `features/lessons/lessonMeta.ts`.
   */
  async list(studentId: string): Promise<LessonView[]> {
    const bookings = await bookingsService.list({ studentId });
    const tutorIds = Array.from(new Set(bookings.map((b) => b.tutorId)));
    const tutors = await Promise.all(tutorIds.map((id) => tutorsService.getById(id).catch(() => undefined)));
    const tutorNameById = new Map(tutors.filter(Boolean).map((t) => [t!.id, t!.headline]));

    const views = await Promise.all(bookings.map((b) => toLessonView(b, tutorNameById)));
    return views.sort((a, b) => b.booking.scheduledStart.localeCompare(a.booking.scheduledStart));
  },

  async getById(studentId: string, bookingId: string): Promise<LessonView | undefined> {
    const lessons = await this.list(studentId);
    return lessons.find((l) => l.booking.id === bookingId);
  },
};
