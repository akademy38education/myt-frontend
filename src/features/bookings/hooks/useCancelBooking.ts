import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CancelBookingInput } from "@myt/shared";
import { bookingsService } from "../services/bookingsService";

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: string; input?: CancelBookingInput }) => bookingsService.cancel(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
