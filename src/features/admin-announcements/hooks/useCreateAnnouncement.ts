import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAnnouncementsService } from "../services/adminAnnouncementsService";
import type { CreateAnnouncementInput } from "../types";

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) => adminAnnouncementsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-announcements"] });
    },
  });
}
