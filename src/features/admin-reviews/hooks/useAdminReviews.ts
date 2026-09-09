import { useQuery } from "@tanstack/react-query";
import { adminReviewsService } from "../services/adminReviewsService";
import type { AdminReviewFilter } from "../types";

export function useAdminReviews(filter: AdminReviewFilter = {}) {
  return useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: () => adminReviewsService.list(filter),
  });
}
