import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { VerificationDecisionInput } from "@myt/shared";
import { adminTutorVerificationService } from "../services/adminTutorVerificationService";

export function useRejectTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, input }: { applicationId: string; input: VerificationDecisionInput }) =>
      adminTutorVerificationService.reject(applicationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tutor-verification", "queue"] });
    },
  });
}
