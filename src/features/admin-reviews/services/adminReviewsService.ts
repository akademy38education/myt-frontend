import { ReviewModerationStatus, type ModerateReviewInput, type Review } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockReviews } from "@/mocks";
import { useAuthStore } from "@/stores/authStore";
import type { AdminReviewFilter } from "../types";

const MODERATION_OUTCOME: Record<ModerateReviewInput["action"], ReviewModerationStatus> = {
  approve: ReviewModerationStatus.PUBLISHED,
  flag: ReviewModerationStatus.FLAGGED,
  hide: ReviewModerationStatus.HIDDEN,
  remove: ReviewModerationStatus.REMOVED,
};

export const adminReviewsService = {
  async list(filter: AdminReviewFilter = {}): Promise<Review[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockReviews.filter(
        (review) =>
          (!filter.moderationStatus || review.moderationStatus === filter.moderationStatus) &&
          (!filter.tutorId || review.tutorId === filter.tutorId)
      );
    }
    return apiRequest<Review[]>(ENDPOINTS.reviews.adminList, { query: { moderationStatus: filter.moderationStatus, tutorId: filter.tutorId } });
  },

  /** Mutates the shared `mockReviews` fixture in place so mock mode reflects moderation decisions across refetches, mirroring what the real endpoint persists. */
  async moderate(id: string, input: ModerateReviewInput): Promise<Review> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const review = mockReviews.find((r) => r.id === id);
      if (!review) throw new Error("Review not found");
      review.moderationStatus = MODERATION_OUTCOME[input.action];
      review.moderationReason = input.reason;
      review.moderatedByAdminId = useAuthStore.getState().user?.id;
      review.moderatedAt = new Date().toISOString();
      review.updatedAt = review.moderatedAt;
      return review;
    }
    return apiRequest<Review>(ENDPOINTS.reviews.moderate(id), { method: "POST", body: input });
  },
};
