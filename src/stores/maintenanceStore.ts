import { create } from "zustand";

interface MaintenanceState {
  active: boolean;
  setActive: (active: boolean) => void;
}

/** Not persisted — reflects only the CURRENT server state, so every page load starts assuming maintenance is off until a request says otherwise (see api/client.ts's MAINTENANCE_MODE handling). */
export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));
