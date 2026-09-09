import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { VerificationDecisionInput } from "@myt/shared";
import { adminTutorVerificationService } from "../services/adminTutorVerificationService";

export function useApproveTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, input }: { applicationId: string; input: VerificationDecisionInput }) =>
      adminTutorVerificationService.approve(applicationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tutor-verification", "queue"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tutors"] });
    },
  });
}
