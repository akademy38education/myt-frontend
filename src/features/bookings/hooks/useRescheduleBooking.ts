import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RescheduleBookingInput } from "@myt/shared";
import { bookingsService } from "../services/bookingsService";

export function useRescheduleBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: string; input: RescheduleBookingInput }) => bookingsService.reschedule(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });
}
