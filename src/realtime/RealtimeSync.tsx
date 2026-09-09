import { useBookingRealtimeSync } from "./useBookingRealtimeSync";
import { useNotificationRealtimeSync } from "./useNotificationRealtimeSync";

/** Renders nothing — just keeps the realtime sync hooks mounted for the lifetime of the app. See each hook for what it actually does. */
export function RealtimeSync() {
  useBookingRealtimeSync();
  useNotificationRealtimeSync();
  return null;
}
