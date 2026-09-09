import type { Booking, CancelBookingInput, CheckoutInput, CreateBookingInput, Payment, RescheduleBookingInput } from "@myt/shared";
import { PaymentStatus, BookingStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors } from "@/mocks";
import { randomUUID } from "@/utils/uuid";
import { pricingService } from "../pricing";
import { useMockBookingsStore } from "../mockBookingsStore";

export interface BookingFilter {
  studentId?: string;
  tutorId?: string;
}

const ACTIVE_STATUSES = new Set<BookingStatus>([BookingStatus.PENDING, BookingStatus.CONFIRMED]);

function findOverlapping(bookings: Booking[], params: { tutorId?: string; studentId?: string; start: Date; end: Date; excludeId?: string }): Booking[] {
  return bookings.filter((b) => {
    if (b.id === params.excludeId) return false;
    if (!ACTIVE_STATUSES.has(b.status)) return false;
    const matchesParty = (params.tutorId && b.tutorId === params.tutorId) || (params.studentId && b.studentId === params.studentId);
    if (!matchesParty) return false;
    const existingStart = new Date(b.scheduledStart).getTime();
    const existingEnd = new Date(b.scheduledEnd).getTime();
    return existingStart < params.end.getTime() && existingEnd > params.start.getTime();
  });
}

class BookingConflictError extends Error {
  code = "BOOKING_CONFLICT";
}

/** True for a 409 from the real API (`ApiError.code`) or the mock service's equivalent — the one error the booking wizard must specifically recover from (refresh availability, don't just show a generic error). */
export function isBookingConflictError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === "BOOKING_CONFLICT");
}

export const bookingsService = {
  async list(filter: BookingFilter): Promise<Booking[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockBookingsStore.getState().bookings.filter((b) => (!filter.studentId || b.studentId === filter.studentId) && (!filter.tutorId || b.tutorId === filter.tutorId));
    }
    return apiRequest<Booking[]>(ENDPOINTS.bookings.list, { query: { studentId: filter.studentId, tutorId: filter.tutorId } });
  },

  async getById(id: string): Promise<Booking> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const booking = useMockBookingsStore.getState().bookings.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");
      return booking;
    }
    return apiRequest<Booking>(ENDPOINTS.bookings.byId(id));
  },

  async create(studentId: string, input: CreateBookingInput): Promise<Booking> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const tutor = mockTutors.find((t) => t.id === input.tutorId);
      if (!tutor) throw new Error("Tutor not found");

      const start = new Date(input.scheduledStart);
      const end = new Date(input.scheduledEnd);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
      const { bookings } = useMockBookingsStore.getState();

      if (findOverlapping(bookings, { tutorId: tutor.id, start, end }).length > 0) {
        throw new BookingConflictError("That time was just booked. Please choose another time.");
      }
      if (findOverlapping(bookings, { studentId, start, end }).length > 0) {
        throw new BookingConflictError("You already have a lesson at this time. Choose another time.");
      }

      const booking: Booking = {
        id: randomUUID(),
        studentId,
        tutorId: tutor.id,
        subjectId: input.subjectId,
        lessonType: input.lessonType,
        status: BookingStatus.PENDING,
        scheduledStart: start.toISOString(),
        scheduledEnd: end.toISOString(),
        durationMinutes,
        studentTimezone: input.studentTimezone,
        tutorTimezone: tutor.timezone ?? "Europe/London",
        priceTotal: pricingService.calculatePrice(tutor, durationMinutes, input.lessonType),
        currency: tutor.currency,
        paymentStatus: PaymentStatus.PENDING,
        notes: input.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useMockBookingsStore.getState().add(booking);
      return useMockBookingsStore.getState().update(booking.id, { meetingUrl: `https://meet.myt.dev/${booking.id}` }) ?? booking;
    }
    return apiRequest<Booking>(ENDPOINTS.bookings.create, { method: "POST", body: input });
  },

  async reschedule(id: string, input: RescheduleBookingInput): Promise<Booking> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const { bookings, update } = useMockBookingsStore.getState();
      const booking = bookings.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");

      const start = new Date(input.scheduledStart);
      const end = new Date(input.scheduledEnd);
      if (findOverlapping(bookings, { tutorId: booking.tutorId, start, end, excludeId: id }).length > 0) {
        throw new BookingConflictError("That time was just booked. Please choose another time.");
      }

      const updated = update(id, {
        scheduledStart: start.toISOString(),
        scheduledEnd: end.toISOString(),
        durationMinutes: Math.round((end.getTime() - start.getTime()) / 60000),
        rescheduledAt: new Date().toISOString(),
        rescheduleReason: input.reason,
        previousScheduledStart: booking.scheduledStart,
        previousScheduledEnd: booking.scheduledEnd,
      });
      if (!updated) throw new Error("Booking not found");
      return updated;
    }
    return apiRequest<Booking>(ENDPOINTS.bookings.reschedule(id), { method: "PATCH", body: input });
  },

  async cancel(id: string, input: CancelBookingInput = {}): Promise<Booking> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const updated = useMockBookingsStore.getState().update(id, {
        status: BookingStatus.CANCELLED,
        cancellationReason: input.reason ?? input.notes,
        cancelledBy: "student",
      });
      if (!updated) throw new Error("Booking not found");
      return updated;
    }
    return apiRequest<Booking>(ENDPOINTS.bookings.cancel(id), { method: "POST", body: input });
  },

  /**
   * Charges a booking for real — the backend is the only party that ever
   * marks a booking paid (Phase 13 spec §1-16); nothing here can fake
   * success. The mock path still simulates a real charge outcome (updating
   * the mock booking store, not just returning a canned response) so
   * `VITE_USE_MOCK_API=true` demos the same checkout→paid transition a real
   * backend call produces.
   */
  async checkout(id: string, input: CheckoutInput): Promise<Payment> {
    if (env.VITE_USE_MOCK_API) {
      await delay(600);
      const { bookings, update } = useMockBookingsStore.getState();
      const booking = bookings.find((b) => b.id === id);
      if (!booking) throw new Error("Booking not found");
      const updated = update(id, { paymentStatus: PaymentStatus.PAID }) ?? booking;
      const now = new Date().toISOString();
      const payment: Payment = {
        id: `payment-${updated.id}`,
        bookingId: updated.id,
        payerId: "mock-payer",
        amount: updated.priceTotal,
        currency: updated.currency,
        status: PaymentStatus.PAID,
        studentId: updated.studentId,
        subjectId: updated.subjectId,
        lessonDate: updated.scheduledStart,
        description: `${updated.durationMinutes}-minute lesson`,
        paidAt: now,
        reference: `TXN-${updated.id.toUpperCase()}`,
        createdAt: updated.createdAt,
        updatedAt: now,
      };
      return payment;
    }
    return apiRequest<Payment>(ENDPOINTS.bookings.checkout(id), { method: "POST", body: input });
  },
};
