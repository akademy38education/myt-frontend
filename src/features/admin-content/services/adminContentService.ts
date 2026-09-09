import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { ContentItem, ContentItemInput, ContentStatusInput, ContentVersion } from "@myt/shared";
import type { ContentItemFilter } from "../types";

/**
 * CMS content is authored by admins, not seeded — there's no pre-existing
 * mock dataset of pages/announcements/FAQs across every status (same
 * precedent as reportsService/adminUsersService). Mock mode honestly returns
 * an empty list and rejects mutations rather than fabricating one.
 */
export const adminContentService = {
  async list(filter: ContentItemFilter = {}): Promise<ContentItem[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<ContentItem[]>(ENDPOINTS.content.adminList, { query: { type: filter.type, status: filter.status } });
  },

  async getOne(id: string): Promise<ContentItem> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Content item not found");
    }
    return apiRequest<ContentItem>(ENDPOINTS.content.adminById(id));
  },

  async versions(id: string): Promise<ContentVersion[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<ContentVersion[]>(ENDPOINTS.content.adminVersions(id));
  },

  async create(input: ContentItemInput): Promise<ContentItem> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Creating content isn't available in mock mode");
    }
    return apiRequest<ContentItem>(ENDPOINTS.content.create, { method: "POST", body: input });
  },

  async update(id: string, input: ContentItemInput): Promise<ContentItem> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Updating content isn't available in mock mode");
    }
    return apiRequest<ContentItem>(ENDPOINTS.content.update(id), { method: "PATCH", body: input });
  },

  async setStatus(id: string, input: ContentStatusInput): Promise<ContentItem> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Updating content status isn't available in mock mode");
    }
    return apiRequest<ContentItem>(ENDPOINTS.content.setStatus(id), { method: "PATCH", body: input });
  },
};
