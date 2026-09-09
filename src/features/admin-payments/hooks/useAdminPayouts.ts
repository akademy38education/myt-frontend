import { useQuery } from "@tanstack/react-query";
import { adminPaymentsService } from "../services/adminPaymentsService";
import type { AdminPayoutFilter } from "../types";

export function useAdminPayouts(filter: AdminPayoutFilter = {}) {
  return useQuery({
    queryKey: ["admin", "payouts", filter],
    queryFn: () => adminPaymentsService.listPayouts(filter),
  });
}
