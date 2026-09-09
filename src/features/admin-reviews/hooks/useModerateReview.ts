import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ModerateReviewInput } from "@myt/shared";
import { adminReviewsService } from "../services/adminReviewsService";

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ModerateReviewInput }) => adminReviewsService.moderate(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });
}
