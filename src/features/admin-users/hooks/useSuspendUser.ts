import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUsersService } from "../services/adminUsersService";
import type { SuspendUserInput } from "../types";

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: SuspendUserInput }) => adminUsersService.suspend(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User suspended");
    },
    onError: () => {
      toast.error("We couldn't suspend this user. Please try again.");
    },
  });
}
