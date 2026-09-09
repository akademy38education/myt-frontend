import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SupportTicketMessageInput } from "@myt/shared";
import { adminSupportService } from "../services/adminSupportService";

export function useSendSupportMessage(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SupportTicketMessageInput) => adminSupportService.sendMessage(ticketId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support", "detail", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["admin-support", "list"] });
      toast.success("Reply sent");
    },
    onError: () => {
      toast.error("Couldn't send the reply. Please try again.");
    },
  });
}
