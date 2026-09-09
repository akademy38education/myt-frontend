import { useQuery } from "@tanstack/react-query";
import { adminContentService } from "../services/adminContentService";

export function useContentVersions(id: string | null) {
  return useQuery({
    queryKey: ["admin-content", "versions", id],
    queryFn: () => adminContentService.versions(id as string),
    enabled: Boolean(id),
  });
}
