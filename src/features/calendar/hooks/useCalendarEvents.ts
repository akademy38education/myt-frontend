import { useQuery } from "@tanstack/react-query";
import { calendarService } from "../services/calendarService";

export function useCalendarEvents(studentId: string) {
  return useQuery({
    queryKey: ["calendar-events", studentId],
    queryFn: () => calendarService.listEvents(studentId),
    enabled: Boolean(studentId),
  });
}
