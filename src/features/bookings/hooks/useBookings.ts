import { useQuery } from "@tanstack/react-query";
import { bookingsService, type BookingFilter } from "../services/bookingsService";

export function useBookings(filter: BookingFilter) {
  return useQuery({
    queryKey: ["bookings", filter],
    queryFn: () => bookingsService.list(filter),
    // Every caller scopes this to their own studentId or tutorId (never a
    // bare, unfiltered list — the backend now rejects that, see
    // bookings.controller.ts's assertCanListParty) — so wait for whichever
    // id the caller is resolving asynchronously (e.g. useCurrentTutorProfile)
    // to actually arrive, rather than firing once with an empty string.
    enabled: Boolean(filter.studentId || filter.tutorId),
  });
}
