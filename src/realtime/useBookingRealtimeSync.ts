import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType, UserRole, type Booking } from "@myt/shared";
import { useAuth } from "@/hooks/useAuth";
import { notificationsService } from "@/features/notifications";
import { env } from "@/config/env";
import { connectSocket, disconnectSocket } from "./socketClient";

const EVENT_COPY: Record<string, { title: string; body: (b: Booking) => string }> = {
  "booking.created": { title: "Lesson booked", body: (b) => `Your lesson is booked for ${new Date(b.scheduledStart).toLocaleString()}.` },
  "booking.rescheduled": { title: "Lesson rescheduled", body: (b) => `Your lesson has moved to ${new Date(b.scheduledStart).toLocaleString()}.` },
  "booking.cancelled": { title: "Lesson cancelled", body: () => "A lesson has been cancelled." },
};

function bookingsPathFor(role: UserRole | undefined): string {
  if (role === UserRole.TUTOR) return "/tutor/bookings";
  if (role === UserRole.PARENT) return "/parent/bookings";
  return "/student/bookings";
}

/**
 * Keeps the app in sync with booking changes made elsewhere (another tab,
 * the other party to the lesson, a concurrent reschedule) without a manual
 * refresh — connects once per session to the existing socket foundation
 * (`backend/src/services/socket.service.ts`), and on any `booking.*` event:
 * invalidates the relevant queries so lists/calendars refetch, and drops a
 * notification into the existing bell (see `features/notifications`).
 * Mount this once near the app root (see `AppProviders`) — it is a no-op
 * until a user is authenticated.
 */
export function useBookingRealtimeSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(user.id);
    const events = ["booking.created", "booking.rescheduled", "booking.cancelled"] as const;

    const handlers = events.map((event) => {
      const handler = (payload: { booking: Booking }) => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["lessons"] });
        queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
        // Real mode: the backend persists the notification itself and pushes it
        // via the `notification.created` socket event (see
        // useNotificationRealtimeSync), so adding one here too would double it up.
        if (env.VITE_USE_MOCK_API) {
          const copy = EVENT_COPY[event] ?? { title: "Booking updated", body: () => "A booking was updated." };
          notificationsService.notify(user.id, {
            type: NotificationType.BOOKING,
            title: copy.title,
            body: copy.body(payload.booking),
            link: bookingsPathFor(user.role),
          });
        }
      };
      socket.on(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => socket.off(event, handler));
    };
  }, [user, queryClient]);
}
