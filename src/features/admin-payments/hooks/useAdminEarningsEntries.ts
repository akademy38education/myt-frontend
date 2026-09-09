import { useQuery } from "@tanstack/react-query";
import { adminPaymentsService } from "../services/adminPaymentsService";
import type { AdminEarningsEntryFilter } from "../types";

export function useAdminEarningsEntries(filter: AdminEarningsEntryFilter = {}) {
  return useQuery({
    queryKey: ["admin", "earnings-entries", filter],
    queryFn: () => adminPaymentsService.listEarningsEntries(filter),
  });
}
