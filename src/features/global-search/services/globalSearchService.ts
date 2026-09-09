import type { SearchResponse } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";

export const globalSearchService = {
  async search(q: string): Promise<SearchResponse> {
    if (env.VITE_USE_MOCK_API) return { results: [] };
    return apiRequest<SearchResponse>(ENDPOINTS.search.query, { query: { q } });
  },
};
