import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useStudyPlan() {
  return useQuery({ queryKey: ["learning", "study-plan"], queryFn: () => learningService.getStudyPlan() });
}
