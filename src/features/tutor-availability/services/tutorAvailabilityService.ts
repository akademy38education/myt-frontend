import type { TutorAvailabilityDay } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors, mockBookings } from "@/mocks";
import { computeAvailabilityDays } from "../availabilityGenerator";

export const tutorAvailabilityService = {
  async getSlots(tutorId: string): Promise<TutorAvailabilityDay[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === tutorId);
      if (!tutor) return [];
      const bookedStarts = mockBookings
        .filter((b) => b.tutorId === tutorId && (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING))
        .map((b) => new Date(b.scheduledStart));
      return computeAvailabilityDays(tutor, bookedStarts);
    }
    return apiRequest<TutorAvailabilityDay[]>(ENDPOINTS.tutors.availability(tutorId));
  },
};
