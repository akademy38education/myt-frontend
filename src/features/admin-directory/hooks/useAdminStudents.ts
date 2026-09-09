import { useQuery } from "@tanstack/react-query";
import { adminDirectoryService } from "../services/adminDirectoryService";

export function useAdminStudents() {
  return useQuery({
    queryKey: ["admin", "students"],
    queryFn: () => adminDirectoryService.getStudents(),
  });
}
