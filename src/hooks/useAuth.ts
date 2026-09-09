import type { LoginInput, RegisterInput } from "@myt/shared";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/features/authentication/services/authService";

/**
 * The single centralized auth hook — every component that needs to know
 * "who is logged in" or perform an auth action reads/calls through here,
 * never through `useAuthStore` or `authService` directly. `login`/`register`
 * update the store on success; `useLogin`/`useRegister` (TanStack Query
 * wrappers around this same service) exist alongside this for pages that
 * want mutation-style loading/error state.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.logout);

  async function login(input: LoginInput) {
    const session = await authService.login(input);
    setSession({ user: session.user, accessToken: session.tokens.accessToken, refreshToken: session.tokens.refreshToken });
    return session;
  }

  async function register(input: RegisterInput) {
    const session = await authService.register(input);
    setSession({ user: session.user, accessToken: session.tokens.accessToken, refreshToken: session.tokens.refreshToken });
    return session;
  }

  async function logout() {
    try {
      await authService.logout(refreshToken ?? undefined);
    } finally {
      clearSession();
    }
  }

  /** Silently exchanges the current refresh token for a new session — used to keep a session alive without forcing re-login. */
  async function refreshSession() {
    if (!refreshToken) return false;
    try {
      const tokens = await authService.refresh(refreshToken);
      if (!user) return false;
      setSession({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  return {
    currentUser: user,
    user,
    role: user?.role,
    isAuthenticated: Boolean(user),
    accessToken,
    login,
    register,
    logout,
    refreshSession,
  };
}
