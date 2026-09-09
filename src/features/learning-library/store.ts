import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibraryState {
  bookmarkedIds: string[];
  completedIds: string[];
  toggleBookmark: (id: string) => void;
  markComplete: (id: string) => void;
}

/** Learning library resources are mock data (see mocks/library.mock.ts); bookmarks/completion are real, just local to this browser for now. */
export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      bookmarkedIds: [],
      completedIds: [],
      toggleBookmark: (id) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(id) ? state.bookmarkedIds.filter((b) => b !== id) : [...state.bookmarkedIds, id],
        })),
      markComplete: (id) => set((state) => ({ completedIds: state.completedIds.includes(id) ? state.completedIds : [...state.completedIds, id] })),
    }),
    { name: "myt-library" }
  )
);
