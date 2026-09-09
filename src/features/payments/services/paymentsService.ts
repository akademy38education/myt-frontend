import type { AddPaymentMethodInput, Payment, PaymentMethod } from "@myt/shared";
import { PaymentStatus } from "@myt/shared";
import { apiRequest, apiRequestText } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockPayments } from "@/mocks";
import type { PaymentFilter, PaymentSummary } from "../types";

function round2(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function startOfMonth(date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(1);
  return result;
}

function applyFilter(payments: Payment[], filter: PaymentFilter): Payment[] {
  let result = payments;
  const { childId, status, from, to } = filter;
  if (childId) result = result.filter((p) => p.studentId === childId);
  if (status) result = result.filter((p) => p.status === status);
  if (from) result = result.filter((p) => (p.lessonDate ?? "") >= from);
  if (to) result = result.filter((p) => (p.lessonDate ?? "") <= to);
  return result;
}

let mockMethods: PaymentMethod[] = [{ id: "pm-mock-1", parentId: "parent-1", brand: "visa", last4: "4242", expiryMonth: 8, expiryYear: new Date().getFullYear() + 2, isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];

export const paymentsService = {
  async getSummary(parentUserId: string): Promise<PaymentSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const payments = mockPayments.filter((p) => p.payerId === parentUserId);
      const monthStart = startOfMonth();
      const lastMonthStart = startOfMonth(new Date(monthStart.getTime() - 1));
      const sum = (list: Payment[]) => round2(list.reduce((s, p) => s + p.amount, 0));
      const inMonth = (p: Payment, start: Date, end?: Date) => {
        const t = new Date(p.lessonDate ?? p.createdAt).getTime();
        return t >= start.getTime() && (!end || t < end.getTime());
      };
      return {
        thisMonth: sum(payments.filter((p) => p.status === PaymentStatus.PAID && inMonth(p, monthStart))),
        lastMonth: sum(payments.filter((p) => p.status === PaymentStatus.PAID && inMonth(p, lastMonthStart, monthStart))),
        upcoming: sum(payments.filter((p) => p.status === PaymentStatus.PENDING)),
        overdueCount: payments.filter((p) => p.status === PaymentStatus.FAILED).length,
        currency: payments[0]?.currency ?? "GBP",
      };
    }
    return apiRequest<PaymentSummary>(ENDPOINTS.payments.summary(parentUserId));
  },

  async list(parentId: string, filter: PaymentFilter = {}): Promise<Payment[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return applyFilter(mockPayments, filter);
    }
    return apiRequest<Payment[]>(ENDPOINTS.payments.list(parentId), { query: filter as unknown as Record<string, string | undefined> });
  },

  async getOne(parentId: string, paymentId: string): Promise<Payment> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const payment = mockPayments.find((p) => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");
      return payment;
    }
    return apiRequest<Payment>(ENDPOINTS.payments.byId(parentId, paymentId));
  },

  async exportInvoice(parentId: string, paymentId: string): Promise<string> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const payment = mockPayments.find((p) => p.id === paymentId);
      return payment ? `Invoice ${payment.reference}\nAmount: ${payment.amount} ${payment.currency}` : "";
    }
    return apiRequestText(ENDPOINTS.payments.export(parentId, paymentId));
  },

  async listMethods(parentId: string): Promise<PaymentMethod[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockMethods.filter((m) => m.parentId === parentId);
    }
    return apiRequest<PaymentMethod[]>(ENDPOINTS.payments.methods(parentId));
  },

  async addMethod(parentId: string, input: AddPaymentMethodInput): Promise<PaymentMethod> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const now = new Date().toISOString();
      const method: PaymentMethod = { id: `pm-${Date.now()}`, parentId, ...input, createdAt: now, updatedAt: now };
      if (input.isDefault) mockMethods = mockMethods.map((m) => ({ ...m, isDefault: false }));
      mockMethods = [...mockMethods, method];
      return method;
    }
    return apiRequest<PaymentMethod>(ENDPOINTS.payments.methods(parentId), { method: "POST", body: input });
  },

  async removeMethod(parentId: string, methodId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      mockMethods = mockMethods.filter((m) => m.id !== methodId);
      return;
    }
    await apiRequest(ENDPOINTS.payments.method(parentId, methodId), { method: "DELETE" });
  },

  async setDefaultMethod(parentId: string, methodId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      mockMethods = mockMethods.map((m) => ({ ...m, isDefault: m.id === methodId }));
      return;
    }
    await apiRequest(ENDPOINTS.payments.setDefaultMethod(parentId, methodId), { method: "POST" });
  },
};
