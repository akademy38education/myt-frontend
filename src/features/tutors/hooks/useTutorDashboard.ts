import { useQuery } from "@tanstack/react-query";
import { tutorsService } from "../services/tutorsService";

export function useTutorDashboard(tutorId: string) {
  return useQuery({
    queryKey: ["tutors", tutorId, "dashboard-summary"],
    queryFn: () => tutorsService.getDashboardSummary(tutorId),
    enabled: Boolean(tutorId),
  });
}
