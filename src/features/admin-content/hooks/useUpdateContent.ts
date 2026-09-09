import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentItemInput } from "@myt/shared";
import { adminContentService } from "../services/adminContentService";

export function useUpdateContent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContentItemInput) => adminContentService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content", "list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-content", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-content", "versions", id] });
      toast.success("Content updated");
    },
    onError: () => {
      toast.error("Couldn't update this content. Please try again.");
    },
  });
}
