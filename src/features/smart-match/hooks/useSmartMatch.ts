import { useMutation } from "@tanstack/react-query";
import { smartMatchService } from "../services/smartMatchService";
import type { SmartMatchAnswers } from "../types";

export function useSmartMatchRecommendations() {
  return useMutation({
    mutationFn: (answers: SmartMatchAnswers) => smartMatchService.getRecommendations(answers),
  });
}
