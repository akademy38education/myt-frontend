import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdateSupportTicketInput } from "@myt/shared";
import { adminSupportService } from "../services/adminSupportService";

export function useUpdateSupportTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSupportTicketInput) => adminSupportService.update(ticketId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-support", "detail", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["admin-support", "list"] });
      toast.success("Ticket updated");
    },
    onError: () => {
      toast.error("Couldn't update this ticket. Please try again.");
    },
  });
}
