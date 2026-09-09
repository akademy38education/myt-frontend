import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal } from "@myt/shared";
import { mockGoals } from "@/mocks";
import { randomUUID } from "@/utils/uuid";

interface GoalsState {
  goals: Goal[];
  addGoal: (input: { studentId: string; title: string; subjectId?: string; priority?: Goal["priority"]; targetDate: string }) => Goal;
  updateProgress: (goalId: string, progress: number) => void;
  removeGoal: (goalId: string) => void;
}

/** Goal is a scaffolded backend entity (backend/src/modules/goals) — real create/update, just local to this browser for now, seeded from mocks/goals.mock.ts. */
export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: mockGoals,
      addGoal: (input) => {
        const now = new Date().toISOString();
        const goal: Goal = { id: randomUUID(), progress: 0, createdAt: now, updatedAt: now, ...input };
        set({ goals: [goal, ...get().goals] });
        return goal;
      },
      updateProgress: (goalId, progress) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === goalId ? { ...g, progress, updatedAt: new Date().toISOString() } : g)),
        })),
      removeGoal: (goalId) => set((state) => ({ goals: state.goals.filter((g) => g.id !== goalId) })),
    }),
    { name: "myt-goals" }
  )
);
