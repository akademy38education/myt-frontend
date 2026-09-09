import { useQuery } from "@tanstack/react-query";
import { adminPaymentsService } from "../services/adminPaymentsService";
import type { AdminPaymentFilter } from "../types";

export function useAdminPayments(filter: AdminPaymentFilter = {}) {
  return useQuery({
    queryKey: ["admin", "payments", filter],
    queryFn: () => adminPaymentsService.list(filter),
  });
}
