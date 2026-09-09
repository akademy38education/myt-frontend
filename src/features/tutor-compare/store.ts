import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_COMPARE = 3;

interface TutorCompareState {
  tutorIds: string[];
  toggle: (tutorId: string) => void;
  clear: () => void;
}

/** Client-only selection state for the "compare up to 3 tutors" flow — persisted so the selection survives navigating to a tutor profile and back. */
export const useTutorCompareStore = create<TutorCompareState>()(
  persist(
    (set) => ({
      tutorIds: [],
      toggle: (tutorId) =>
        set((state) => {
          if (state.tutorIds.includes(tutorId)) return { tutorIds: state.tutorIds.filter((id) => id !== tutorId) };
          if (state.tutorIds.length >= MAX_COMPARE) return state;
          return { tutorIds: [...state.tutorIds, tutorId] };
        }),
      clear: () => set({ tutorIds: [] }),
    }),
    { name: "myt-tutor-compare", storage: createJSONStorage(() => localStorage) }
  )
);

export const MAX_COMPARE_TUTORS = MAX_COMPARE;
