import {
  UserRole,
  UserAccountStatus,
  AdminRole,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type User,
} from "@myt/shared";
import { apiRequest, ApiError } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

/**
 * The demo/mock login roster — deliberately the exact same four accounts
 * documented in the repo README and hand-written into
 * `backend/src/models/seedData.ts` (same ids, same names), so a demo run
 * with `VITE_USE_MOCK_API=true` and a real run against the live backend
 * log in as the identical people. Keyed by lowercased email so lookup is
 * case-insensitive, matching how a real login would behave.
 */
const DEMO_ACCOUNTS: Record<string, User> = {
  "amelia.student@myt.dev": {
    id: "user-student-1",
    email: "amelia.student@myt.dev",
    fullName: "Amelia Carter",
    role: UserRole.STUDENT,
    isActive: true,
    accountStatus: UserAccountStatus.ACTIVE,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z",
  },
  "james.parent@myt.dev": {
    id: "user-parent-1",
    email: "james.parent@myt.dev",
    fullName: "James Carter",
    role: UserRole.PARENT,
    isActive: true,
    accountStatus: UserAccountStatus.ACTIVE,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z",
  },
  "sofia.tutor@myt.dev": {
    id: "user-tutor-1",
    email: "sofia.tutor@myt.dev",
    fullName: "Dr. Sofia Reyes",
    role: UserRole.TUTOR,
    isActive: true,
    accountStatus: UserAccountStatus.ACTIVE,
    createdAt: "2026-01-05T09:00:00.000Z",
    updatedAt: "2026-01-05T09:00:00.000Z",
  },
  "priya.admin@myt.dev": {
    id: "user-admin-1",
    email: "priya.admin@myt.dev",
    fullName: "Priya Nair",
    role: UserRole.ADMIN,
    adminRole: AdminRole.SUPER_ADMIN,
    isActive: true,
    accountStatus: UserAccountStatus.ACTIVE,
    createdAt: "2026-01-05T09:00:00.000Z",
    updatedAt: "2026-01-05T09:00:00.000Z",
  },
};
const DEMO_PASSWORD = "Password123!";

/**
 * UI -> service -> (mock | real API), per the mock-data architecture in
 * docs/architecture/README.md. Toggle with VITE_USE_MOCK_API — no calling
 * code (components, hooks) needs to change either way. This is the ONLY
 * module that knows how a user authenticates — `useAuth()` and the auth
 * store are shape-agnostic and just hold whatever session this returns.
 */
export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const account = DEMO_ACCOUNTS[input.email.trim().toLowerCase()];
      if (!account || input.password !== DEMO_PASSWORD) {
        throw new ApiError("Invalid email or password", 401, "INVALID_CREDENTIALS");
      }
      return { user: account, tokens: { accessToken: `mock-access-token-${account.id}`, refreshToken: `mock-refresh-token-${account.id}` } };
    }
    return apiRequest<AuthSession>(ENDPOINTS.auth.login, { method: "POST", body: input });
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const user: User = {
        id: `user-demo-${Date.now()}`,
        email: input.email,
        fullName: input.fullName,
        role: input.role,
        isActive: true,
        accountStatus: UserAccountStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { user, tokens: { accessToken: `mock-access-token-${user.id}`, refreshToken: `mock-refresh-token-${user.id}` } };
    }
    return apiRequest<AuthSession>(ENDPOINTS.auth.register, { method: "POST", body: input });
  },

  async logout(refreshToken?: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) return;
    // Sends the refresh token so the backend can actually revoke it, not
    // just have the client discard it — see `tokenDenylist.ts`.
    await apiRequest<null>(ENDPOINTS.auth.logout, { method: "POST", body: { refreshToken } });
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" };
    }
    return apiRequest<AuthTokens>(ENDPOINTS.auth.refresh, { method: "POST", body: { refreshToken } });
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return;
    }
    await apiRequest<null>(ENDPOINTS.auth.forgotPassword, { method: "POST", body: input });
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return;
    }
    await apiRequest<null>(ENDPOINTS.auth.resetPassword, { method: "POST", body: input });
  },

  async verifyEmail(token: string): Promise<User> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return DEMO_ACCOUNTS["amelia.student@myt.dev"]!;
    }
    return apiRequest<User>(ENDPOINTS.auth.verify, { method: "POST", body: { token } });
  },
};
