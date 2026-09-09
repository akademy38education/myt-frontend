export type { RecommendationItem, RecommendationPriority } from "@myt/shared";

/** Mirrors the `GET /recommendations/summary` response shape. */
export interface RecommendationSummary {
  text: string;
  generatedBy: string;
}
