import { useQuery } from "@tanstack/react-query";
import { adminDirectoryService } from "../services/adminDirectoryService";

export function useAdminTutors() {
  return useQuery({
    queryKey: ["admin", "tutors"],
    queryFn: () => adminDirectoryService.getTutors(),
  });
}
