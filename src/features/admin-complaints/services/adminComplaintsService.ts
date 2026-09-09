import type { AssignReportInput, CreateReportInput, ResolveReportInput, Report } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { ComplaintFilter } from "../types";

/**
 * User-filed reports have no mock fixture (nothing in `@/mocks` seeds them,
 * same rationale as `features/reports`'s lesson-progress reports): mock mode
 * honestly returns nothing to read and refuses mutations rather than
 * fabricating a queue.
 */
export const adminComplaintsService = {
  async list(filter: ComplaintFilter = {}): Promise<Report[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<Report[]>(ENDPOINTS.complaints.list, {
      query: { status: filter.status, severity: filter.severity, assignedAdminId: filter.assignedAdminId },
    });
  },

  async getOne(id: string): Promise<Report> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Report not found");
    }
    return apiRequest<Report>(ENDPOINTS.complaints.byId(id));
  },

  async create(input: CreateReportInput): Promise<Report> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Reporting is unavailable in mock mode.");
    }
    return apiRequest<Report>(ENDPOINTS.complaints.create, { method: "POST", body: input });
  },

  async assign(id: string, input: AssignReportInput): Promise<Report> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Report not found");
    }
    return apiRequest<Report>(ENDPOINTS.complaints.assign(id), { method: "POST", body: input });
  },

  async resolve(id: string, input: ResolveReportInput): Promise<Report> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Report not found");
    }
    return apiRequest<Report>(ENDPOINTS.complaints.resolve(id), { method: "POST", body: input });
  },
};
