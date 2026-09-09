import { useQuery } from "@tanstack/react-query";
import { adminBookingsService } from "../services/adminBookingsService";
import type { AdminBookingFilter } from "../types";

export function useAdminBookings(filter: AdminBookingFilter = {}) {
  return useQuery({
    queryKey: ["admin", "bookings", filter],
    queryFn: () => adminBookingsService.list(filter),
  });
}
