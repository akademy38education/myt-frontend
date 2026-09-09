import { apiRequestWithMeta } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import type { AuditLog, AuditLogFilter, AuditLogSearchResult } from "../types";

const DEFAULT_PAGE_SIZE = 20;

/**
 * The audit log is an immutable, server-generated record of real admin
 * actions — there's no natural mock dataset of past actions to fabricate
 * (same precedent as adminUsersService/reportsService), so mock mode
 * honestly returns an empty log rather than inventing history.
 */
export const adminAuditLogService = {
  async list(filter: AuditLogFilter): Promise<AuditLogSearchResult> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { items: [], page: filter.page ?? 1, pageSize: filter.pageSize ?? DEFAULT_PAGE_SIZE, total: 0, totalPages: 1 };
    }
    const response = await apiRequestWithMeta<AuditLog[]>(ENDPOINTS.admin.auditLogs, {
      query: {
        category: filter.category,
        actorId: filter.actorId,
        targetId: filter.targetId,
        from: filter.from,
        to: filter.to,
        page: filter.page,
        pageSize: filter.pageSize,
      },
    });
    const meta = response.meta ?? {
      page: filter.page ?? 1,
      pageSize: filter.pageSize ?? response.data.length,
      total: response.data.length,
      totalPages: 1,
    };
    return { items: response.data, ...meta };
  },
};
