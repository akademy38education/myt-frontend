import { useQuery } from "@tanstack/react-query";
import { tutorEarningsService } from "../services/tutorEarningsService";
import type { EarningsFilter } from "../types";

export function useEarningsSummary(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-earnings", tutorId, "summary"],
    queryFn: () => tutorEarningsService.getSummary(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useEarningsList(tutorId: string, filter: EarningsFilter = {}) {
  return useQuery({
    queryKey: ["tutor-earnings", tutorId, "list", filter],
    queryFn: () => tutorEarningsService.list(tutorId, filter),
    enabled: Boolean(tutorId),
  });
}

export function useEarningsPayouts(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-earnings", tutorId, "payouts"],
    queryFn: () => tutorEarningsService.getPayouts(tutorId),
    enabled: Boolean(tutorId),
  });
}
