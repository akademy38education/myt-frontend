import { io, type Socket } from "socket.io-client";
import { env } from "@/config/env";

let socket: Socket | undefined;

/**
 * A `.on`/`.off`/`.disconnect` stand-in used only in demo mode (see below)
 * — satisfies every call site's usage of the real `Socket` without ever
 * opening a connection. There is no realtime backend to connect to in
 * `VITE_USE_MOCK_API` mode, so the honest behavior is "do nothing", not a
 * failed connection attempt spamming the console every few seconds.
 */
const noopSocket = { on: () => noopSocket, off: () => noopSocket, disconnect: () => undefined } as unknown as Socket;

/**
 * One shared socket connection per logged-in session, authenticated by
 * user id (see `backend/src/services/socket.service.ts`, which joins the
 * connecting socket to a `user:<id>` room). Real-time booking events are
 * the only thing wired to it today (see `useBookingRealtimeSync`) — this
 * client itself is generic and any future feature can add its own
 * `socket.on(...)` listener against the same connection.
 *
 * In demo mode (`VITE_USE_MOCK_API=true`, no real backend to reach) this
 * returns `noopSocket` instead of actually connecting — the frontend-only
 * demo already gets its realtime-equivalent behavior directly from each
 * mock service (e.g. `notificationsService.notify` on booking mutations),
 * so a real socket was never needed there, just never actually skipped.
 */
export function connectSocket(userId: string): Socket {
  if (env.VITE_USE_MOCK_API) return noopSocket;
  if (socket?.connected && socket.auth && (socket.auth as { userId?: string }).userId === userId) return socket;
  socket?.disconnect();
  socket = io(env.VITE_WS_URL, { auth: { userId }, transports: ["websocket"] });
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = undefined;
}
