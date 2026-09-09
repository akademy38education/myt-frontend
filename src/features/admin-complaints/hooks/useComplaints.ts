import { useQuery } from "@tanstack/react-query";
import { adminComplaintsService } from "../services/adminComplaintsService";
import type { ComplaintFilter } from "../types";

export function useComplaints(filter: ComplaintFilter = {}) {
  return useQuery({
    queryKey: ["complaints", filter],
    queryFn: () => adminComplaintsService.list(filter),
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ["complaints", "detail", id],
    queryFn: () => adminComplaintsService.getOne(id),
    enabled: Boolean(id),
  });
}
