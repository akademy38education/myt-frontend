import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ParentSettingsInput } from "@myt/shared";
import { parentsService } from "../services/parentsService";

export function useUpdateParentSettings(parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ParentSettingsInput) => parentsService.updateSettings(parentId, input),
    onSuccess: (parent) => {
      queryClient.setQueryData(["parents", "me", parent.userId], parent);
    },
  });
}
