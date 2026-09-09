import { useQuery } from "@tanstack/react-query";
import { adminContentService } from "../services/adminContentService";
import type { ContentItemFilter } from "../types";

export function useAdminContent(filter: ContentItemFilter = {}) {
  return useQuery({
    queryKey: ["admin-content", "list", filter],
    queryFn: () => adminContentService.list(filter),
  });
}
