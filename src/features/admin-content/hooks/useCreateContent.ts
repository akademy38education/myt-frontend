import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContentItemInput } from "@myt/shared";
import { adminContentService } from "../services/adminContentService";

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContentItemInput) => adminContentService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content", "list"] });
      toast.success("Content created as a draft");
    },
    onError: () => {
      toast.error("Couldn't create this content. Please try again.");
    },
  });
}
