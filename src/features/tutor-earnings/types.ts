import type { EarningsEntry, EarningsStatus, Payout } from "@myt/shared";

export interface EarningsSummary {
  totalEarnings: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
  available: number;
  paid: number;
  currency: string;
}

export interface EarningsFilter {
  from?: string;
  to?: string;
  status?: EarningsStatus;
  studentId?: string;
  subjectId?: string;
}

export type { EarningsEntry, Payout };
