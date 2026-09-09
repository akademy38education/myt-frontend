import { useQuery } from "@tanstack/react-query";
import { parentsService } from "../services/parentsService";

export function useChildren(parentId: string) {
  return useQuery({
    queryKey: ["parents", parentId, "children"],
    queryFn: () => parentsService.getChildren(parentId),
    enabled: Boolean(parentId),
  });
}
