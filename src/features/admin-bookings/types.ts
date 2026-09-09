import type { Booking, BookingStatus, Lesson } from "@myt/shared";

export interface AdminBookingFilter {
  status?: BookingStatus;
  studentId?: string;
  tutorId?: string;
}

export type { Booking, Lesson };
