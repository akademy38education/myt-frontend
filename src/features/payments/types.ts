import type { Payment, PaymentMethod, PaymentStatus } from "@myt/shared";

export interface PaymentSummary {
  thisMonth: number;
  lastMonth: number;
  upcoming: number;
  overdueCount: number;
  currency: string;
}

export interface PaymentFilter {
  childId?: string;
  status?: PaymentStatus;
  from?: string;
  to?: string;
}

export type { Payment, PaymentMethod };
