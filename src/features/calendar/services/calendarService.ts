import { bookingsService } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { tutorScheduleService } from "@/features/tutor-schedule";
import { mockHomework, mockExams } from "@/mocks";
import { useGoalsStore } from "@/features/goals/store";
import { SUBJECTS } from "@/constants/subjects";
import type { CalendarEvent } from "../types";

async function lessonEventsFor(bookings: Awaited<ReturnType<typeof bookingsService.list>>, basePath: string): Promise<CalendarEvent[]> {
  const tutorIds = Array.from(new Set(bookings.map((b) => b.tutorId)));
  const tutors = await Promise.all(tutorIds.map((id) => tutorsService.getById(id).catch(() => undefined)));
  const tutorNameById = new Map(tutors.filter(Boolean).map((t) => [t!.id, t!.headline]));

  return bookings.map((b) => ({
    id: `lesson-${b.id}`,
    type: "lesson",
    title: `${SUBJECTS.find((s) => s.id === b.subjectId)?.name ?? "Lesson"} lesson`,
    date: b.scheduledStart,
    endDate: b.scheduledEnd,
    link: `${basePath}/${b.id}`,
    booking: b,
    tutorName: tutorNameById.get(b.tutorId) ?? "Tutor",
    subjectName: SUBJECTS.find((s) => s.id === b.subjectId)?.name ?? b.subjectId,
  }));
}

export const calendarService = {
  /**
   * Combines real booking data (live backend) with mock homework/goal/exam
   * due dates (those entities are backend-scaffolded) into one calendar feed.
   */
  async listEvents(studentId: string): Promise<CalendarEvent[]> {
    const bookings = await bookingsService.list({ studentId });
    const goals = useGoalsStore.getState().goals.filter((g) => g.studentId === studentId);

    const lessonEvents = await lessonEventsFor(bookings, "/student/lessons");
    const homeworkEvents: CalendarEvent[] = mockHomework
      .filter((h) => h.studentId === studentId)
      .map((h) => ({ id: `homework-${h.id}`, type: "homework", title: h.title, date: h.dueAt, link: `/student/homework/${h.id}` }));
    const goalEvents: CalendarEvent[] = goals.map((g) => ({ id: `goal-${g.id}`, type: "goal", title: g.title, date: g.targetDate, link: "/student/goals" }));
    const examEvents: CalendarEvent[] = mockExams.map((e) => ({ id: `exam-${e.id}`, type: "exam", title: e.title, date: e.date, link: "/student/exams" }));

    return [...lessonEvents, ...homeworkEvents, ...goalEvents, ...examEvents].sort((a, b) => a.date.localeCompare(b.date));
  },

  /** A tutor's own calendar: lessons they're teaching, plus their own blocked time — no homework/goals/exams (those are student-scoped). */
  async listTutorEvents(tutorId: string): Promise<CalendarEvent[]> {
    const bookings = await bookingsService.list({ tutorId });
    const lessonEvents = await lessonEventsFor(bookings, "/tutor/bookings");

    const from = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const blocks = await tutorScheduleService.getBlocks(tutorId, from, to);
    const blockedEvents: CalendarEvent[] = blocks
      .filter((b) => b.type === "blocked")
      .map((b) => ({
        id: `block-${b.id}`,
        type: "blocked",
        title: b.reason || "Blocked time",
        date: new Date(`${b.date}T${b.startTime}:00`).toISOString(),
        endDate: new Date(`${b.date}T${b.endTime}:00`).toISOString(),
        link: "/tutor/availability",
      }));

    return [...lessonEvents, ...blockedEvents].sort((a, b) => a.date.localeCompare(b.date));
  },
};
