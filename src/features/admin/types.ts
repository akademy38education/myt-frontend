export interface AdminOverview {
  totalUsers: number;
  usersByRole: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  pendingTutorVerifications: number;
  totalTutors: number;
  totalRevenue: number;
  suspendedUsers: number;
  openReports: number;
  openSupportTickets: number;
  flaggedReviews: number;
}

export interface RevenueBreakdown {
  gross: number;
  platformFees: number;
  payouts: number;
  net: number;
  currency: string;
  transactionsSucceeded: number;
  transactionsFailed: number;
  refundedTotal: number;
  invoicesIssued: number;
}

export interface FinancialReconciliationIssue {
  type: "paid_booking_without_transaction" | "duplicate_provider_transaction_id" | "refund_exceeds_payment" | "invoice_without_succeeded_transaction";
  bookingId?: string;
  transactionId?: string;
  invoiceId?: string;
  description: string;
}

export interface FinancialReconciliationReport {
  generatedAt: string;
  issues: FinancialReconciliationIssue[];
  totalTransactions: number;
  totalInvoices: number;
}

export interface BookingAnalytics {
  total: number;
  byStatus: Record<string, number>;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface UserGrowthPoint {
  month: string;
  newUsers: number;
  cumulativeUsers: number;
}

export interface AdminAnalytics {
  userGrowth: UserGrowthPoint[];
  revenue: RevenueBreakdown;
  bookings: BookingAnalytics;
  repeatBookingRate: number;
}

export interface GlobalSearchResult {
  users: Array<{ id: string; fullName: string; email: string; role: string }>;
  tutors: Array<{ id: string; headline: string; userId: string }>;
  bookings: Array<{ id: string; studentId: string; tutorId: string; status: string; scheduledStart: string }>;
  supportTickets: Array<{ id: string; subject: string; status: string }>;
  reports: Array<{ id: string; reason: string; status: string }>;
}
