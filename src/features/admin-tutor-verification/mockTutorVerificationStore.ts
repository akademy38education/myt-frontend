import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TutorApplicationWithApplicant } from "@myt/shared";
import { mockTutorApplications } from "@/mocks";

interface MockTutorVerificationState {
  applications: TutorApplicationWithApplicant[];
  update: (id: string, patch: Partial<TutorApplicationWithApplicant>) => TutorApplicationWithApplicant | undefined;
}

/** Mock-mode-only mutable verification queue — mirrors what `tutor-verification.repository` does on the real backend, so approve/reject/request-info actually transition the one seeded PENDING application (see `admin-users`'s equivalent store). */
export const useMockTutorVerificationStore = create<MockTutorVerificationState>()(
  persist(
    (set, get) => ({
      applications: mockTutorApplications,
      update: (id, patch) => {
        let updated: TutorApplicationWithApplicant | undefined;
        set((state) => ({
          applications: state.applications.map((a) => {
            if (a.id !== id) return a;
            updated = { ...a, ...patch, updatedAt: new Date().toISOString() };
            return updated;
          }),
        }));
        return updated ?? get().applications.find((a) => a.id === id);
      },
    }),
    { name: "myt-mock-tutor-verification", storage: createJSONStorage(() => localStorage) }
  )
);
