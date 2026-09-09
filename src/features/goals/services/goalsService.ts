import { UserRole, type Goal } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { delay } from "@/utils/delay";
import { useGoalsStore } from "../store";

export interface CreateGoalInput {
  studentId: string;
  title: string;
  subjectId?: string;
  priority?: Goal["priority"];
  targetDate: string;
}

export const goalsService = {
  async list(studentId: string): Promise<Goal[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return useGoalsStore
        .getState()
        .goals.filter((g) => g.studentId === studentId)
        .sort((a, b) => a.targetDate.localeCompare(b.targetDate));
    }

    /** A student fetching their own goals must use `mine` — `student/:id` is parent/admin-only. */
    const isOwnGoals = useAuthStore.getState().user?.role === UserRole.STUDENT;
    const goals = await apiRequest<Goal[]>(isOwnGoals ? ENDPOINTS.goals.mine : ENDPOINTS.goals.forStudent(studentId));
    return [...goals].sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  },

  async create(input: CreateGoalInput): Promise<Goal> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      return useGoalsStore.getState().addGoal(input);
    }
    return apiRequest<Goal>(ENDPOINTS.goals.create, { method: "POST", body: input });
  },

  async updateProgress(goalId: string, progress: number): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      useGoalsStore.getState().updateProgress(goalId, progress);
      return;
    }
    await apiRequest<Goal>(ENDPOINTS.goals.updateProgress(goalId), { method: "PATCH", body: { progress } });
  },

  async remove(goalId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      useGoalsStore.getState().removeGoal(goalId);
      return;
    }
    await apiRequest<void>(ENDPOINTS.goals.remove(goalId), { method: "DELETE" });
  },
};
