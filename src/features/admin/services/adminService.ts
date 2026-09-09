import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { PaymentStatus, ReviewModerationStatus, SupportTicketStatus, TutorVerificationStatus, UserAccountStatus } from "@myt/shared";
import { mockTutors, mockReviews } from "@/mocks";
import { useMockUsersStore } from "@/features/admin-users/mockUsersStore";
import { useMockSupportStore } from "@/features/admin-support/mockSupportStore";
import { useMockBookingsStore } from "@/features/bookings/mockBookingsStore";
import { useMockTutorVerificationStore } from "@/features/admin-tutor-verification/mockTutorVerificationStore";
import type { AdminAnalytics, AdminOverview, FinancialReconciliationReport, GlobalSearchResult } from "../types";

const EMPTY_ANALYTICS: AdminAnalytics = {
  userGrowth: [],
  revenue: { gross: 0, platformFees: 0, payouts: 0, net: 0, currency: "GBP", transactionsSucceeded: 0, transactionsFailed: 0, refundedTotal: 0, invoicesIssued: 0 },
  bookings: { total: 0, byStatus: {}, completionRate: 0, cancellationRate: 0, noShowRate: 0 },
  repeatBookingRate: 0,
};

const EMPTY_RECONCILIATION: FinancialReconciliationReport = { generatedAt: new Date().toISOString(), issues: [], totalTransactions: 0, totalInvoices: 0 };

const EMPTY_SEARCH: GlobalSearchResult = { users: [], tutors: [], bookings: [], supportTickets: [], reports: [] };

export const adminService = {
  /** Computed live from the mock stores (rather than a static snapshot) so approving a tutor, suspending a user, or resolving a ticket during a demo is immediately reflected here too. */
  async getOverview(): Promise<AdminOverview> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const users = useMockUsersStore.getState().users;
      const bookings = useMockBookingsStore.getState().bookings;
      const usersByRole: Record<string, number> = {};
      for (const u of users) usersByRole[u.role] = (usersByRole[u.role] ?? 0) + 1;
      const bookingsByStatus: Record<string, number> = {};
      for (const b of bookings) bookingsByStatus[b.status] = (bookingsByStatus[b.status] ?? 0) + 1;
      return {
        totalUsers: users.length,
        usersByRole,
        totalBookings: bookings.length,
        bookingsByStatus,
        pendingTutorVerifications: useMockTutorVerificationStore.getState().applications.filter((a) => a.status === TutorVerificationStatus.PENDING).length,
        totalTutors: mockTutors.length,
        totalRevenue: bookings.filter((b) => b.paymentStatus === PaymentStatus.PAID).reduce((sum, b) => sum + b.priceTotal, 0),
        suspendedUsers: users.filter((u) => u.accountStatus === UserAccountStatus.SUSPENDED).length,
        openReports: 0,
        openSupportTickets: useMockSupportStore.getState().tickets.filter((t) => t.status === SupportTicketStatus.OPEN || t.status === SupportTicketStatus.IN_PROGRESS).length,
        flaggedReviews: mockReviews.filter((r) => r.moderationStatus === ReviewModerationStatus.FLAGGED).length,
      };
    }
    return apiRequest<AdminOverview>(ENDPOINTS.admin.overview);
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return EMPTY_ANALYTICS;
    }
    return apiRequest<AdminAnalytics>(ENDPOINTS.admin.analytics);
  },

  async search(q: string): Promise<GlobalSearchResult> {
    if (!q) return EMPTY_SEARCH;
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const needle = q.trim().toLowerCase();
      const users = useMockUsersStore
        .getState()
        .users.filter((u) => u.fullName.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle))
        .slice(0, 10)
        .map((u) => ({ id: u.id, fullName: u.fullName, email: u.email, role: u.role }));
      const tutors = mockTutors
        .filter((t) => t.headline.toLowerCase().includes(needle))
        .slice(0, 10)
        .map((t) => ({ id: t.id, headline: t.headline, userId: t.userId }));
      const bookings = useMockBookingsStore
        .getState()
        .bookings.filter((b) => b.id.toLowerCase().includes(needle) || b.studentId.toLowerCase().includes(needle) || b.tutorId.toLowerCase().includes(needle))
        .slice(0, 10)
        .map((b) => ({ id: b.id, studentId: b.studentId, tutorId: b.tutorId, status: b.status, scheduledStart: b.scheduledStart }));
      const supportTickets = useMockSupportStore
        .getState()
        .tickets.filter((t) => t.subject.toLowerCase().includes(needle) || t.requesterName.toLowerCase().includes(needle))
        .slice(0, 10)
        .map((t) => ({ id: t.id, subject: t.subject, status: t.status }));
      return { users, tutors, bookings, supportTickets, reports: [] };
    }
    return apiRequest<GlobalSearchResult>(ENDPOINTS.admin.search, { query: { q } });
  },

  async getFinancialReconciliation(): Promise<FinancialReconciliationReport> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return EMPTY_RECONCILIATION;
    }
    return apiRequest<FinancialReconciliationReport>(ENDPOINTS.admin.financeReconciliation);
  },
};
