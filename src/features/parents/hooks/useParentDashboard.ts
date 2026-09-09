import { useQuery } from "@tanstack/react-query";
import { parentsService } from "../services/parentsService";

export function useParentDashboard(parentId: string) {
  return useQuery({
    queryKey: ["parents", parentId, "dashboard-summary"],
    queryFn: () => parentsService.getDashboardSummary(parentId),
    enabled: Boolean(parentId),
  });
}
