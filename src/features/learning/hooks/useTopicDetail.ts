import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useTopicDetail(topicId: string) {
  return useQuery({
    queryKey: ["learning", "topic", topicId],
    queryFn: () => learningService.getTopicDetail(topicId),
    enabled: Boolean(topicId),
  });
}
