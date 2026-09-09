import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => adminService.getOverview(),
  });
}
