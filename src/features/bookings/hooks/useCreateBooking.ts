import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBookingInput } from "@myt/shared";
import { bookingsService } from "../services/bookingsService";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, input }: { studentId: string; input: CreateBookingInput }) => bookingsService.create(studentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
