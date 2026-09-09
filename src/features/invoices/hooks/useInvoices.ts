import { useQuery } from "@tanstack/react-query";
import { invoicesService } from "../services/invoicesService";

export function useMyInvoices() {
  return useQuery({
    queryKey: ["invoices", "mine"],
    queryFn: () => invoicesService.listMine(),
  });
}
