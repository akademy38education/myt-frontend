import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUsersService } from "../services/adminUsersService";
import type { ReactivateUserInput } from "../types";

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input?: ReactivateUserInput }) => adminUsersService.reactivate(userId, input ?? {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User reactivated");
    },
    onError: () => {
      toast.error("We couldn't reactivate this user. Please try again.");
    },
  });
}
