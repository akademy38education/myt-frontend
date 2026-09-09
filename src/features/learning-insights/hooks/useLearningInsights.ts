import { useQuery } from "@tanstack/react-query";
import { insightsService } from "../services/insightsService";

export function useLearningInsights(studentId?: string) {
  return useQuery({
    queryKey: ["learning-insights", studentId ?? "me"],
    queryFn: () => insightsService.list(studentId),
  });
}
