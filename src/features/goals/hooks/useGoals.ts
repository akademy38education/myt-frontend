import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsService, type CreateGoalInput } from "../services/goalsService";

export function useGoals(studentId: string) {
  return useQuery({ queryKey: ["goals", studentId], queryFn: () => goalsService.list(studentId), enabled: Boolean(studentId) });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGoalInput) => goalsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) => goalsService.updateProgress(goalId, progress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });
}
