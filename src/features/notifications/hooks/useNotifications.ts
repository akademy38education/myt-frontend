import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../services/notificationsService";

const NOTIFICATIONS_KEY = ["notifications"];
const UNREAD_COUNT_KEY = ["notifications", "unread-count"];

export function useNotifications() {
  return useQuery({ queryKey: NOTIFICATIONS_KEY, queryFn: () => notificationsService.list() });
}

export function useUnreadNotificationCount() {
  return useQuery({ queryKey: UNREAD_COUNT_KEY, queryFn: () => notificationsService.unreadCount() });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}
