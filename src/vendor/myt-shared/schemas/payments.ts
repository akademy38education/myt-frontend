import { z } from "zod";

/**
 * Pays for an already-created booking, addressed by `:id` in
 * `POST /bookings/:id/checkout` (`POST /bookings` still only reserves the
 * slot — see Phase 13 spec §1-3). `idempotencyKey` follows the same
 * client-generated-UUID convention as `createBookingSchema`, so a retried
 * click or a network timeout never double-charges.
 */
export const checkoutSchema = z.object({
  paymentMethodId: z.string().min(1),
  idempotencyKey: z.string().min(1),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
