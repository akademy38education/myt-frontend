import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tutorScheduleService, type AvailabilityBlockDraft } from "../services/tutorScheduleService";

export function useAvailabilityBlocks(tutorId: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ["tutors", tutorId, "availability-blocks", from, to],
    queryFn: () => tutorScheduleService.getBlocks(tutorId, from, to),
    enabled: Boolean(tutorId),
  });
}

export function useCreateAvailabilityBlock(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: AvailabilityBlockDraft) => tutorScheduleService.createBlock(tutorId, draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability-blocks"] });
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability"] });
    },
  });
}

export function useDeleteAvailabilityBlock(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blockId: string) => tutorScheduleService.deleteBlock(tutorId, blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability-blocks"] });
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability"] });
    },
  });
}
