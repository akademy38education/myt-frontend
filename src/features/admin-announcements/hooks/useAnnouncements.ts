import { useQuery } from "@tanstack/react-query";
import { adminAnnouncementsService } from "../services/adminAnnouncementsService";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["admin-announcements"],
    queryFn: () => adminAnnouncementsService.list(),
  });
}
