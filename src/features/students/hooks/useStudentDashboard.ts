import { useQuery } from "@tanstack/react-query";
import { studentsService } from "../services/studentsService";

export function useStudentDashboard(studentId: string) {
  return useQuery({
    queryKey: ["students", studentId, "dashboard-summary"],
    queryFn: () => studentsService.getDashboardSummary(studentId),
    enabled: Boolean(studentId),
  });
}
