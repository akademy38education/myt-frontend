import type { Booking, TutorStudentNote } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockBookings, mockStudents } from "@/mocks";
import type { TutorStudentDetail, TutorStudentSummary } from "../types";

function studentDisplay(studentId: string): { name: string; avatarUrl?: string } {
  const student = mockStudents.find((s) => s.id === studentId);
  return { name: student?.fullName ?? "Student", avatarUrl: student?.avatarUrl };
}

function mockRoster(tutorId: string): TutorStudentSummary[] {
  const bookings = mockBookings.filter((b) => b.tutorId === tutorId);
  const byStudent = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const list = byStudent.get(booking.studentId) ?? [];
    list.push(booking);
    byStudent.set(booking.studentId, list);
  }
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  return Array.from(byStudent.entries()).map(([studentId, studentBookings]) => {
    const sorted = [...studentBookings].sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
    const past = sorted.filter((b) => new Date(b.scheduledStart).getTime() <= now && b.status === BookingStatus.COMPLETED);
    const future = sorted.filter((b) => new Date(b.scheduledStart).getTime() > now && b.status !== BookingStatus.CANCELLED);
    const lastLessonAt = past.length > 0 ? past[past.length - 1]!.scheduledStart : undefined;
    const nextLessonAt = future.length > 0 ? future[0]!.scheduledStart : undefined;
    const isActive = Boolean(nextLessonAt) || (lastLessonAt ? new Date(lastLessonAt).getTime() >= thirtyDaysAgo : false);
    const display = studentDisplay(studentId);
    return {
      studentId,
      name: display.name,
      avatarUrl: display.avatarUrl,
      subjects: Array.from(new Set(studentBookings.map((b) => b.subjectId))),
      lessonsCount: past.length,
      lastLessonAt,
      nextLessonAt,
      status: isActive ? ("active" as const) : ("inactive" as const),
    };
  });
}

let mockNotes: TutorStudentNote[] = [];

export const tutorStudentsService = {
  async list(tutorId: string): Promise<TutorStudentSummary[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockRoster(tutorId);
    }
    return apiRequest<TutorStudentSummary[]>(ENDPOINTS.tutors.students(tutorId));
  },

  async getDetail(tutorId: string, studentId: string): Promise<TutorStudentDetail> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const student = mockStudents.find((s) => s.id === studentId);
      const bookings = mockBookings.filter((b) => b.tutorId === tutorId && b.studentId === studentId);
      if (!student || bookings.length === 0) throw new Error("This student has no lessons with you");
      const now = Date.now();
      const sorted = [...bookings].sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
      const past = sorted.filter((b) => new Date(b.scheduledStart).getTime() <= now && b.status === BookingStatus.COMPLETED);
      const future = sorted.filter((b) => new Date(b.scheduledStart).getTime() > now && b.status !== BookingStatus.CANCELLED);
      const attended = bookings.filter((b) => b.status === BookingStatus.COMPLETED).length;
      const noShows = bookings.filter((b) => b.status === BookingStatus.NO_SHOW).length;
      return {
        student,
        name: studentDisplay(studentId).name,
        bookings: [...sorted].reverse(),
        lessonsCount: past.length,
        lastLessonAt: past.length > 0 ? past[past.length - 1]!.scheduledStart : undefined,
        nextLessonAt: future.length > 0 ? future[0]!.scheduledStart : undefined,
        attendanceRate: attended + noShows > 0 ? Math.round((attended / (attended + noShows)) * 100) : 100,
      };
    }
    return apiRequest<TutorStudentDetail>(ENDPOINTS.tutors.student(tutorId, studentId));
  },

  async getNotes(tutorId: string, studentId: string): Promise<TutorStudentNote[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockNotes.filter((n) => n.tutorId === tutorId && n.studentId === studentId);
    }
    return apiRequest<TutorStudentNote[]>(ENDPOINTS.tutors.studentNotes(tutorId, studentId));
  },

  async addNote(tutorId: string, studentId: string, body: string): Promise<TutorStudentNote> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const note: TutorStudentNote = { id: `note-${Date.now()}`, tutorId, studentId, body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockNotes = [note, ...mockNotes];
      return note;
    }
    return apiRequest<TutorStudentNote>(ENDPOINTS.tutors.studentNotes(tutorId, studentId), { method: "POST", body: { body } });
  },
};
