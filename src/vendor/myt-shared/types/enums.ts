/**
 * Centralized enums shared by the frontend and backend so status values,
 * roles and classifications never drift between the two apps.
 */

export enum UserRole {
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

/**
 * Sub-role for a user whose UserRole is ADMIN. UserRole stays the coarse
 * "is this an admin at all" gate used pervasively across the codebase
 * (auth, ownership checks, routing); AdminRole is the finer-grained role
 * that determines exactly which admin capabilities that user has.
 */
export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  SUPPORT = "SUPPORT",
  FINANCE = "FINANCE",
  CONTENT_MANAGER = "CONTENT_MANAGER",
}

export enum AdminActionCategory {
  USER_MANAGEMENT = "USER_MANAGEMENT",
  TUTOR_VERIFICATION = "TUTOR_VERIFICATION",
  BOOKING = "BOOKING",
  PAYMENT = "PAYMENT",
  REVIEW_MODERATION = "REVIEW_MODERATION",
  REPORT = "REPORT",
  CONTENT = "CONTENT",
  SUPPORT = "SUPPORT",
  SETTINGS = "SETTINGS",
  SECURITY = "SECURITY",
}

export enum ReportableEntityType {
  USER = "USER",
  TUTOR = "TUTOR",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  REVIEW = "REVIEW",
  MESSAGE = "MESSAGE",
  LESSON = "LESSON",
  BOOKING = "BOOKING",
  RESOURCE = "RESOURCE",
}

export enum ReportStatus {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export enum ReportSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ReviewModerationStatus {
  PUBLISHED = "PUBLISHED",
  FLAGGED = "FLAGGED",
  HIDDEN = "HIDDEN",
  REMOVED = "REMOVED",
}

export enum SupportTicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_ON_USER = "WAITING_ON_USER",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum SupportTicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum ContentType {
  PAGE = "PAGE",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  FAQ = "FAQ",
}

export enum UserAccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED",
}

export enum TutorVerificationStatus {
  UNSUBMITTED = "UNSUBMITTED",
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  RESCHEDULED = "RESCHEDULED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export enum LessonStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  MISSED = "MISSED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  AUTHORIZED = "AUTHORIZED",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum HomeworkStatus {
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  OVERDUE = "OVERDUE",
}

export enum NotificationType {
  BOOKING = "BOOKING",
  LESSON = "LESSON",
  HOMEWORK = "HOMEWORK",
  MESSAGE = "MESSAGE",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  ACHIEVEMENT = "ACHIEVEMENT",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
  TRUE_FALSE = "TRUE_FALSE",
  NUMERIC = "NUMERIC",
  MATCHING = "MATCHING",
}

export enum DifficultyLevel {
  FOUNDATION = "FOUNDATION",
  CORE = "CORE",
  HIGHER = "HIGHER",
  ADVANCED = "ADVANCED",
}

export enum MasteryLevel {
  NOT_STARTED = "NOT_STARTED",
  EMERGING = "EMERGING",
  DEVELOPING = "DEVELOPING",
  SECURE = "SECURE",
  MASTERED = "MASTERED",
}

export enum DisputeStatus {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum RecordingStatus {
  RECORDING = "RECORDING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  FAILED = "FAILED",
}

export enum OnboardingStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

/** Status of one individual check within a tutor's overall verification (see TutorVerification). */
export enum VerificationStepStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  VERIFIED = "VERIFIED",
  NEEDS_CHANGES = "NEEDS_CHANGES",
  REJECTED = "REJECTED",
}
