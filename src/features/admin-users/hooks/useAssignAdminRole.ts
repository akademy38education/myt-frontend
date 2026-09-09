import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminUsersService } from "../services/adminUsersService";
import type { AssignAdminRoleInput } from "../types";

export function useAssignAdminRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: AssignAdminRoleInput }) => adminUsersService.assignAdminRole(userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Admin role updated");
    },
    onError: () => {
      toast.error("We couldn't update this user's admin role. Please try again.");
    },
  });
}
