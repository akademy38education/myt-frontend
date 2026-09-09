import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestVerificationInfoInput } from "@myt/shared";
import { adminTutorVerificationService } from "../services/adminTutorVerificationService";

export function useRequestTutorInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, input }: { applicationId: string; input: RequestVerificationInfoInput }) =>
      adminTutorVerificationService.requestInfo(applicationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tutor-verification", "queue"] });
    },
  });
}
