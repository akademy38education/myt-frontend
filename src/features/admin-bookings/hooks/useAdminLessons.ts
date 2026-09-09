import { useQuery } from "@tanstack/react-query";
import { adminBookingsService } from "../services/adminBookingsService";

export function useAdminLessons() {
  return useQuery({
    queryKey: ["admin", "lessons"],
    queryFn: () => adminBookingsService.listLessons(),
  });
}
