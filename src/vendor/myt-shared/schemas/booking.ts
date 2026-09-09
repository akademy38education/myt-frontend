import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  subjectId: z.string().min(1),
  lessonType: z.enum(["regular", "trial"]).default("regular"),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  studentTimezone: z.string().min(1),
  notes: z.string().max(1000).optional(),
  /** Set when a parent is booking on behalf of one of their children — the backend still resolves and re-verifies the parent-child relationship itself, this is never trusted as-is (see bookings.controller.ts). Omitted entirely for a student booking for themselves. */
  childId: z.string().min(1).optional(),
  /** Lets a client safely retry a booking request (e.g. after a network timeout) without risking a duplicate lesson — see bookings.service.ts. */
  idempotencyKey: z.string().min(1).max(100).optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const rescheduleBookingSchema = z.object({
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  reason: z.string().max(500).optional(),
});
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;

export const CANCELLATION_REASONS = ["Schedule changed", "Found another time", "No longer need lesson", "Tutor issue", "Other"] as const;

export const cancelBookingSchema = z.object({
  reason: z.enum(CANCELLATION_REASONS).optional(),
  notes: z.string().max(500).optional(),
});
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
