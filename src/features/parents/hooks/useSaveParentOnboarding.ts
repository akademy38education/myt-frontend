import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ParentOnboardingInput } from "@myt/shared";
import { parentsService } from "../services/parentsService";

export function useSaveParentOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentUserId, input, completeOnboarding }: { parentUserId: string; input: ParentOnboardingInput; completeOnboarding?: boolean }) =>
      parentsService.saveOnboardingStep(parentUserId, input, completeOnboarding),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parents"] }),
  });
}
