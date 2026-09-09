import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateChildInput } from "@myt/shared";
import { parentsService } from "../services/parentsService";

export function useAddChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentUserId, input }: { parentUserId: string; input: CreateChildInput }) => parentsService.addChild(parentUserId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parents"] }),
  });
}
