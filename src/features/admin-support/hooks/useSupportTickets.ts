import { useQuery } from "@tanstack/react-query";
import { adminSupportService } from "../services/adminSupportService";
import type { SupportTicketFilter } from "../types";

export function useSupportTickets(filter: SupportTicketFilter = {}) {
  return useQuery({
    queryKey: ["admin-support", "list", filter],
    queryFn: () => adminSupportService.list(filter),
  });
}
