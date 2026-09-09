import { useQuery } from "@tanstack/react-query";
import { reportsService } from "../services/reportsService";
import type { ReportFilter } from "../types";

export function useReports(filter: ReportFilter) {
  return useQuery({
    queryKey: ["reports", filter],
    queryFn: () => reportsService.list(filter),
    enabled: Boolean(filter.childId),
  });
}

export function useReportDetail(bookingId: string) {
  return useQuery({
    queryKey: ["reports", "detail", bookingId],
    queryFn: () => reportsService.getOne(bookingId),
    enabled: Boolean(bookingId),
  });
}
