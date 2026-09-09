import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useFinancialReconciliation() {
  return useQuery({
    queryKey: ["admin", "finance", "reconciliation"],
    queryFn: () => adminService.getFinancialReconciliation(),
  });
}
