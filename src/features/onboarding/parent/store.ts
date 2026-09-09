import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ParentOnboardingInput, ChildProfile, CreateChildInput } from "@myt/shared";

export interface DraftChild extends CreateChildInput {
  /** Set once the child has been created server-side (see ParentChildrenStep). */
  savedId?: string;
}

interface ParentOnboardingState {
  account: ParentOnboardingInput;
  children: DraftChild[];
  savedChildren: ChildProfile[];
  permissionsAcknowledged: boolean;
  updateAccount: (patch: Partial<ParentOnboardingInput>) => void;
  setChildren: (children: DraftChild[]) => void;
  setSavedChildren: (children: ChildProfile[]) => void;
  setPermissionsAcknowledged: (value: boolean) => void;
  reset: () => void;
}

const emptyChild: DraftChild = { fullName: "", yearGroup: "", subjects: [], learningGoals: [] };

/** Client-side draft for the parent onboarding wizard — see the equivalent comment in the student store. */
export const useParentOnboardingStore = create<ParentOnboardingState>()(
  persist(
    (set) => ({
      account: {},
      children: [{ ...emptyChild }],
      savedChildren: [],
      permissionsAcknowledged: false,
      updateAccount: (patch) => set((state) => ({ account: { ...state.account, ...patch } })),
      setChildren: (children) => set({ children }),
      setSavedChildren: (savedChildren) => set({ savedChildren }),
      setPermissionsAcknowledged: (value) => set({ permissionsAcknowledged: value }),
      reset: () => set({ account: {}, children: [{ ...emptyChild }], savedChildren: [], permissionsAcknowledged: false }),
    }),
    { name: "myt-onboarding-parent" }
  )
);
