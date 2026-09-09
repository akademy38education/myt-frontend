import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserAccountStatus, type User } from "@myt/shared";
import { mockUsers } from "@/mocks";

interface MockUsersState {
  users: User[];
  update: (id: string, patch: Partial<User>) => User | undefined;
}

/** Mock-mode-only mutable user directory — mirrors what `usersRepository` does on the real backend, so `VITE_USE_MOCK_API=true` can exercise search/suspend/reactivate/assign-role too, not just read the static seed list (see `admin-tutor-verification`/`admin-support`'s equivalent stores). */
export const useMockUsersStore = create<MockUsersState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      update: (id, patch) => {
        let updated: User | undefined;
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== id) return u;
            updated = { ...u, ...patch, updatedAt: new Date().toISOString() };
            return updated;
          }),
        }));
        return updated ?? get().users.find((u) => u.id === id);
      },
    }),
    { name: "myt-mock-users", storage: createJSONStorage(() => localStorage) }
  )
);

/** Shorthand for the two account-status transitions `adminUsersService` needs. */
export function isSuspended(user: User): boolean {
  return user.accountStatus === UserAccountStatus.SUSPENDED;
}
