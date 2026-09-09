import { Outlet } from "react-router-dom";
import type { UserRole } from "@myt/shared";
import { useAuth } from "@/hooks/useAuth";
import { ForbiddenState } from "@/components/shared/ForbiddenState";

/** Restricts a subtree of routes to one or more roles. Use nested inside <ProtectedRoute/>. */
export function RoleGuard({ allow }: { allow: UserRole[] }) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <ForbiddenState />;
  }

  return <Outlet />;
}
