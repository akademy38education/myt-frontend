import { useQuery } from "@tanstack/react-query";
import { adminSupportService } from "../services/adminSupportService";

export function useSupportTicket(id: string | null) {
  return useQuery({
    queryKey: ["admin-support", "detail", id],
    queryFn: () => adminSupportService.getOne(id as string),
    enabled: Boolean(id),
  });
}
