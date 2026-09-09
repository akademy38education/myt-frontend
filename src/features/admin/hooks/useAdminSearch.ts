import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useAdminSearch(q: string) {
  return useQuery({
    queryKey: ["admin", "search", q],
    queryFn: () => adminService.search(q),
    enabled: q.trim().length > 1,
  });
}
