import type { LearningInsight } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

/**
 * Insights are derived server-side from real mastery/activity history (see
 * `backend/src/modules/learning`) — never fabricated here. Mock mode has no
 * signal to derive from, so it honestly returns no insights rather than
 * inventing one.
 */
export const insightsService = {
  async list(studentId?: string): Promise<LearningInsight[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<LearningInsight[]>(ENDPOINTS.learning.insights, { query: studentId ? { studentId } : undefined });
  },
};
