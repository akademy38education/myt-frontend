import type { EarningsEntry, Payment, Payout, RefundPaymentInput } from "@myt/shared";
import { PaymentStatus } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockPayments } from "@/mocks";
import type { AdminEarningsEntryFilter, AdminPaymentFilter, AdminPayoutFilter } from "../types";

function applyFilter(payments: Payment[], filter: AdminPaymentFilter): Payment[] {
  let result = payments;
  const { childId, status, from, to } = filter;
  if (childId) result = result.filter((p) => p.studentId === childId);
  if (status) result = result.filter((p) => p.status === status);
  if (from) result = result.filter((p) => (p.lessonDate ?? "") >= from);
  if (to) result = result.filter((p) => (p.lessonDate ?? "") <= to);
  return result;
}

export const adminPaymentsService = {
  async list(filter: AdminPaymentFilter = {}): Promise<Payment[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return applyFilter(mockPayments, filter);
    }
    return apiRequest<Payment[]>(ENDPOINTS.payments.adminList, {
      query: { childId: filter.childId, status: filter.status, from: filter.from, to: filter.to },
    });
  },

  async getOne(paymentId: string): Promise<Payment> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const payment = mockPayments.find((p) => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");
      return payment;
    }
    return apiRequest<Payment>(ENDPOINTS.payments.adminById(paymentId));
  },

  async refund(paymentId: string, input: RefundPaymentInput): Promise<Payment> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const payment = mockPayments.find((p) => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");
      const fullyRefunded = !input.amount || input.amount >= payment.amount;
      payment.status = fullyRefunded ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
      payment.updatedAt = new Date().toISOString();
      return payment;
    }
    return apiRequest<Payment>(ENDPOINTS.payments.refund(paymentId), { method: "POST", body: input });
  },

  /**
   * Payouts are generated server-side from settled earnings (see
   * `tutorEarningsService`'s tutor-scoped mock equivalent) — there's no
   * persisted admin-wide payout ledger to draw from in mock mode, so this
   * honestly returns nothing rather than fabricating payout records.
   */
  async listPayouts(filter: AdminPayoutFilter = {}): Promise<Payout[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<Payout[]>(ENDPOINTS.earnings.adminPayouts, { query: { tutorId: filter.tutorId, status: filter.status } });
  },

  async listEarningsEntries(filter: AdminEarningsEntryFilter = {}): Promise<EarningsEntry[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<EarningsEntry[]>(ENDPOINTS.earnings.adminEntries, {
      query: { tutorId: filter.tutorId, from: filter.from, to: filter.to, status: filter.status },
    });
  },
};
