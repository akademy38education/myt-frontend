import { BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockBookings, mockReviews, mockTutors } from "@/mocks";
import type { TutorPerformance } from "../types";

function startOfWeek(date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);
  return result;
}

function mockPerformance(tutorId: string): TutorPerformance {
  const tutor = mockTutors.find((t) => t.id === tutorId);
  const bookings = mockBookings.filter((b) => b.tutorId === tutorId);
  const reviews = mockReviews.filter((r) => r.tutorId === tutorId);
  const weekStart = startOfWeek().getTime();
  const monthStart = new Date();
  monthStart.setHours(0, 0, 0, 0);
  monthStart.setDate(1);

  const completed = bookings.filter((b) => b.status === BookingStatus.COMPLETED);
  const finished = bookings.filter((b) => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED || b.status === BookingStatus.NO_SHOW);
  const noShows = bookings.filter((b) => b.status === BookingStatus.NO_SHOW).length;

  const bookingsByStudent = new Map<string, number>();
  for (const booking of bookings) bookingsByStudent.set(booking.studentId, (bookingsByStudent.get(booking.studentId) ?? 0) + 1);
  const returningStudents = Array.from(bookingsByStudent.values()).filter((count) => count > 1).length;

  const lessonsOverTime: Array<{ weekStart: string; count: number }> = [];
  const now = Date.now();
  for (let weeksAgo = 7; weeksAgo >= 0; weeksAgo--) {
    const ws = startOfWeek(new Date(now - weeksAgo * 7 * 24 * 60 * 60 * 1000));
    const we = new Date(ws.getTime() + 7 * 24 * 60 * 60 * 1000);
    const count = completed.filter((b) => {
      const t = new Date(b.scheduledStart).getTime();
      return t >= ws.getTime() && t < we.getTime();
    }).length;
    lessonsOverTime.push({ weekStart: ws.toISOString().slice(0, 10), count });
  }

  return {
    averageRating: tutor?.rating ?? 0,
    totalReviews: reviews.length,
    completionRate: finished.length > 0 ? Math.round((completed.length / finished.length) * 100) : 100,
    attendanceRate: completed.length + noShows > 0 ? Math.round((completed.length / (completed.length + noShows)) * 100) : 100,
    responseTimeMinutes: tutor?.responseTimeMinutes,
    lessonsThisWeek: completed.filter((b) => new Date(b.scheduledStart).getTime() >= weekStart).length,
    lessonsThisMonth: completed.filter((b) => new Date(b.scheduledStart).getTime() >= monthStart.getTime()).length,
    hoursTaughtThisWeek: Math.round((completed.filter((b) => new Date(b.scheduledStart).getTime() >= weekStart).reduce((s, b) => s + b.durationMinutes, 0) / 60) * 10) / 10,
    hoursTaughtThisMonth: Math.round((completed.filter((b) => new Date(b.scheduledStart).getTime() >= monthStart.getTime()).reduce((s, b) => s + b.durationMinutes, 0) / 60) * 10) / 10,
    newStudentsThisMonth: 0,
    returningStudents,
    repeatBookingRate: bookingsByStudent.size > 0 ? Math.round((returningStudents / bookingsByStudent.size) * 100) : 0,
    lessonsOverTime,
    ratingTrend: [...reviews].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((r) => ({ date: r.createdAt.slice(0, 10), rating: r.rating })),
  };
}

export const tutorPerformanceService = {
  async get(tutorId: string): Promise<TutorPerformance> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockPerformance(tutorId);
    }
    return apiRequest<TutorPerformance>(ENDPOINTS.tutors.performance(tutorId));
  },
};
