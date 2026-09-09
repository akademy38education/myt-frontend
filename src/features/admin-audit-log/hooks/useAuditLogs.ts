import { useQuery } from "@tanstack/react-query";
import { adminAuditLogService } from "../services/adminAuditLogService";
import type { AuditLogFilter } from "../types";

export function useAuditLogs(filter: AuditLogFilter) {
  return useQuery({
    queryKey: ["admin-audit-logs", filter],
    queryFn: () => adminAuditLogService.list(filter),
  });
}
