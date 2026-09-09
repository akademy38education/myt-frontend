/**
 * Machine-readable error codes returned in ApiErrorResponse.error.code.
 * Keep these stable — the frontend may branch on them.
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  BOOKING_CONFLICT: "BOOKING_CONFLICT",
  PAYMENT_PROVIDER_ERROR: "PAYMENT_PROVIDER_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
