import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

/** Ephemeral, non-persisted UI state shared across the shell (nav, drawers, ...). */
export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
