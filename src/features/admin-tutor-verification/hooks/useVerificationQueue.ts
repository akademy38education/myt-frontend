import { useQuery } from "@tanstack/react-query";
import { adminTutorVerificationService } from "../services/adminTutorVerificationService";
import type { VerificationQueueFilter } from "../types";

export function useVerificationQueue(filter: VerificationQueueFilter = {}) {
  return useQuery({
    queryKey: ["admin", "tutor-verification", "queue", filter],
    queryFn: () => adminTutorVerificationService.getQueue(filter),
  });
}
