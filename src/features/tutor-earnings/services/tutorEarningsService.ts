import type { Booking, EarningsEntry, EarningsStatus, Payout } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { apiRequest, apiRequestText } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockBookings } from "@/mocks";
import type { EarningsFilter, EarningsSummary } from "../types";

/** Mirrors backend/src/modules/earnings/earnings.repository.ts's PLATFORM_FEE_RATE. */
const PLATFORM_FEE_RATE = 0.1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function round2(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function toEntry(booking: Booking): EarningsEntry {
  const grossAmount = booking.priceTotal;
  const platformFeeAmount = round2(grossAmount * PLATFORM_FEE_RATE);
  const netAmount = round2(grossAmount - platformFeeAmount);
  const daysSince = (Date.now() - new Date(booking.scheduledStart).getTime()) / MS_PER_DAY;
  const status: EarningsStatus = daysSince > 14 ? "paid" : daysSince > 3 ? "available" : "pending";
  return {
    id: `earnings-${booking.id}`,
    tutorId: booking.tutorId,
    bookingId: booking.id,
    studentId: booking.studentId,
    subjectId: booking.subjectId,
    lessonDate: booking.scheduledStart,
    durationMinutes: booking.durationMinutes,
    grossAmount,
    platformFeeAmount,
    netAmount,
    currency: booking.currency,
    status,
    createdAt: booking.updatedAt,
    updatedAt: booking.updatedAt,
  };
}

function mockEntries(tutorId: string): EarningsEntry[] {
  return mockBookings
    .filter((b) => b.tutorId === tutorId && b.status === BookingStatus.COMPLETED)
    .map(toEntry)
    .sort((a, b) => b.lessonDate.localeCompare(a.lessonDate));
}

function applyFilter(entries: EarningsEntry[], filter: EarningsFilter): EarningsEntry[] {
  let result = entries;
  const { from, to } = filter;
  if (from) result = result.filter((e) => e.lessonDate >= from);
  if (to) result = result.filter((e) => e.lessonDate <= to);
  if (filter.status) result = result.filter((e) => e.status === filter.status);
  if (filter.studentId) result = result.filter((e) => e.studentId === filter.studentId);
  if (filter.subjectId) result = result.filter((e) => e.subjectId === filter.subjectId);
  return result;
}

function toCsv(entries: EarningsEntry[]): string {
  const header = "Date,Booking,Student,Subject,Duration (min),Gross,Fee,Net,Currency,Status";
  const rows = entries.map((e) => [e.lessonDate.slice(0, 10), e.bookingId, e.studentId, e.subjectId, e.durationMinutes, e.grossAmount.toFixed(2), e.platformFeeAmount.toFixed(2), e.netAmount.toFixed(2), e.currency, e.status].join(","));
  return [header, ...rows].join("\n");
}

export const tutorEarningsService = {
  async getSummary(tutorId: string): Promise<EarningsSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const entries = mockEntries(tutorId);
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const monthStart = new Date();
      monthStart.setHours(0, 0, 0, 0);
      monthStart.setDate(1);
      const sum = (list: EarningsEntry[]) => round2(list.reduce((s, e) => s + e.netAmount, 0));
      return {
        totalEarnings: sum(entries),
        thisWeek: sum(entries.filter((e) => new Date(e.lessonDate).getTime() >= weekStart.getTime())),
        thisMonth: sum(entries.filter((e) => new Date(e.lessonDate).getTime() >= monthStart.getTime())),
        pending: sum(entries.filter((e) => e.status === "pending")),
        available: sum(entries.filter((e) => e.status === "available")),
        paid: sum(entries.filter((e) => e.status === "paid")),
        currency: entries[0]?.currency ?? "GBP",
      };
    }
    return apiRequest<EarningsSummary>(ENDPOINTS.earnings.summary(tutorId));
  },

  async list(tutorId: string, filter: EarningsFilter = {}): Promise<EarningsEntry[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return applyFilter(mockEntries(tutorId), filter);
    }
    return apiRequest<EarningsEntry[]>(ENDPOINTS.earnings.list(tutorId), { query: filter as Record<string, string | undefined> });
  },

  async getPayouts(tutorId: string): Promise<Payout[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const paid = mockEntries(tutorId).filter((e) => e.status === "paid");
      if (paid.length === 0) return [];
      const dates = paid.map((e) => e.lessonDate).sort();
      const now = new Date().toISOString();
      const firstPaid = paid[0]!;
      return [
        {
          id: `payout-${tutorId}-1`,
          tutorId,
          amount: round2(paid.reduce((s, e) => s + e.netAmount, 0)),
          currency: firstPaid.currency,
          status: "paid",
          periodStart: dates[0]!,
          periodEnd: dates[dates.length - 1]!,
          reference: `PYT-${tutorId.toUpperCase()}-0001`,
          paidAt: now,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }
    return apiRequest<Payout[]>(ENDPOINTS.earnings.payouts(tutorId));
  },

  async exportCsv(tutorId: string, filter: EarningsFilter = {}): Promise<string> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return toCsv(applyFilter(mockEntries(tutorId), filter));
    }
    return apiRequestText(ENDPOINTS.earnings.export(tutorId), { query: filter as Record<string, string | undefined> });
  },
};
