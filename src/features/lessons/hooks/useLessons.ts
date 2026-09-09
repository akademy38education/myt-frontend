import { useQuery } from "@tanstack/react-query";
import { lessonsService } from "../services/lessonsService";

export function useLessons(studentId: string) {
  return useQuery({
    queryKey: ["lessons", studentId],
    queryFn: () => lessonsService.list(studentId),
    enabled: Boolean(studentId),
  });
}

export function useLessonDetail(studentId: string, bookingId: string) {
  return useQuery({
    queryKey: ["lessons", studentId, bookingId],
    queryFn: () => lessonsService.getById(studentId, bookingId),
    enabled: Boolean(studentId) && Boolean(bookingId),
  });
}
