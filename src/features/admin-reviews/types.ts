import type { ReviewModerationStatus } from "@myt/shared";

export interface AdminReviewFilter {
  moderationStatus?: ReviewModerationStatus;
  tutorId?: string;
}
