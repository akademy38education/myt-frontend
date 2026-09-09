import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckoutInput } from "@myt/shared";
import { bookingsService } from "../services/bookingsService";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: string; input: CheckoutInput }) => bookingsService.checkout(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
