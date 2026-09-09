import { Outlet } from "react-router-dom";
import type { Permission } from "@myt/shared";
import { usePermission } from "@/hooks/usePermission";
import { ForbiddenState } from "@/components/shared/ForbiddenState";

/**
 * Restricts a subtree of routes to users holding a specific permission (see
 * `@myt/shared`'s permission catalogue) — finer-grained than `RoleGuard`,
 * for actions that aren't simply "any STUDENT/PARENT/TUTOR/ADMIN" but a
 * specific capability (e.g. `payment.manage`). Use nested inside
 * `<ProtectedRoute/>`.
 */
export function PermissionGuard({ require }: { require: Permission }) {
  const hasPermission = usePermission(require);

  if (!hasPermission) {
    return <ForbiddenState />;
  }

  return <Outlet />;
}
