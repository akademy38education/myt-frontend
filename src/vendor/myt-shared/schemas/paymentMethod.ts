import { z } from "zod";

/**
 * Tokenized metadata only — a real integration would also carry a
 * `providerToken` issued by the payment provider's client SDK (Stripe
 * Elements, etc); the raw card number/CVV never reaches this backend or any
 * MyT server, by construction (Phase 9 spec §42/§43).
 */
export const addPaymentMethodSchema = z.object({
  brand: z.enum(["visa", "mastercard", "amex", "other"]),
  last4: z.string().length(4),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  isDefault: z.boolean().default(false),
});
export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodSchema>;
