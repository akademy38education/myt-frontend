import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateChildInput } from "@myt/shared";
import { parentsService } from "../services/parentsService";

export function useUpdateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentUserId, childId, input }: { parentUserId: string; childId: string; input: Partial<CreateChildInput> }) =>
      parentsService.updateChild(parentUserId, childId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parents"] }),
  });
}
