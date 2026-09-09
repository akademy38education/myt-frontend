import { useQuery } from "@tanstack/react-query";
import { masteryService } from "../services/masteryService";

export function useSubjectMastery(studentId: string) {
  return useQuery({
    queryKey: ["mastery", studentId],
    queryFn: () => masteryService.getSubjectSummaries(studentId),
    enabled: Boolean(studentId),
  });
}
