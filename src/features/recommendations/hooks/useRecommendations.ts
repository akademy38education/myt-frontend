import { useQuery } from "@tanstack/react-query";
import { recommendationsService } from "../services/recommendationsService";

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: () => recommendationsService.list(),
  });
}
