import { adminRoleHasPermission, roleHasPermission, UserRole, type Permission } from "@myt/shared";
import { useAuth } from "@/hooks/useAuth";

/**
 * Centralized permission check for the frontend. Feature components should
 * call `usePermission("booking.cancel")` rather than inlining
 * `user.role === "ADMIN"` checks — see shared/constants/permissions.ts for
 * the full catalogue.
 *
 * An ADMIN user's permissions come entirely from their `adminRole` via
 * `ADMIN_ROLE_PERMISSIONS` (a Moderator/Support/Finance/Content Manager
 * holds only what its sub-role grants) — never from `ROLE_PERMISSIONS`,
 * which only matters for the non-admin roles here. This mirrors the
 * backend's `requirePermission` middleware exactly, so the admin nav/pages
 * never offer an action the API would reject.
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (user.role === UserRole.ADMIN) return adminRoleHasPermission(user.adminRole, permission);
  return roleHasPermission(user.role, permission);
}
