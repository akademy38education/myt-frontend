import { useQuery } from "@tanstack/react-query";
import { tutorAvailabilityService } from "../services/tutorAvailabilityService";

export function useTutorAvailability(tutorId: string) {
  return useQuery({
    queryKey: ["tutors", tutorId, "availability"],
    queryFn: () => tutorAvailabilityService.getSlots(tutorId),
    enabled: Boolean(tutorId),
  });
}
