import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateReportInput } from "@myt/shared";
import { adminComplaintsService } from "../services/adminComplaintsService";

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReportInput) => adminComplaintsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaints"] }),
  });
}
