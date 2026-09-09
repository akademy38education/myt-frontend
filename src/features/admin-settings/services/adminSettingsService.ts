import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { PlatformSettings, PlatformSettingsInput } from "../types";

/** A single sensible default snapshot matching `PlatformSettings`'s shape — mock mode has no persisted settings store, so it reads this rather than fabricating one. */
const DEFAULT_SETTINGS: PlatformSettings = {
  id: "mock-settings",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  general: { platformName: "MyT", supportEmail: "support@myt.example", maintenanceMode: false },
  booking: { cancellationWindowHours: 24, rescheduleWindowHours: 12, trialLessonEnabled: true, minLessonDurationMinutes: 30, lateFeePercent: 50 },
  payment: { platformFeeRate: 0.15, currency: "GBP", payoutScheduleDays: 7 },
  notifications: { emailEnabled: true, smsEnabled: false },
  content: { reviewModerationRequired: true },
  security: { maxLoginAttempts: 5, sessionTimeoutMinutes: 60, requireTutorVerification: true },
};

/**
 * Platform settings is a real backend singleton — mock mode has nowhere to
 * persist a write, so it never pretends a save succeeded (same honesty
 * precedent as adminUsersService).
 */
export const adminSettingsService = {
  async get(): Promise<PlatformSettings> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return DEFAULT_SETTINGS;
    }
    return apiRequest<PlatformSettings>(ENDPOINTS.admin.settings);
  },

  async update(input: PlatformSettingsInput): Promise<PlatformSettings> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Updating platform settings isn't available in mock mode");
    }
    return apiRequest<PlatformSettings>(ENDPOINTS.admin.settings, { method: "PUT", body: input });
  },
};
