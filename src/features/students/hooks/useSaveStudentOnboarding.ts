import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StudentOnboardingInput } from "@myt/shared";
import { studentsService } from "../services/studentsService";

export function useSaveStudentOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentUserId, input, completeOnboarding }: { studentUserId: string; input: StudentOnboardingInput; completeOnboarding?: boolean }) =>
      studentsService.saveOnboardingStep(studentUserId, input, completeOnboarding),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
