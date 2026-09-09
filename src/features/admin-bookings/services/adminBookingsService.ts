import type { Booking, Lesson } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockBookings } from "@/mocks";
import type { AdminBookingFilter } from "../types";

function applyFilter(bookings: Booking[], filter: AdminBookingFilter): Booking[] {
  let result = bookings;
  if (filter.status) result = result.filter((b) => b.status === filter.status);
  if (filter.studentId) result = result.filter((b) => b.studentId === filter.studentId);
  if (filter.tutorId) result = result.filter((b) => b.tutorId === filter.tutorId);
  return result;
}

export const adminBookingsService = {
  async list(filter: AdminBookingFilter = {}): Promise<Booking[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return applyFilter(mockBookings, filter)
        .slice()
        .sort((a, b) => b.scheduledStart.localeCompare(a.scheduledStart));
    }
    return apiRequest<Booking[]>(ENDPOINTS.admin.bookings, { query: { status: filter.status, studentId: filter.studentId, tutorId: filter.tutorId } });
  },

  /**
   * A `Lesson` only exists once a booking's live-classroom session has
   * actually started — mock mode has no persisted lesson store to draw from
   * (unlike bookings/payments), so it honestly returns nothing rather than
   * fabricating lesson records (same precedent as `reportsService`).
   */
  async listLessons(): Promise<Lesson[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<Lesson[]>(ENDPOINTS.admin.lessons);
  },
};
