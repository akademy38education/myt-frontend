import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SavedTutorsState {
  tutorIds: string[];
  add: (tutorId: string) => void;
  remove: (tutorId: string) => void;
}

/**
 * Mock-mode-only persistence for saved tutors (see savedTutorsService — the
 * real backend has its own `SavedTutor` records via
 * POST/DELETE /tutors/:id/save, which this store never touches). Persisted
 * so a saved list survives a refresh while testing with
 * VITE_USE_MOCK_API=true.
 */
export const useSavedTutorsStore = create<SavedTutorsState>()(
  persist(
    (set) => ({
      tutorIds: [],
      add: (tutorId) => set((state) => ({ tutorIds: state.tutorIds.includes(tutorId) ? state.tutorIds : [...state.tutorIds, tutorId] })),
      remove: (tutorId) => set((state) => ({ tutorIds: state.tutorIds.filter((id) => id !== tutorId) })),
    }),
    { name: "myt-saved-tutors", storage: createJSONStorage(() => localStorage) }
  )
);
