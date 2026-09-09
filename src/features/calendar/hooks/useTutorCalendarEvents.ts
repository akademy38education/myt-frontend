import { useQuery } from "@tanstack/react-query";
import { calendarService } from "../services/calendarService";

export function useTutorCalendarEvents(tutorId: string) {
  return useQuery({
    queryKey: ["calendar-events", "tutor", tutorId],
    queryFn: () => calendarService.listTutorEvents(tutorId),
    enabled: Boolean(tutorId),
  });
}
