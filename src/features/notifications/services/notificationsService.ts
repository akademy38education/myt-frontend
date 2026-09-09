import type { Notification, NotificationType } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { delay } from "@/utils/delay";
import { useNotificationsStore } from "../store";

export const notificationsService = {
  async list(): Promise<Notification[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      const userId = useAuthStore.getState().user?.id;
      return useNotificationsStore
        .getState()
        .notifications.filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return apiRequest<Notification[]>(ENDPOINTS.notifications.list);
  },

  async unreadCount(): Promise<number> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      const userId = useAuthStore.getState().user?.id;
      return useNotificationsStore.getState().notifications.filter((n) => n.userId === userId && !n.readAt).length;
    }
    const { count } = await apiRequest<{ count: number }>(ENDPOINTS.notifications.unreadCount);
    return count;
  },

  async markRead(id: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      useNotificationsStore.getState().markRead(id);
      return;
    }
    await apiRequest<void>(ENDPOINTS.notifications.markRead(id), { method: "POST" });
  },

  async markAllRead(): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const userId = useAuthStore.getState().user?.id;
      if (userId) useNotificationsStore.getState().markAllRead(userId);
      return;
    }
    await apiRequest<{ count: number }>(ENDPOINTS.notifications.markAllRead, { method: "POST" });
  },

  /** Mock-mode only — the real backend persists and pushes notifications itself (see useNotificationRealtimeSync), so this has no real-API counterpart. */
  notify(userId: string, notification: { type: NotificationType; title: string; body: string; link?: string }): void {
    useNotificationsStore.getState().notify(userId, notification);
  },
};
