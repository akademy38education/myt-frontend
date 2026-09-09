import type { Booking, TutorProfile, TutorSettingsInput, UpdateTutorProfileInput } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors, mockBookings, mockStudents } from "@/mocks";
import type { TutorDashboardSummary } from "../types";

/** Mirrors backend/src/modules/earnings/earnings.repository.ts's PLATFORM_FEE_RATE — the mock branch computes the same way so switching VITE_USE_MOCK_API never changes what a number means, only where it comes from. */
const PLATFORM_FEE_RATE = 0.1;

function netOf(booking: Booking): number {
  return Math.round(booking.priceTotal * (1 - PLATFORM_FEE_RATE) * 100) / 100;
}

function studentName(studentId: string): string {
  return mockStudents.find((s) => s.id === studentId)?.fullName ?? "Student";
}

function mockDashboardSummary(tutor: TutorProfile): TutorDashboardSummary {
  const bookings = mockBookings.filter((b) => b.tutorId === tutor.id);
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const isToday = (iso: string) => {
    const t = new Date(iso).getTime();
    return t >= todayStart.getTime() && t <= todayEnd.getTime();
  };

  const upcoming = bookings
    .filter((b) => (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING) && new Date(b.scheduledStart).getTime() > now)
    .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
  const todaysBookings = bookings.filter((b) => b.status !== BookingStatus.CANCELLED && isToday(b.scheduledStart));
  const completed = bookings.filter((b) => b.status === BookingStatus.COMPLETED);
  const finished = bookings.filter((b) => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED || b.status === BookingStatus.NO_SHOW);
  const nextBooking = upcoming[0];

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const monthStart = new Date();
  monthStart.setHours(0, 0, 0, 0);
  monthStart.setDate(1);

  const completedThisWeek = completed.filter((b) => new Date(b.scheduledStart).getTime() >= weekStart.getTime());

  return {
    tutorId: tutor.id,
    upcomingSessionsCount: upcoming.length,
    studentsCount: new Set(bookings.map((b) => b.studentId)).size,
    averageRating: tutor.rating,
    pendingHomeworkReviews: 0,
    todaysLessonsCount: todaysBookings.length,
    todaysStudentsCount: new Set(todaysBookings.map((b) => b.studentId)).size,
    todaysTeachingMinutes: todaysBookings.reduce((sum, b) => sum + b.durationMinutes, 0),
    todaysEarnings: Math.round(completed.filter((b) => isToday(b.scheduledStart)).reduce((sum, b) => sum + netOf(b), 0) * 100) / 100,
    nextLesson: nextBooking
      ? {
          bookingId: nextBooking.id,
          studentId: nextBooking.studentId,
          studentName: studentName(nextBooking.studentId),
          subjectId: nextBooking.subjectId,
          scheduledStart: nextBooking.scheduledStart,
          scheduledEnd: nextBooking.scheduledEnd,
        }
      : null,
    todaysSchedule: todaysBookings
      .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))
      .map((b) => ({ bookingId: b.id, studentId: b.studentId, studentName: studentName(b.studentId), subjectId: b.subjectId, scheduledStart: b.scheduledStart, scheduledEnd: b.scheduledEnd, status: b.status })),
    lessonsThisWeek: completedThisWeek.length,
    hoursTaughtThisWeek: Math.round((completedThisWeek.reduce((sum, b) => sum + b.durationMinutes, 0) / 60) * 10) / 10,
    completionRate: finished.length > 0 ? Math.round((completed.length / finished.length) * 100) : 100,
    earningsThisWeek: Math.round(completedThisWeek.reduce((sum, b) => sum + netOf(b), 0) * 100) / 100,
    earningsThisMonth: Math.round(completed.filter((b) => new Date(b.scheduledStart).getTime() >= monthStart.getTime()).reduce((sum, b) => sum + netOf(b), 0) * 100) / 100,
    earningsPending: 0,
    earningsAvailable: Math.round(completed.reduce((sum, b) => sum + netOf(b), 0) * 100) / 100,
    recentStudents: [...completed]
      .sort((a, b) => b.scheduledStart.localeCompare(a.scheduledStart))
      .filter((b, index, all) => all.findIndex((other) => other.studentId === b.studentId) === index)
      .slice(0, 5)
      .map((b) => ({ studentId: b.studentId, name: studentName(b.studentId), subjectId: b.subjectId, lastLessonAt: b.scheduledStart })),
    attentionItems: bookings.some((b) => b.status === BookingStatus.PENDING) ? ["You have booking requests awaiting a response."] : [],
    unfinishedSummariesCount: 0,
  };
}

export const tutorsService = {
  async getById(tutorId: string): Promise<TutorProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === tutorId || t.userId === tutorId);
      if (!tutor) throw new Error("Tutor not found");
      return tutor;
    }
    return apiRequest<TutorProfile>(ENDPOINTS.tutors.byId(tutorId));
  },

  async updateProfile(tutorId: string, input: UpdateTutorProfileInput): Promise<TutorProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === tutorId);
      if (!tutor) throw new Error("Tutor not found");
      Object.assign(tutor, input, { updatedAt: new Date().toISOString() });
      return tutor;
    }
    return apiRequest<TutorProfile>(ENDPOINTS.tutors.byId(tutorId), { method: "PATCH", body: input });
  },

  async updateSettings(tutorId: string, input: TutorSettingsInput): Promise<TutorProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === tutorId);
      if (!tutor) throw new Error("Tutor not found");
      tutor.notificationPreferences = input.notificationPreferences;
      tutor.updatedAt = new Date().toISOString();
      return tutor;
    }
    return apiRequest<TutorProfile>(ENDPOINTS.tutors.settings(tutorId), { method: "PATCH", body: input });
  },

  async getDashboardSummary(tutorId: string): Promise<TutorDashboardSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === tutorId);
      if (!tutor) throw new Error("Tutor not found");
      return mockDashboardSummary(tutor);
    }
    return apiRequest<TutorDashboardSummary>(ENDPOINTS.tutors.dashboard(tutorId));
  },
};
