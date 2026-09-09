import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useLearningProfile() {
  return useQuery({ queryKey: ["learning", "profile"], queryFn: () => learningService.getProfile() });
}
