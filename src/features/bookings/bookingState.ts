import { BookingStatus, type Booking } from "@myt/shared";

export type DisplayBookingState = "pending" | "confirmed" | "starting-soon" | "in-progress" | "completed" | "cancelled" | "rescheduled" | "no-show";

const STARTING_SOON_WINDOW_MS = 60 * 60 * 1000;

/**
 * `BookingStatus` on the record only ever holds the durable states
 * (PENDING/CONFIRMED/CANCELLED/COMPLETED/NO_SHOW) — "Starting Soon" and
 * "In Progress" are time-derived, computed here rather than stored, so
 * they're always correct without a cron job editing every booking. A
 * recently-rescheduled CONFIRMED booking is flagged distinctly for a short
 * window so the change stays visible without needing its own storage
 * status (see `Booking.rescheduledAt`).
 */
export function computeDisplayState(booking: Booking): DisplayBookingState {
  if (booking.status === BookingStatus.CANCELLED) return "cancelled";
  if (booking.status === BookingStatus.NO_SHOW) return "no-show";
  if (booking.status === BookingStatus.COMPLETED) return "completed";

  const start = new Date(booking.scheduledStart).getTime();
  const end = new Date(booking.scheduledEnd).getTime();
  const now = Date.now();

  if (now >= start && now <= end) return "in-progress";

  const recentlyRescheduled = booking.rescheduledAt && Date.now() - new Date(booking.rescheduledAt).getTime() < 24 * 60 * 60 * 1000;
  if (recentlyRescheduled && start > now) return "rescheduled";

  if (start > now && start - now <= STARTING_SOON_WINDOW_MS) return "starting-soon";
  if (booking.status === BookingStatus.PENDING) return "pending";
  return "confirmed";
}

export function isUpcoming(booking: Booking): boolean {
  const state = computeDisplayState(booking);
  return state === "pending" || state === "confirmed" || state === "starting-soon" || state === "in-progress" || state === "rescheduled";
}

export function canManageBooking(booking: Booking): boolean {
  const state = computeDisplayState(booking);
  return state === "pending" || state === "confirmed" || state === "starting-soon" || state === "rescheduled";
}
