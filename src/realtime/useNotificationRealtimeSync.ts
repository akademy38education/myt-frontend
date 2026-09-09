import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@myt/shared";
import { useAuth } from "@/hooks/useAuth";
import { connectSocket, disconnectSocket } from "./socketClient";

/**
 * Keeps the notification bell in sync with notifications the backend creates
 * on its own (booking changes, lesson completion, reports, reviews, tutor
 * verification, suspensions, refunds — see
 * `backend/src/services/socket.service.ts`) — connects once per session to
 * the existing socket foundation, and on `notification.created`, invalidates
 * the notifications list and unread-count queries so the bell refetches.
 * Invalidation (rather than optimistically prepending the pushed
 * `Notification`) is simpler and avoids the list and the count ever
 * disagreeing with the server. Mount this once near the app root (see
 * `RealtimeSync`) — it is a no-op until a user is authenticated.
 */
export function useNotificationRealtimeSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(user.id);
    const handler = (_notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };
    socket.on("notification.created", handler);

    return () => {
      socket.off("notification.created", handler);
    };
  }, [user, queryClient]);
}
