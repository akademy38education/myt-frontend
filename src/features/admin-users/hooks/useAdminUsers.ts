import { useQuery } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminUsersService";
import type { UserSearchQuery } from "../types";

/** `enabled` lets a caller without USERS_VIEW skip the request entirely rather than firing a call the backend would just 403. */
export function useAdminUsers(query: UserSearchQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => adminUsersService.search(query),
    enabled: options.enabled ?? true,
  });
}
