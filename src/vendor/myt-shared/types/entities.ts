/**
 * Database-ready entity shapes. These describe the domain model the whole
 * platform is designed around (see docs/architecture/README.md). No ORM is
 * wired up yet, but repositories on the backend and mocks on the frontend
 * both conform to these shapes so a real database can be introduced later
 * without changing any calling code.
 */
import type {
  UserRole,
  AdminRole,
  TutorVerificationStatus,
  BookingStatus,
  LessonStatus,
  PaymentStatus,
  HomeworkStatus,
  NotificationType,
  MessageType,
  QuestionType,
  DifficultyLevel,
  MasteryLevel,
  DisputeStatus,
  RecordingStatus,
  OnboardingStatus,
  VerificationStepStatus,
  AdminActionCategory,
  ReportableEntityType,
  ReportStatus,
  ReportSeverity,
  ReviewModerationStatus,
  SupportTicketStatus,
  SupportTicketPriority,
  ContentStatus,
  ContentType,
  UserAccountStatus,
} from "./enums";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  fullName: string;
  role: UserRole;
  /** Only meaningful when role === ADMIN — see shared/constants/permissions.ts's ADMIN_ROLE_PERMISSIONS for what each sub-role can do. */
  adminRole?: AdminRole;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  accountStatus: UserAccountStatus;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedUntil?: string;
  suspendedByAdminId?: string;
  lastLoginAt?: string;
}

export interface TutorPreference {
  teachingStyle?: string;
  lessonFormat?: "online" | "in-person" | "either";
  preferredAvailability?: string[];
  budgetPerHour?: number;
  tutorGenderPreference?: "male" | "female" | "no-preference";
  languagePreferences?: string[];
}

export interface StudentProfile extends BaseEntity {
  /**
   * The owning login, when this student has their own account. Optional so
   * a `StudentProfile` can also represent a parent-managed child who hasn't
   * (yet) registered their own login — see `ChildProfile` below, which is
   * the same shape used from that angle.
   */
  userId?: string;
  parentId?: string;
  fullName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  country?: string;
  schoolName?: string;
  curriculum?: string;
  yearGroup: string;
  subjects: string[];
  learningGoals: string[];
  timezone: string;
  tutorPreference?: TutorPreference;
  onboardingStatus?: OnboardingStatus;
}

/**
 * A parent-managed child profile — structurally identical to `StudentProfile`
 * (same repository, same backend module) but named distinctly wherever code
 * is specifically about "a parent's child" rather than "a self-service
 * student account", per the parent-onboarding flow (a parent can have any
 * number of children, and a child may not have logged in yet).
 */
export type ChildProfile = StudentProfile;

export interface ParentProfile extends BaseEntity {
  userId: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  timezone?: string;
  childrenIds: string[];
  billingEmail?: string;
  onboardingStatus?: OnboardingStatus;
  notificationPreferences?: ParentNotificationPreferences;
}

export interface TutorProfile extends BaseEntity {
  userId: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  lessonApproach?: string;
  location?: string;
  timezone?: string;
  subjects: string[];
  /**
   * Coarse discovery/filter tags — real fields on the tutor (moved here from
   * a frontend-only shim so search, SmartMatch and the profile page can all
   * read one source of truth). Free-text-ish but drawn from the same fixed
   * vocabularies as onboarding (`shared/constants` equivalents live in
   * frontend/src/constants/tutoring.ts) so filters can match exactly.
   */
  yearLevels: string[];
  curricula: string[];
  teachingStyle: string;
  /** Coarse weekly availability tags, e.g. "Weekday evenings", "Weekends" — used for marketplace filtering. Real bookable slots come from the `Availability` entity / GET /tutors/:id/availability, not this. */
  availabilitySlots: string[];
  hourlyRate: number;
  currency: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  verificationStatus: TutorVerificationStatus;
  languages: string[];
  responseTimeMinutes?: number;
  onboardingStatus?: OnboardingStatus;
  trialLessonEnabled?: boolean;
  trialLessonPrice?: number;
  studentsTaught?: number;
  lessonsCompleted?: number;
  qualifications?: TutorQualification[];
  notificationPreferences?: TutorNotificationPreferences;
}

/**
 * A single day's worth of open lesson slots, as returned by
 * `GET /tutors/:id/availability` — already excludes anything the tutor has
 * a CONFIRMED/PENDING booking against, so the frontend never has to
 * cross-reference bookings itself.
 */
export interface TutorAvailabilityDay {
  date: string; // YYYY-MM-DD
  slots: string[]; // "HH:mm", 24h, in the tutor's timezone
}

/** A student's/parent's bookmarked tutor, for the "Saved tutors" list. */
export interface SavedTutor extends BaseEntity {
  studentId: string;
  tutorId: string;
}

/**
 * Structured, transparent SmartMatch output — a score plus the reasons that
 * produced it, so the UI never has to show a bare percentage (see
 * `ai-services/src/matching` for where a real recommendation engine would
 * eventually replace `backend/src/modules/smart-match`, without changing
 * this shape).
 */
export interface TutorMatchResult {
  tutor: TutorProfile;
  matchScore: number;
  matchReasons: string[];
}

export interface Subject extends BaseEntity {
  name: string;
  category: string;
  examBoards: string[];
}

export interface Availability extends BaseEntity {
  tutorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

/**
 * A one-off exception to a tutor's normal weekly `Availability` rules —
 * either time they're unavailable despite a matching weekly rule
 * ("blocked", e.g. a holiday or appointment), or time they're available
 * despite having no matching rule ("available-exception", e.g. a Sunday
 * they're opening up specially). Scoped to a single calendar `date`, never
 * recurring — recurring patterns belong on `Availability` itself.
 */
export interface AvailabilityBlock extends BaseEntity {
  tutorId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  type: "blocked" | "available-exception";
  reason?: string;
}

export type LessonType = "regular" | "trial";
export type CancelledByRole = "student" | "tutor" | "parent" | "admin";

export interface Booking extends BaseEntity {
  studentId: string;
  /** Set when a parent booked on behalf of this student. */
  parentId?: string;
  tutorId: string;
  subjectId: string;
  lessonType: LessonType;
  status: BookingStatus;
  /** UTC ISO timestamps — always convert for display via `timezoneService`/`formatInTimezone`, never render these raw. */
  scheduledStart: string;
  scheduledEnd: string;
  durationMinutes: number;
  /** IANA timezone names captured at booking time, so a lesson's displayed time never shifts if either party later changes their profile timezone. */
  studentTimezone: string;
  tutorTimezone: string;
  priceTotal: number;
  currency: string;
  paymentStatus: PaymentStatus;
  /** Mock meeting link — see `classroomService`; the real live-classroom system is a later phase. */
  meetingUrl?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: CancelledByRole;
  /** Set on the current record when a booking has been moved to a new time — the previous slot is kept for the "rescheduled from X" UI, distinct from `BookingStatus.RESCHEDULED` (not used as a terminal status, since a rescheduled lesson is still very much CONFIRMED/PENDING). */
  rescheduledAt?: string;
  rescheduleReason?: string;
  previousScheduledStart?: string;
  previousScheduledEnd?: string;
}

export interface Lesson extends BaseEntity {
  bookingId: string;
  status: LessonStatus;
  startedAt?: string;
  endedAt?: string;
  /** Set by the tutor when ending the lesson — see `LessonSummary` for the fuller structured version; this stays as free text for anything not captured there. */
  summary?: string;
  objectives?: string[];
  /** Homework assigned as a direct result of this lesson — mirrors `Homework.lessonId` on the other side of the relationship. */
  homeworkIds?: string[];
  nextSteps?: string[];
  recordingId?: string;
}

export interface Recording extends BaseEntity {
  lessonId: string;
  status: RecordingStatus;
  durationSeconds?: number;
  url?: string;
  chapters?: { label: string; startSeconds: number }[];
}

export type LessonParticipantRole = "student" | "tutor";

/** A single note attached to a lesson — either private to its author or shared with the other participant. Backend authorization (not just the UI) must enforce `visibility` — see `lessons.service.ts`. */
export interface LessonNote extends BaseEntity {
  bookingId: string;
  authorRole: LessonParticipantRole;
  visibility: "private" | "shared";
  body: string;
}

/** Ephemeral in-lesson chat — deliberately separate from the persistent DM `Message`/conversation system (see `features/messaging`); this only ever exists in the context of one lesson. */
export interface LessonMessage extends BaseEntity {
  bookingId: string;
  senderRole: LessonParticipantRole;
  body: string;
}

export type LessonResourceType = "worksheet" | "video" | "article" | "link" | "document";

export interface LessonResource extends BaseEntity {
  bookingId: string;
  title: string;
  type: LessonResourceType;
  url?: string;
  uploadedByRole: LessonParticipantRole;
}

export type WhiteboardTool = "pen" | "highlighter" | "eraser" | "rectangle" | "ellipse" | "text";

export interface WhiteboardStroke {
  id: string;
  tool: WhiteboardTool;
  color: string;
  size: number;
  points: Array<{ x: number; y: number }>;
  text?: string;
  authorRole: LessonParticipantRole;
}

/** The whiteboard's full persisted state for one lesson — a flat, replayable stroke log rather than a rasterized image, so undo/redo and late-joining participants both work off the same source of truth. */
export interface LessonWhiteboardState extends BaseEntity {
  bookingId: string;
  strokes: WhiteboardStroke[];
}

/** One student's answer to one homework question — `isCorrect` is only ever set for auto-gradable question types (see `questions.service.ts`'s scoring rule); `undefined` means it needs (or is awaiting) a tutor's manual review, which is always true for LONG_ANSWER. */
export interface HomeworkAnswer {
  questionId: string;
  response: string;
  isCorrect?: boolean;
}

export interface Homework extends BaseEntity {
  studentId: string;
  tutorId: string;
  lessonId?: string;
  title: string;
  status: HomeworkStatus;
  dueAt: string;
  questionIds: string[];
  answers?: HomeworkAnswer[];
  /** 0-100, auto-gradable questions only — omitted while any of those remain unanswered. */
  score?: number;
  submittedAt?: string;
  tutorFeedback?: string;
  reviewedAt?: string;
}

export interface Question extends BaseEntity {
  subjectId: string;
  /** Free-text label, kept for display/backward-compat — prefer `topicId` once set. */
  topic: string;
  topicId?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  prompt: string;
  choices?: string[];
  answer: string | string[];
}

/**
 * A node in one subject's topic tree (Subject → Topic → [Topic...]) — a
 * Topic with no `parentTopicId` is a top-level topic; one with a
 * `parentTopicId` is a subtopic of another. `objectives` are the concrete,
 * gradeable learning objectives that make up this topic — collapsed onto
 * Topic itself (rather than a separate `LearningObjective` entity) since an
 * objective has no independent lifecycle of its own in this app; it's just
 * the leaf-level detail of a topic (Phase 12 spec §3-4).
 */
export interface Topic extends BaseEntity {
  subjectId: string;
  parentTopicId?: string;
  title: string;
  description?: string;
  objectives: string[];
  order: number;
}

/**
 * `score`/`evidenceCount`/`lastCalculatedAt` are computed server-side by
 * `masteryService.recalculate()` from real homework/lesson evidence, never
 * set directly by a client — see Phase 12 spec §6-7 for the scoring rule.
 * Optional so the pre-existing mock dataset (which predates these fields)
 * keeps typechecking; the real backend always populates them.
 */
export interface MasteryRecord extends BaseEntity {
  studentId: string;
  subjectId: string;
  topicId?: string;
  topic: string;
  level: MasteryLevel;
  confidence: number;
  score?: number;
  evidenceCount?: number;
  lastCalculatedAt?: string;
}

export interface Goal extends BaseEntity {
  studentId: string;
  title: string;
  subjectId?: string;
  priority?: "low" | "medium" | "high";
  targetDate: string;
  progress: number;
}

export interface Message extends BaseEntity {
  conversationId: string;
  senderId: string;
  type: MessageType;
  body: string;
  readAt?: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt?: string;
  link?: string;
}

export interface Payment extends BaseEntity {
  bookingId: string;
  payerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  /** Denormalized from the booking at read time (never re-derived per row in the UI) — the student the lesson was for, its subject, and when it happened, so the parent-facing payment history never needs an extra round trip per row. */
  studentId?: string;
  subjectId?: string;
  lessonDate?: string;
  description?: string;
  paidAt?: string;
  reference?: string;
}

/**
 * The real, persisted charge ledger — unlike `Payment` above (which is a
 * read-model derived from a `Booking` for backwards-compatible list/export
 * APIs), this is the source of truth for "did money actually move," created
 * once per checkout attempt and never re-derived. `amount`/`refundedAmount`
 * are expressed in the same major-unit currency convention as `Booking.priceTotal`
 * everywhere else in this codebase; the payment-provider boundary
 * (`PaymentProviderClient`) is what converts to integer minor units before
 * anything would ever reach a real gateway (Phase 13 spec §7).
 */
export interface PaymentTransaction extends BaseEntity {
  bookingId: string;
  payerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerTransactionId?: string;
  paymentMethodId?: string;
  idempotencyKey?: string;
  failureReason?: string;
  refundedAmount: number;
  succeededAt?: string;
  failedAt?: string;
}

export type InvoiceStatus = "issued" | "void";

/** A real, sequentially-numbered invoice issued once a `PaymentTransaction` succeeds — distinct from `paymentsService.exportInvoice()`'s on-the-fly text export, which predates this and stays for backwards compatibility with existing payment-history downloads. */
export interface Invoice extends BaseEntity {
  number: string;
  bookingId: string;
  transactionId: string;
  payerId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  description: string;
}

export type PaymentMethodBrand = "visa" | "mastercard" | "amex" | "other";

/**
 * Safe, tokenized payment-method metadata only — never raw card numbers,
 * CVVs or provider secrets (Phase 9 spec §42/§43). A real integration would
 * store `providerToken` from Stripe/Adyen/etc; this mock stands in for that
 * without ever handling a real card number.
 */
export interface PaymentMethod extends BaseEntity {
  parentId: string;
  brand: PaymentMethodBrand;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface ParentNotificationPreferences {
  lessonReminders: boolean;
  homeworkReminders: boolean;
  progressReports: boolean;
  tutorMessages: boolean;
  paymentNotifications: boolean;
  marketing: boolean;
}

export interface Dispute extends BaseEntity {
  bookingId: string;
  raisedById: string;
  status: DisputeStatus;
  reason: string;
}

export interface Review extends BaseEntity {
  tutorId: string;
  studentId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  moderationStatus: ReviewModerationStatus;
  moderationReason?: string;
  moderatedByAdminId?: string;
  moderatedAt?: string;
}

/**
 * A user-filed report/complaint against another entity on the platform —
 * distinct from `Dispute` (booking-payment-specific) and the Phase 9
 * lesson-progress `LessonReport` (an unrelated "report" meaning a written
 * progress summary). Feeds the admin moderation queue at `/admin/reports`.
 */
export interface Report extends BaseEntity {
  reporterId: string;
  reporterRole: UserRole;
  entityType: ReportableEntityType;
  entityId: string;
  entityLabel?: string;
  reason: string;
  details?: string;
  severity: ReportSeverity;
  status: ReportStatus;
  assignedAdminId?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedByAdminId?: string;
}

/** Immutable log of every sensitive admin action, for accountability and compliance review (Phase 10 spec §27/§64-65/§85). Never edited or deleted after creation. */
export interface AuditLog extends BaseEntity {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  actorAdminRole?: AdminRole;
  category: AdminActionCategory;
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  description: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface SupportTicket extends BaseEntity {
  requesterId: string;
  requesterRole: UserRole;
  requesterName: string;
  subject: string;
  category: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedAdminId?: string;
  lastMessageAt?: string;
}

export interface SupportTicketMessage extends BaseEntity {
  ticketId: string;
  authorId: string;
  authorIsAdmin: boolean;
  authorName: string;
  body: string;
}

/** Minimal CMS entity for platform pages/announcements/FAQs (Phase 10 spec §72-75) — versioned via `ContentVersion`, never a hardcoded string in the UI. */
export interface ContentItem extends BaseEntity {
  type: ContentType;
  title: string;
  slug: string;
  body: string;
  status: ContentStatus;
  authorAdminId: string;
  version: number;
  publishedAt?: string;
}

export interface ContentVersion extends BaseEntity {
  contentId: string;
  version: number;
  title: string;
  body: string;
  editedByAdminId: string;
}

/** Platform-wide announcement pushed by an admin — delivered as a `Notification` to every targeted user. */
export interface PlatformAnnouncement extends BaseEntity {
  title: string;
  body: string;
  audience: UserRole[] | "all";
  createdByAdminId: string;
  recipientCount: number;
  sentAt?: string;
}

/**
 * One structured, privacy-conscious product-analytics event — never
 * passwords, tokens, payment details or free-text message content (Phase 11
 * spec §42). `userId` is omitted for a logged-out visitor (e.g. browsing the
 * public marketplace); the event is still recorded so growth/funnel
 * analysis works pre-signup.
 */
export interface AnalyticsEventRecord extends BaseEntity {
  name: string;
  userId?: string;
  role?: UserRole;
  properties?: Record<string, string | number | boolean | null>;
}

/** A permanent record of one unlocked achievement — the catalog of what CAN be unlocked (`AchievementDefinition`, keyed by `AchievementKey`) is static/code-defined (see `shared/types/learning.ts`), since criteria are code, not data; only the unlock event itself needs persistence. */
export interface UserAchievement extends BaseEntity {
  userId: string;
  achievementKey: string;
  unlockedAt: string;
}

/** Singleton platform configuration record, backend-persisted (never hardcoded in the UI) — see Phase 10 spec §90-93. */
export interface PlatformSettings extends BaseEntity {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  booking: {
    cancellationWindowHours: number;
    rescheduleWindowHours: number;
    trialLessonEnabled: boolean;
    minLessonDurationMinutes: number;
    /** % of the lesson price retained as a late-cancellation fee when a cancellation falls inside `cancellationWindowHours` — the single source of truth for both the backend's real refund calculation and the frontend's pre-cancel policy preview (Phase 13 spec §29-31). */
    lateFeePercent: number;
  };
  payment: {
    /** The one configurable platform commission rate — every earnings/payout/checkout calculation reads this, never a hardcoded constant (Phase 13 spec §36). */
    platformFeeRate: number;
    currency: string;
    payoutScheduleDays: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
  content: {
    reviewModerationRequired: boolean;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeoutMinutes: number;
    requireTutorVerification: boolean;
  };
}

/**
 * Server-side record of where a user got to in a multi-step onboarding
 * flow. During this phase, step-by-step progress is persisted client-side
 * (see the user's `*OnboardingStore` in the frontend, which is explicitly
 * allowed to be a local/mock persistence layer) — this entity is written
 * once, when onboarding completes, so the backend has a durable record of
 * "this user finished onboarding" independent of frontend storage.
 */
export interface OnboardingProgress extends BaseEntity {
  userId: string;
  role: UserRole;
  status: OnboardingStatus;
  completedAt?: string;
}

export interface TutorQualification {
  id: string;
  title: string;
  institution?: string;
  year: number;
  subject?: string;
  documentName?: string;
}

/**
 * A tutor's submitted application — distinct from the "live" `TutorProfile`
 * shown in search, since an application starts as PENDING/IN_REVIEW and
 * only becomes a fully public `TutorProfile` once approved. The
 * `tutor-verification` module owns this; see its README/service for the
 * apply -> review -> approve lifecycle.
 */
export interface TutorApplication extends BaseEntity {
  tutorId: string;
  status: TutorVerificationStatus;
  headline: string;
  bio: string;
  location?: string;
  languages: string[];
  subjects: string[];
  yearLevels: string[];
  curricula: string[];
  yearsExperience: number;
  ageGroups: string[];
  qualifications: TutorQualification[];
  teachingStyle: string;
  lessonApproach?: string;
  hourlyRate: number;
  currency: string;
  trialLessonEnabled: boolean;
  trialLessonPrice?: number;
  availability: Array<Pick<Availability, "dayOfWeek" | "startTime" | "endTime">>;
  submittedAt?: string;
}

/** `TutorApplication` plus the applicant's real name/email — admin-only reads (`GET /tutor-verification/admin/queue*`) resolve and attach these from the underlying `User` record, since the base application itself only ever carried the tutor-authored marketplace fields (headline, bio, ...), never their account identity (Phase 15 spec §90-91 — an admin reviewing/approving a real person's application must see who that person is, not just their self-written headline and internal id). */
export interface TutorApplicationWithApplicant extends TutorApplication {
  applicantName: string;
  applicantEmail: string;
}

export interface TutorVerification extends BaseEntity {
  tutorId: string;
  identityStatus: VerificationStepStatus;
  qualificationStatus: VerificationStepStatus;
  profileReviewStatus: VerificationStepStatus;
  overallStatus: TutorVerificationStatus;
}

export type EarningsStatus = "pending" | "available" | "paid";

/**
 * One earning record per completed, paid booking — the tutor's gross/fee/net
 * breakdown for a single lesson. Generated server-side when a booking
 * completes (see `earnings.service.ts`'s `PLATFORM_FEE_RATE`), never
 * computed ad hoc in the UI (Phase 8 spec §39).
 */
export interface EarningsEntry extends BaseEntity {
  tutorId: string;
  bookingId: string;
  studentId: string;
  subjectId: string;
  lessonDate: string;
  durationMinutes: number;
  grossAmount: number;
  platformFeeAmount: number;
  netAmount: number;
  currency: string;
  status: EarningsStatus;
  payoutId?: string;
}

export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

export interface Payout extends BaseEntity {
  tutorId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  periodStart: string;
  periodEnd: string;
  reference: string;
  paidAt?: string;
}

/**
 * A tutor's private note about one of their students — never visible to the
 * student/parent (backend-enforced, not just hidden in the UI). Distinct
 * from `LessonNote`, which is scoped to a single lesson and can be marked
 * "shared" with the student; this is always tutor-only and spans the whole
 * relationship.
 */
export interface TutorStudentNote extends BaseEntity {
  tutorId: string;
  studentId: string;
  body: string;
}

export type ResourceType = "worksheet" | "video" | "article" | "link" | "document" | "presentation";

/**
 * A tutor's own reusable teaching material in their resource library —
 * distinct from `LessonResource` (scoped to one lesson's session). A
 * `Resource` can be shared with any number of students via `ResourceShare`.
 */
export interface Resource extends BaseEntity {
  tutorId: string;
  title: string;
  type: ResourceType;
  url?: string;
  subjectId?: string;
  tags: string[];
}

export interface ResourceShare extends BaseEntity {
  resourceId: string;
  studentId: string;
}

export interface TutorNotificationPreferences {
  bookingRequests: boolean;
  lessonReminders: boolean;
  messages: boolean;
  reviews: boolean;
  payouts: boolean;
  marketing: boolean;
}
