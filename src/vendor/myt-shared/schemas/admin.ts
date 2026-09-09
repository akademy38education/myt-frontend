import { z } from "zod";
import {
  AdminRole,
  ReportableEntityType,
  ReportSeverity,
  ContentStatus,
  ContentType,
  SupportTicketPriority,
  SupportTicketStatus,
  UserRole,
  UserAccountStatus,
} from "../types/enums";

export const SUSPENSION_REASONS = [
  "Policy violation",
  "Fraudulent activity",
  "Safeguarding concern",
  "Payment dispute",
  "User request",
  "Other",
] as const;

export const suspendUserSchema = z.object({
  reason: z.enum(SUSPENSION_REASONS),
  notes: z.string().max(1000).optional(),
  /** ISO date the suspension automatically lifts; omitted for an indefinite suspension. */
  suspendedUntil: z.string().datetime().optional(),
});
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;

export const reactivateUserSchema = z.object({
  notes: z.string().max(1000).optional(),
});
export type ReactivateUserInput = z.infer<typeof reactivateUserSchema>;

export const assignAdminRoleSchema = z.object({
  adminRole: z.nativeEnum(AdminRole).nullable(),
});
export type AssignAdminRoleInput = z.infer<typeof assignAdminRoleSchema>;

export const verificationDecisionSchema = z.object({
  notes: z.string().max(1000).optional(),
});
export type VerificationDecisionInput = z.infer<typeof verificationDecisionSchema>;

export const requestVerificationInfoSchema = z.object({
  message: z.string().min(1).max(1000),
});
export type RequestVerificationInfoInput = z.infer<typeof requestVerificationInfoSchema>;

export const refundPaymentSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.string().min(1).max(500),
});
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;

export const moderateReviewSchema = z.object({
  action: z.enum(["approve", "flag", "hide", "remove"]),
  reason: z.string().max(500).optional(),
});
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>;

export const createReportSchema = z.object({
  entityType: z.nativeEnum(ReportableEntityType),
  entityId: z.string().min(1),
  entityLabel: z.string().max(200).optional(),
  reason: z.string().min(1).max(200),
  details: z.string().max(2000).optional(),
  severity: z.nativeEnum(ReportSeverity).default(ReportSeverity.MEDIUM),
});
export type CreateReportInput = z.infer<typeof createReportSchema>;

export const resolveReportSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
  resolutionNotes: z.string().min(1).max(2000),
});
export type ResolveReportInput = z.infer<typeof resolveReportSchema>;

export const assignReportSchema = z.object({
  adminId: z.string().min(1),
});
export type AssignReportInput = z.infer<typeof assignReportSchema>;

export const createSupportTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  priority: z.nativeEnum(SupportTicketPriority).default(SupportTicketPriority.MEDIUM),
  message: z.string().min(1).max(4000),
});
export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;

export const supportTicketMessageSchema = z.object({
  body: z.string().min(1).max(4000),
});
export type SupportTicketMessageInput = z.infer<typeof supportTicketMessageSchema>;

export const updateSupportTicketSchema = z.object({
  status: z.nativeEnum(SupportTicketStatus).optional(),
  priority: z.nativeEnum(SupportTicketPriority).optional(),
  assignedAdminId: z.string().nullable().optional(),
});
export type UpdateSupportTicketInput = z.infer<typeof updateSupportTicketSchema>;

export const contentItemSchema = z.object({
  type: z.nativeEnum(ContentType),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  body: z.string().min(1).max(20000),
});
export type ContentItemInput = z.infer<typeof contentItemSchema>;

export const contentStatusSchema = z.object({
  status: z.nativeEnum(ContentStatus),
});
export type ContentStatusInput = z.infer<typeof contentStatusSchema>;

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  audience: z.union([z.literal("all"), z.array(z.nativeEnum(UserRole))]),
});
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const platformSettingsSchema = z.object({
  general: z.object({
    platformName: z.string().min(1).max(100),
    supportEmail: z.string().email(),
    maintenanceMode: z.boolean(),
  }),
  booking: z.object({
    cancellationWindowHours: z.number().int().min(0).max(168),
    rescheduleWindowHours: z.number().int().min(0).max(168),
    trialLessonEnabled: z.boolean(),
    minLessonDurationMinutes: z.number().int().min(15).max(240),
    lateFeePercent: z.number().min(0).max(100),
  }),
  payment: z.object({
    platformFeeRate: z.number().min(0).max(1),
    currency: z.string().min(3).max(3),
    payoutScheduleDays: z.number().int().min(1).max(60),
  }),
  notifications: z.object({
    emailEnabled: z.boolean(),
    smsEnabled: z.boolean(),
  }),
  content: z.object({
    reviewModerationRequired: z.boolean(),
  }),
  security: z.object({
    maxLoginAttempts: z.number().int().min(3).max(20),
    sessionTimeoutMinutes: z.number().int().min(5).max(1440),
    requireTutorVerification: z.boolean(),
  }),
});
export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;

export const userSearchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  role: z.nativeEnum(UserRole).optional(),
  accountStatus: z.nativeEnum(UserAccountStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type UserSearchQuery = z.infer<typeof userSearchQuerySchema>;
