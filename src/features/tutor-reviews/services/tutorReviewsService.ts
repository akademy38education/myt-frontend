import { ReviewModerationStatus, type Review, type SubmitLessonFeedbackInput } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { randomUUID } from "@/utils/uuid";
import { mockReviews, mockBookings } from "@/mocks";
import type { RatingDistribution, TutorReviewsSummary } from "../types";

/** Mock-mode-only append target — mirrors what `POST /reviews` does for real (see `backend/src/modules/reviews/reviews.service.ts`). */
const mockSubmittedReviews: Review[] = [];

function summarize(all: Review[], minRating?: number): TutorReviewsSummary {
  const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of all) {
    const bucket = Math.max(1, Math.min(5, Math.round(review.rating))) as keyof RatingDistribution;
    distribution[bucket] += 1;
  }
  const averageRating = all.length > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / all.length : 0;
  const reviews = minRating ? all.filter((r) => r.rating >= minRating) : all;
  return { reviews, total: all.length, averageRating: Math.round(averageRating * 10) / 10, distribution };
}

export const tutorReviewsService = {
  async getForTutor(tutorId: string, minRating?: number): Promise<TutorReviewsSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const all = mockReviews
        .filter((r) => r.tutorId === tutorId && r.moderationStatus === ReviewModerationStatus.PUBLISHED)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return summarize(all, minRating);
    }
    return apiRequest<TutorReviewsSummary>(ENDPOINTS.tutors.reviews(tutorId), { query: { minRating } });
  },

  /** Reuses the `Review` entity for post-lesson feedback rather than a separate model — see `backend/src/modules/reviews/README.md`. */
  async submit(input: SubmitLessonFeedbackInput): Promise<Review> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const booking = mockBookings.find((b) => b.id === input.bookingId);
      if (!booking) throw new Error("Booking not found");
      const now = new Date().toISOString();
      const review: Review = {
        id: randomUUID(),
        tutorId: booking.tutorId,
        studentId: booking.studentId,
        bookingId: booking.id,
        rating: input.rating,
        comment: input.comment,
        moderationStatus: ReviewModerationStatus.PUBLISHED,
        createdAt: now,
        updatedAt: now,
      };
      mockSubmittedReviews.push(review);
      return review;
    }
    return apiRequest<Review>(ENDPOINTS.reviews.submit, { method: "POST", body: input });
  },
};
