import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TutorApplicationInput } from "@myt/shared";

interface TutorOnboardingState {
  draft: Partial<TutorApplicationInput>;
  updateDraft: (patch: Partial<TutorApplicationInput>) => void;
  reset: () => void;
}

/** Client-side draft for the tutor application wizard — see the equivalent comment in the student store. */
export const useTutorOnboardingStore = create<TutorOnboardingState>()(
  persist(
    (set) => ({
      draft: {
        languages: [],
        subjects: [],
        yearLevels: [],
        curricula: [],
        ageGroups: [],
        qualifications: [],
        availability: [],
        currency: "GBP",
        trialLessonEnabled: false,
      },
      updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      reset: () =>
        set({
          draft: {
            languages: [],
            subjects: [],
            yearLevels: [],
            curricula: [],
            ageGroups: [],
            qualifications: [],
            availability: [],
            currency: "GBP",
            trialLessonEnabled: false,
          },
        }),
    }),
    { name: "myt-onboarding-tutor" }
  )
);
