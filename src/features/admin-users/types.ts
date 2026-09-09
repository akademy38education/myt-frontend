import type { User, SuspendUserInput, ReactivateUserInput, AssignAdminRoleInput, UserSearchQuery } from "@myt/shared";
import { UserRole, AdminRole, UserAccountStatus, SUSPENSION_REASONS } from "@myt/shared";

export type { User, SuspendUserInput, ReactivateUserInput, AssignAdminRoleInput, UserSearchQuery };
export { UserRole, AdminRole, UserAccountStatus, SUSPENSION_REASONS };

/** Local UI filter state for the Users page — mapped onto `UserSearchQuery` when a search actually fires. */
export interface AdminUsersFilterState {
  q: string;
  role?: UserRole;
  accountStatus?: UserAccountStatus;
}

export interface AdminUserSearchResult {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
