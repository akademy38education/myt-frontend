import { apiRequest, apiRequestText } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { LessonReportSummary, ReportFilter } from "../types";

/**
 * A "report" is a completed lesson with a written summary — there's no
 * separate mock dataset for these (see backend/src/modules/reports's
 * README): they only exist once a tutor has actually ended a lesson with a
 * summary via the Phase 7/8 classroom or Lesson Summary Editor. Mock mode
 * has no persisted lesson-summary store to read from, so it honestly
 * returns nothing rather than fabricating report content.
 */
export const reportsService = {
  async list(filter: ReportFilter): Promise<LessonReportSummary[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return [];
    }
    return apiRequest<LessonReportSummary[]>(ENDPOINTS.reports.list, { query: filter as unknown as Record<string, string | undefined> });
  },

  async getOne(bookingId: string): Promise<LessonReportSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      throw new Error("Report not found");
    }
    return apiRequest<LessonReportSummary>(ENDPOINTS.reports.byId(bookingId));
  },

  async exportOne(bookingId: string): Promise<string> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return "";
    }
    return apiRequestText(ENDPOINTS.reports.export(bookingId));
  },
};
