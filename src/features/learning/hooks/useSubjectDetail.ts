import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useSubjectDetail(subjectId: string) {
  return useQuery({
    queryKey: ["learning", "subject", subjectId],
    queryFn: () => learningService.getSubjectDetail(subjectId),
    enabled: Boolean(subjectId),
  });
}
