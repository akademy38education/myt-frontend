import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Wraps a subtree of routes that require *any* authenticated user.
 * Combine with <RoleGuard/> to further restrict to specific roles.
 * Authentication is mocked today (see features/authentication) but this
 * guard only depends on `useAuth()`, so swapping in real auth later
 * requires no route changes.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
