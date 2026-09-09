import type { Review } from "@myt/shared";

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface TutorReviewsSummary {
  reviews: Review[];
  total: number;
  averageRating: number;
  distribution: RatingDistribution;
}
