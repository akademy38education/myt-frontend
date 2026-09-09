import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RefundPaymentInput } from "@myt/shared";
import { adminPaymentsService } from "../services/adminPaymentsService";

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, input }: { paymentId: string; input: RefundPaymentInput }) => adminPaymentsService.refund(paymentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "payments"] }),
  });
}
