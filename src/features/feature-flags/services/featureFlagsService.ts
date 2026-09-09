import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { FeatureFlags } from "../types";

/** Mirrors the backend's real defaults (see backend/src/modules/feature-flags) — mock mode has no persisted flag store, so a patch is merged in-memory for the response only and never survives a fresh `get()`. */
const DEFAULT_FLAGS: FeatureFlags = {
  aiRecommendations: false,
  pushNotifications: false,
  realtimeNotifications: true,
  globalSearch: true,
  commandPalette: true,
};

export const featureFlagsService = {
  async get(): Promise<FeatureFlags> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return DEFAULT_FLAGS;
    }
    return apiRequest<FeatureFlags>(ENDPOINTS.featureFlags.get);
  },

  async update(patch: FeatureFlags): Promise<FeatureFlags> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { ...DEFAULT_FLAGS, ...patch };
    }
    return apiRequest<FeatureFlags>(ENDPOINTS.featureFlags.update, { method: "PUT", body: patch });
  },
};
