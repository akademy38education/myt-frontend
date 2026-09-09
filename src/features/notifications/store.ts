import { create } from "zustand";
import { persist } from "zustand/middleware";
import { randomUUID } from "@/utils/uuid";
import type { Notification, NotificationType } from "@myt/shared";
import { mockNotifications } from "@/mocks";

interface NotificationsState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  /** Pushes a new notification in immediately — used by booking create/reschedule/cancel flows (and, when a real-time event arrives over the socket, by the listener that relays it here) so the bell reflects what just happened without a page reload. */
  notify: (userId: string, notification: { type: NotificationType; title: string; body: string; link?: string }) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: mockNotifications,
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n)),
        })),
      markAllRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.userId === userId && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n)),
        })),
      notify: (userId, notification) =>
        set((state) => ({
          notifications: [
            { id: randomUUID(), userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...notification },
            ...state.notifications,
          ],
        })),
    }),
    { name: "myt-notifications" }
  )
);
