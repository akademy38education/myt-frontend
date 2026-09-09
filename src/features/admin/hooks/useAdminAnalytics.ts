import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => adminService.getAnalytics(),
  });
}
