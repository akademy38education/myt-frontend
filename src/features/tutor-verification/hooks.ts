import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TutorApplicationInput } from "@myt/shared";
import { tutorVerificationService } from "./service";

export function useTutorApplicationStatus(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-verification", tutorId, "status"],
    queryFn: () => tutorVerificationService.getStatus(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useSaveTutorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, submit }: { input: Partial<TutorApplicationInput>; submit: boolean }) => tutorVerificationService.saveApplication(input, submit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-verification"] }),
  });
}
