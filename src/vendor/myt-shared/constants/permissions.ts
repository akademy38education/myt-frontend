/**
 * Centralized permission catalogue. Every permission check anywhere in the
 * platform (frontend route guards, backend authorization middleware) must
 * reference one of these keys rather than inlining role checks — this is
 * the single source of truth for "who can do what".
 */
import { UserRole, AdminRole } from "../types/enums";

export const PERMISSIONS = {
  STUDENT_READ: "student.read",
  STUDENT_UPDATE: "student.update",
  PARENT_READ: "parent.read",
  PARENT_UPDATE: "parent.update",
  TUTOR_READ: "tutor.read",
  TUTOR_UPDATE: "tutor.update",
  TUTOR_VERIFY: "tutor.verify",
  BOOKING_CREATE: "booking.create",
  BOOKING_CANCEL: "booking.cancel",
  BOOKING_READ: "booking.read",
  CALENDAR_MANAGE: "calendar.manage",
  LESSON_JOIN: "lesson.join",
  LESSON_RECORD: "lesson.record",
  HOMEWORK_ASSIGN: "homework.assign",
  HOMEWORK_REVIEW: "homework.review",
  HOMEWORK_SUBMIT: "homework.submit",
  LIBRARY_READ: "library.read",
  MASTERY_READ: "mastery.read",
  GOAL_MANAGE: "goal.manage",
  MESSAGE_SEND: "message.send",
  NOTIFICATION_READ: "notification.read",
  PAYMENT_VIEW: "payment.view",
  PAYMENT_MANAGE: "payment.manage",
  REVIEW_CREATE: "review.create",
  EARNINGS_VIEW: "earnings.view",
  REPORT_VIEW: "report.view",
  ADMIN_MANAGE: "admin.manage",

  // --- Granular admin permissions (Phase 10 §2) ---
  // These are only ever granted via ADMIN_ROLE_PERMISSIONS below, never via
  // ROLE_PERMISSIONS directly — a plain UserRole.ADMIN with no adminRole set
  // holds none of them (see backend/src/utils/adminAuthorize.ts).
  USERS_VIEW: "users.view",
  USERS_EDIT: "users.edit",
  USERS_SUSPEND: "users.suspend",
  USERS_DELETE: "users.delete",
  TUTORS_VIEW: "tutors.view",
  TUTORS_VERIFY: "tutors.verify",
  TUTORS_SUSPEND: "tutors.suspend",
  STUDENTS_VIEW: "students.view",
  PARENTS_VIEW: "parents.view",
  BOOKINGS_VIEW: "bookings.view",
  BOOKINGS_MANAGE: "bookings.manage",
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_REFUND: "payments.refund",
  PAYOUTS_VIEW: "payouts.view",
  PAYOUTS_MANAGE: "payouts.manage",
  REVIEWS_MODERATE: "reviews.moderate",
  REPORTS_VIEW: "reports.view",
  REPORTS_MANAGE: "reports.manage",
  CONTENT_VIEW: "content.view",
  CONTENT_EDIT: "content.edit",
  SUPPORT_VIEW: "support.view",
  SUPPORT_MANAGE: "support.manage",
  NOTIFICATIONS_MANAGE: "notifications.manage",
  ANALYTICS_VIEW: "analytics.view",
  AUDIT_VIEW: "audit.view",
  SECURITY_VIEW: "security.view",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
  ADMIN_ROLES_MANAGE: "admin.roles.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Default role -> permission map. This is the baseline used until a real
 * per-user / per-org permission override system is introduced.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.TUTOR_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.LESSON_JOIN,
    PERMISSIONS.HOMEWORK_SUBMIT,
    PERMISSIONS.LIBRARY_READ,
    PERMISSIONS.MASTERY_READ,
    PERMISSIONS.GOAL_MANAGE,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.REVIEW_CREATE,
  ],
  [UserRole.PARENT]: [
    PERMISSIONS.PARENT_READ,
    PERMISSIONS.PARENT_UPDATE,
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.TUTOR_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.MASTERY_READ,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_MANAGE,
  ],
  [UserRole.TUTOR]: [
    PERMISSIONS.TUTOR_READ,
    PERMISSIONS.TUTOR_UPDATE,
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.CALENDAR_MANAGE,
    PERMISSIONS.LESSON_JOIN,
    PERMISSIONS.LESSON_RECORD,
    PERMISSIONS.HOMEWORK_ASSIGN,
    PERMISSIONS.HOMEWORK_REVIEW,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.EARNINGS_VIEW,
  ],
  [UserRole.ADMIN]: Object.values(PERMISSIONS),
};

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Fine-grained admin sub-role -> permission map. This is the authority for
 * every `/admin/*` action — a `UserRole.ADMIN` user's actual capabilities
 * come entirely from their `adminRole` via this map, NOT from
 * `ROLE_PERMISSIONS[UserRole.ADMIN]` (which stays "everything" only for
 * legacy non-admin-surface checks like `assertOwnTutor`'s bypass, and is
 * deliberately never consulted by admin-surface routes — see
 * backend/src/utils/adminAuthorize.ts). SUPER_ADMIN is the only role with
 * ADMIN_ROLES_MANAGE, so only a Super Admin can grant/change other admins'
 * sub-roles.
 */
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_SUSPEND,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.TUTORS_VIEW,
    PERMISSIONS.TUTORS_VERIFY,
    PERMISSIONS.TUTORS_SUSPEND,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
    PERMISSIONS.BOOKINGS_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.PAYOUTS_VIEW,
    PERMISSIONS.PAYOUTS_MANAGE,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_MANAGE,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.SUPPORT_VIEW,
    PERMISSIONS.SUPPORT_MANAGE,
    PERMISSIONS.NOTIFICATIONS_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.SECURITY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.ADMIN_ROLES_MANAGE,
  ],
  [AdminRole.ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_SUSPEND,
    PERMISSIONS.TUTORS_VIEW,
    PERMISSIONS.TUTORS_VERIFY,
    PERMISSIONS.TUTORS_SUSPEND,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
    PERMISSIONS.BOOKINGS_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYOUTS_VIEW,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_MANAGE,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.SUPPORT_VIEW,
    PERMISSIONS.SUPPORT_MANAGE,
    PERMISSIONS.NOTIFICATIONS_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.SECURITY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [AdminRole.MODERATOR]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.TUTORS_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_MANAGE,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [AdminRole.SUPPORT]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.TUTORS_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.BOOKINGS_VIEW,
    PERMISSIONS.SUPPORT_VIEW,
    PERMISSIONS.SUPPORT_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [AdminRole.FINANCE]: [
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_REFUND,
    PERMISSIONS.PAYOUTS_VIEW,
    PERMISSIONS.PAYOUTS_MANAGE,
    PERMISSIONS.BOOKINGS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [AdminRole.CONTENT_MANAGER]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.TUTORS_VIEW,
  ],
};

export function adminRoleHasPermission(adminRole: AdminRole | undefined, permission: Permission): boolean {
  if (!adminRole) return false;
  return ADMIN_ROLE_PERMISSIONS[adminRole]?.includes(permission) ?? false;
}
