import { useQuery } from "@tanstack/react-query";
import { adminDirectoryService } from "../services/adminDirectoryService";

export function useAdminParents() {
  return useQuery({
    queryKey: ["admin", "parents"],
    queryFn: () => adminDirectoryService.getParents(),
  });
}
