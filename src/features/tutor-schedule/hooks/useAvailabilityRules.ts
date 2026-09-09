import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AvailabilityRange } from "@/components/shared/AvailabilityEditor";
import { tutorScheduleService } from "../services/tutorScheduleService";

export function useAvailabilityRules(tutorId: string) {
  return useQuery({
    queryKey: ["tutors", tutorId, "availability-rules"],
    queryFn: () => tutorScheduleService.getRules(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useSaveAvailabilityRules(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rules: AvailabilityRange[]) => tutorScheduleService.saveRules(tutorId, rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability-rules"] });
      queryClient.invalidateQueries({ queryKey: ["tutors", tutorId, "availability"] });
    },
  });
}
