import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { PlatformAnnouncement, CreateAnnouncementInput, CreateAnnouncementResult } from "../types";

/**
 * An announcement persists a real record and reaches real users (however
 * simulated the in-app delivery) — mock mode has no history to fabricate and
 * must never pretend a broadcast went out, so it honestly returns an empty
 * history and rejects sends (same precedent as adminUsersService).
 */
export const adminAnnouncementsService = {
  async list(): Promise<PlatformAnnouncement[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<PlatformAnnouncement[]>(ENDPOINTS.admin.announcements);
  },

  async create(input: CreateAnnouncementInput): Promise<CreateAnnouncementResult> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Sending announcements isn't available in mock mode");
    }
    return apiRequest<CreateAnnouncementResult>(ENDPOINTS.admin.announcements, { method: "POST", body: input });
  },
};
