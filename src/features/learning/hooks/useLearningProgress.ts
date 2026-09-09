import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useLearningProgress() {
  return useQuery({ queryKey: ["learning", "progress"], queryFn: () => learningService.getProgress() });
}
