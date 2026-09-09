import type { AuditLog } from "@myt/shared";
import { AdminActionCategory } from "@myt/shared";

export type { AuditLog };
export { AdminActionCategory };

export interface AuditLogFilter {
  category?: AdminActionCategory;
  actorId?: string;
  targetId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogSearchResult {
  items: AuditLog[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
