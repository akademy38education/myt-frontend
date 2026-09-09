import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedChildState {
  /** `null` means "All Children" — the family-wide view. */
  selectedChildId: string | null;
  setSelectedChildId: (childId: string | null) => void;
}

/**
 * Which child (or "all") the parent is currently focused on — persisted so
 * it survives navigation between pages and a page refresh, matching how a
 * parent naturally thinks ("I'm looking at Alex's stuff right now") rather
 * than resetting to "all" every time they open a new tab of the app.
 */
export const useSelectedChildStore = create<SelectedChildState>()(
  persist(
    (set) => ({
      selectedChildId: null,
      setSelectedChildId: (childId) => set({ selectedChildId: childId }),
    }),
    { name: "myt-selected-child" }
  )
);
