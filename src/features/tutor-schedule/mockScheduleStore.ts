import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AvailabilityBlock } from "@myt/shared";
import { randomUUID } from "@/utils/uuid";
import type { AvailabilityRange } from "@/components/shared/AvailabilityEditor";
import type { AvailabilityBlockDraft } from "./services/tutorScheduleService";

interface MockScheduleState {
  rules: AvailabilityRange[];
  blocks: AvailabilityBlock[];
  setRules: (rules: AvailabilityRange[]) => void;
  addBlock: (draft: AvailabilityBlockDraft) => AvailabilityBlock;
  removeBlock: (id: string) => void;
}

/** Mock-mode-only persistence for the tutor availability editor, mirroring `availabilityRulesRepository`/`availabilityBlocksRepository` on the backend. */
export const useMockScheduleStore = create<MockScheduleState>()(
  persist(
    (set, get) => ({
      rules: [
        { dayOfWeek: 1, startTime: "17:00", endTime: "20:00" },
        { dayOfWeek: 2, startTime: "17:00", endTime: "20:00" },
      ],
      blocks: [],
      setRules: (rules) => set({ rules }),
      addBlock: (draft) => {
        const block: AvailabilityBlock = { id: randomUUID(), tutorId: "mock-tutor", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...draft };
        set({ blocks: [...get().blocks, block] });
        return block;
      },
      removeBlock: (id) => set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) })),
    }),
    { name: "myt-mock-schedule", storage: createJSONStorage(() => localStorage) }
  )
);
