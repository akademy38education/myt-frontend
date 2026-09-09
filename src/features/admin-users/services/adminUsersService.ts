import { UserAccountStatus } from "@myt/shared";
import { apiRequest, apiRequestWithMeta } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { useAuthStore } from "@/stores/authStore";
import { useMockUsersStore } from "../mockUsersStore";
import type { User, UserSearchQuery, SuspendUserInput, ReactivateUserInput, AssignAdminRoleInput, AdminUserSearchResult } from "../types";

const DEFAULT_PAGE_SIZE = 20;

export const adminUsersService = {
  async search(query: UserSearchQuery): Promise<AdminUserSearchResult> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const q = query.q?.trim().toLowerCase();
      const filtered = useMockUsersStore.getState().users.filter(
        (u) =>
          (!q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
          (!query.role || u.role === query.role) &&
          (!query.accountStatus || u.accountStatus === query.accountStatus)
      );
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)) };
    }
    const response = await apiRequestWithMeta<User[]>(ENDPOINTS.users.list, {
      query: { q: query.q, role: query.role, accountStatus: query.accountStatus, page: query.page, pageSize: query.pageSize },
    });
    const meta = response.meta ?? { page: query.page ?? 1, pageSize: query.pageSize ?? response.data.length, total: response.data.length, totalPages: 1 };
    return { items: response.data, ...meta };
  },

  async getById(id: string): Promise<User> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const user = useMockUsersStore.getState().users.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    }
    return apiRequest<User>(ENDPOINTS.users.byId(id));
  },

  async suspend(id: string, input: SuspendUserInput): Promise<User> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const updated = useMockUsersStore.getState().update(id, {
        accountStatus: UserAccountStatus.SUSPENDED,
        suspensionReason: input.reason,
        suspendedAt: new Date().toISOString(),
        suspendedUntil: input.suspendedUntil,
        suspendedByAdminId: useAuthStore.getState().user?.id,
      });
      if (!updated) throw new Error("User not found");
      return updated;
    }
    return apiRequest<User>(ENDPOINTS.users.suspend(id), { method: "POST", body: input });
  },

  async reactivate(id: string, input: ReactivateUserInput): Promise<User> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const updated = useMockUsersStore.getState().update(id, {
        accountStatus: UserAccountStatus.ACTIVE,
        suspensionReason: undefined,
        suspendedAt: undefined,
        suspendedUntil: undefined,
        suspendedByAdminId: undefined,
      });
      if (!updated) throw new Error("User not found");
      void input;
      return updated;
    }
    return apiRequest<User>(ENDPOINTS.users.reactivate(id), { method: "POST", body: input });
  },

  async assignAdminRole(id: string, input: AssignAdminRoleInput): Promise<User> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const updated = useMockUsersStore.getState().update(id, { adminRole: input.adminRole ?? undefined });
      if (!updated) throw new Error("User not found");
      return updated;
    }
    return apiRequest<User>(ENDPOINTS.users.adminRole(id), { method: "POST", body: input });
  },
};
