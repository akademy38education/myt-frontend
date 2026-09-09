import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

/** Not fetched eagerly with the topic — only once the student opts into practice, so an unopened topic never pulls question content it won't use. */
export function usePracticeQuestions(topicId: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["learning", "practice-questions", topicId],
    queryFn: () => learningService.getPracticeQuestions(topicId),
    enabled: Boolean(topicId) && (options.enabled ?? true),
  });
}
