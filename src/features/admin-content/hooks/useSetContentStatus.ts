import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentStatusInput } from "@myt/shared";
import { adminContentService } from "../services/adminContentService";

/** Not bound to one content id — used from a list page where any row's status can change. */
export function useSetContentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ContentStatusInput }) => adminContentService.setStatus(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-content", "list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-content", "detail", variables.id] });
      toast.success("Content status updated");
    },
    onError: () => {
      toast.error("Couldn't update the content status. Please try again.");
    },
  });
}
