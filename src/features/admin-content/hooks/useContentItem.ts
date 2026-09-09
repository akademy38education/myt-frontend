import { useQuery } from "@tanstack/react-query";
import { adminContentService } from "../services/adminContentService";

export function useContentItem(id: string | null) {
  return useQuery({
    queryKey: ["admin-content", "detail", id],
    queryFn: () => adminContentService.getOne(id as string),
    enabled: Boolean(id),
  });
}
