import type { EarningsEntry, EarningsStatus, Payment, PaymentStatus, Payout, PayoutStatus } from "@myt/shared";

export interface AdminPaymentFilter {
  childId?: string;
  status?: PaymentStatus;
  from?: string;
  to?: string;
}

export interface AdminPayoutFilter {
  tutorId?: string;
  status?: PayoutStatus;
}

export interface AdminEarningsEntryFilter {
  tutorId?: string;
  from?: string;
  to?: string;
  status?: EarningsStatus;
}

export type { Payment, Payout, EarningsEntry };
