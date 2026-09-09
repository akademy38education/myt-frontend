import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AssignReportInput } from "@myt/shared";
import { adminComplaintsService } from "../services/adminComplaintsService";

export function useAssignComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssignReportInput }) => adminComplaintsService.assign(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaints"] }),
  });
}
