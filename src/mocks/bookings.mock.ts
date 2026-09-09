import { BookingStatus, PaymentStatus, type Booking } from "@myt/shared";

/** Mirrors `backend/src/models/seedData.ts`'s `seedBookings` field-for-field (same ids, same relative dates) so `VITE_USE_MOCK_API` never changes what "My Lessons"/calendar/booking history look like. */
const now = new Date().toISOString();
const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
const inFiveDays = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

function booking(partial: Pick<Booking, "id" | "tutorId" | "subjectId" | "status" | "scheduledStart" | "scheduledEnd" | "priceTotal" | "createdAt" | "updatedAt"> & Partial<Booking>): Booking {
  return {
    studentId: "student-1",
    currency: "GBP",
    lessonType: "regular",
    durationMinutes: Math.round((new Date(partial.scheduledEnd).getTime() - new Date(partial.scheduledStart).getTime()) / 60000),
    studentTimezone: "Europe/London",
    tutorTimezone: "Europe/London",
    paymentStatus: partial.status === BookingStatus.CANCELLED ? PaymentStatus.REFUNDED : partial.status === BookingStatus.PENDING ? PaymentStatus.PENDING : PaymentStatus.PAID,
    meetingUrl: partial.status === BookingStatus.CANCELLED ? undefined : `https://meet.myt.dev/${partial.id}`,
    ...partial,
  };
}

export const mockBookings: Booking[] = [
  booking({
    id: "booking-1",
    tutorId: "tutor-1",
    subjectId: "subject-maths",
    status: BookingStatus.CONFIRMED,
    scheduledStart: new Date(inTwoDays.setHours(16, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(inTwoDays.setHours(17, 0, 0, 0)).toISOString(),
    priceTotal: 42,
    notes: "Focus on quadratic equations ahead of the mock exam.",
    createdAt: now,
    updatedAt: now,
  }),
  booking({
    id: "booking-2",
    tutorId: "tutor-2",
    subjectId: "subject-english",
    status: BookingStatus.PENDING,
    scheduledStart: new Date(inFiveDays.setHours(10, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(inFiveDays.setHours(11, 0, 0, 0)).toISOString(),
    priceTotal: 35,
    createdAt: now,
    updatedAt: now,
  }),
  booking({
    id: "booking-past-1",
    tutorId: "tutor-1",
    subjectId: "subject-maths",
    status: BookingStatus.COMPLETED,
    scheduledStart: new Date(daysAgo(13).setHours(16, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(daysAgo(13).setHours(17, 0, 0, 0)).toISOString(),
    priceTotal: 42,
    createdAt: daysAgo(14).toISOString(),
    updatedAt: daysAgo(13).toISOString(),
  }),
  booking({
    id: "booking-past-2",
    tutorId: "tutor-2",
    subjectId: "subject-english",
    status: BookingStatus.COMPLETED,
    scheduledStart: new Date(daysAgo(20).setHours(9, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(daysAgo(20).setHours(10, 0, 0, 0)).toISOString(),
    priceTotal: 35,
    createdAt: daysAgo(21).toISOString(),
    updatedAt: daysAgo(20).toISOString(),
  }),
  booking({
    id: "booking-past-3",
    tutorId: "tutor-1",
    subjectId: "subject-physics",
    status: BookingStatus.NO_SHOW,
    scheduledStart: new Date(daysAgo(27).setHours(16, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(daysAgo(27).setHours(17, 0, 0, 0)).toISOString(),
    priceTotal: 42,
    createdAt: daysAgo(28).toISOString(),
    updatedAt: daysAgo(27).toISOString(),
  }),
  booking({
    id: "booking-past-4",
    tutorId: "tutor-1",
    subjectId: "subject-maths",
    status: BookingStatus.CANCELLED,
    scheduledStart: new Date(daysAgo(6).setHours(16, 0, 0, 0)).toISOString(),
    scheduledEnd: new Date(daysAgo(6).setHours(17, 0, 0, 0)).toISOString(),
    priceTotal: 42,
    cancellationReason: "Schedule changed",
    cancelledBy: "student",
    createdAt: daysAgo(9).toISOString(),
    updatedAt: daysAgo(7).toISOString(),
  }),
];
