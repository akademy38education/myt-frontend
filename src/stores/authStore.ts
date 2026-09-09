import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { User } from "@myt/shared";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (session: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

/**
 * Whether the next `setSession` should survive a browser restart
 * ("Remember me", set from LoginPage before calling login). When false, the
 * session still lives in memory for the rest of this tab's life (Zustand
 * state itself is untouched) but is never mirrored to localStorage, so
 * closing the browser signs the user out — exactly what an unchecked
 * "Remember me" should do. Defaults to true so every other call site
 * (register, onboarding) behaves as it did before this existed.
 */
let persistSession = true;
export function setRememberSession(remember: boolean) {
  persistSession = remember;
}

const conditionalLocalStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => {
    if (persistSession) localStorage.setItem(name, value);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

/**
 * Session state, persisted to localStorage so a refresh doesn't log the
 * user out. This is the ONLY place auth state lives — components read it
 * via `useAuth()` (hooks/useAuth.ts), never directly from localStorage.
 *
 * Swapping mock auth for a real provider later means changing
 * `features/authentication/services/authService.ts` only; this store's
 * shape does not need to change.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) => set({ user, accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "myt-auth", storage: createJSONStorage(() => conditionalLocalStorage) }
  )
);
