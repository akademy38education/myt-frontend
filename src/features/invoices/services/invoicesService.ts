import type { Invoice } from "@myt/shared";
import { apiRequest, apiRequestText } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

/**
 * Invoices are a brand-new Phase 13 entity with no pre-existing mock
 * dataset (unlike `payments`, which Phase 9 seeded a mock fixture for) — so
 * mock mode honestly returns an empty list rather than fabricating invoice
 * records that could drift from what the real backend actually issues,
 * matching the precedent set for other Phase-13-and-later admin-only/new
 * entities (e.g. `reportsService` since Phase 9, `homeworkService` before
 * its Phase 12 real migration).
 */
export const invoicesService = {
  async listMine(): Promise<Invoice[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<Invoice[]>(ENDPOINTS.invoices.mine);
  },

  async getOne(invoiceId: string): Promise<Invoice> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Invoice not found");
    }
    return apiRequest<Invoice>(ENDPOINTS.invoices.byId(invoiceId));
  },

  async download(invoiceId: string): Promise<string> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return "";
    }
    return apiRequestText(ENDPOINTS.invoices.download(invoiceId));
  },
};
