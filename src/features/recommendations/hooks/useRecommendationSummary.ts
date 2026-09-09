import { useQuery } from "@tanstack/react-query";
import { recommendationsService } from "../services/recommendationsService";

export function useRecommendationSummary() {
  return useQuery({
    queryKey: ["recommendations", "summary"],
    queryFn: () => recommendationsService.getSummary(),
  });
}
