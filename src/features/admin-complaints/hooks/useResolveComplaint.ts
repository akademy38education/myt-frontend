import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResolveReportInput } from "@myt/shared";
import { adminComplaintsService } from "../services/adminComplaintsService";

export function useResolveComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ResolveReportInput }) => adminComplaintsService.resolve(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaints"] }),
  });
}
