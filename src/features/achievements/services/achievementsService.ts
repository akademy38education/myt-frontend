import type { UnlockedAchievement } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

/**
 * Unlocking is computed server-side against real activity history (see
 * `backend/src/modules/achievements`) — there's no mock dataset to
 * fabricate, so mock mode honestly reports "nothing unlocked yet" rather
 * than inventing a badge.
 */
export const achievementsService = {
  async listForStudent(studentId: string): Promise<UnlockedAchievement[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<UnlockedAchievement[]>(ENDPOINTS.achievements.forStudent(studentId));
  },
};
