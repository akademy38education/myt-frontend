import { useQuery } from "@tanstack/react-query";
import { achievementsService } from "../services/achievementsService";

export function useAchievements(studentId: string) {
  return useQuery({
    queryKey: ["achievements", studentId],
    queryFn: () => achievementsService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
