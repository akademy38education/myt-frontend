import { useQuery } from "@tanstack/react-query";
import { tutorPerformanceService } from "../services/tutorPerformanceService";

export function useTutorPerformance(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-performance", tutorId],
    queryFn: () => tutorPerformanceService.get(tutorId),
    enabled: Boolean(tutorId),
  });
}
