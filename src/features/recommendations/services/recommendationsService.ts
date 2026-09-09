import type { RecommendationItem } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { RecommendationSummary } from "../types";

/**
 * Recommendations and the summary are both derived server-side from the
 * caller's real repository data (role-dispatched by the backend, never
 * passed here) — there's no mock dataset to fabricate, so mock mode
 * honestly reports "nothing new" rather than inventing content that could
 * contradict the rest of the mocked dashboard.
 */
export const recommendationsService = {
  async list(): Promise<RecommendationItem[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<RecommendationItem[]>(ENDPOINTS.recommendations.forMe);
  },

  async getSummary(): Promise<RecommendationSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { text: "Nothing new to report.", generatedBy: "template" };
    }
    return apiRequest<RecommendationSummary>(ENDPOINTS.recommendations.summary);
  },
};
