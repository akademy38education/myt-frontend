import { useQuery } from "@tanstack/react-query";
import { bookingsService } from "../services/bookingsService";

export function useBookingDetail(bookingId: string) {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => bookingsService.getById(bookingId),
    enabled: Boolean(bookingId),
  });
}
