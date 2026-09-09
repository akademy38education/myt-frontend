import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LessonMessage, LessonResource, WhiteboardStroke } from "@myt/shared";
import { useAuth } from "@/hooks/useAuth";
import { connectSocket } from "@/realtime/socketClient";

export interface RemoteMediaState {
  cameraOn: boolean;
  micOn: boolean;
}

/**
 * The classroom's one connection to the real-time layer (see
 * `backend/src/services/socket.service.ts`'s `lesson:<bookingId>` rooms).
 * Reuses the SAME socket `RealtimeSync`/`useBookingRealtimeSync` already
 * opened for the session (never a second connection) — just joins this
 * lesson's room for the lifetime of the classroom page and leaves on
 * unmount, exactly mirroring how `useBookingRealtimeSync` itself attaches
 * booking-event listeners to that shared socket.
 *
 * Durable events the backend already re-broadcasts on write
 * (`lesson:started`, `lesson:ended`, `lesson:message`,
 * `lesson:resource-shared`) just trigger a query invalidation here — the
 * REST response is still the source of truth, this only avoids polling.
 * Truly ephemeral state (the other person's live camera/mic toggle, a
 * whiteboard stroke while it's still being drawn) is relayed peer-to-peer
 * through `lesson:relay` and never persisted mid-stroke.
 */
export function useLessonRealtime(bookingId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [remoteMediaState, setRemoteMediaState] = useState<RemoteMediaState | null>(null);
  const [remoteStroke, setRemoteStroke] = useState<WhiteboardStroke | null>(null);
  const [participantOnline, setParticipantOnline] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const socketRef = useRef<ReturnType<typeof connectSocket>>();

  useEffect(() => {
    if (!user || !bookingId) return;
    const socket = connectSocket(user.id);
    socketRef.current = socket;
    socket.emit("lesson:join", bookingId);

    const onJoined = () => setParticipantOnline(true);
    const onLeft = () => setParticipantOnline(false);
    // The backend's "lesson:relay" handler re-emits under the event's OWN
    // name (it's a pure relay, not a wrapper) — see socket.service.ts.
    const onMediaState = (state: RemoteMediaState) => setRemoteMediaState(state);
    const onStroke = (stroke: WhiteboardStroke) => setRemoteStroke(stroke);
    const onProgress = (stage: number) => setProgressStage(stage);
    const invalidateSession = () => queryClient.invalidateQueries({ queryKey: ["lesson-session", bookingId] });
    // The server broadcasts to the whole room (including the sender's own
    // socket), and the sender's mutation already appends its own message/
    // resource optimistically on success — so these must dedupe by id
    // rather than always appending, or the sender ends up with the same
    // entry twice.
    const invalidateMessages = (message: LessonMessage) => {
      queryClient.setQueryData<LessonMessage[]>(["lesson-messages", bookingId], (current) => {
        if (!current) return [message];
        return current.some((m) => m.id === message.id) ? current : [...current, message];
      });
    };
    const invalidateResources = (resource: LessonResource) => {
      queryClient.setQueryData<LessonResource[]>(["lesson-resources", bookingId], (current) => {
        if (!current) return [resource];
        return current.some((r) => r.id === resource.id) ? current : [...current, resource];
      });
    };

    socket.on("lesson:participant-joined", onJoined);
    socket.on("lesson:participant-left", onLeft);
    socket.on("media-state", onMediaState);
    socket.on("whiteboard-stroke", onStroke);
    socket.on("lesson-progress", onProgress);
    socket.on("lesson:started", invalidateSession);
    socket.on("lesson:ended", invalidateSession);
    socket.on("lesson:message", invalidateMessages);
    socket.on("lesson:resource-shared", invalidateResources);

    return () => {
      socket.emit("lesson:leave", bookingId);
      socket.off("lesson:participant-joined", onJoined);
      socket.off("lesson:participant-left", onLeft);
      socket.off("media-state", onMediaState);
      socket.off("whiteboard-stroke", onStroke);
      socket.off("lesson-progress", onProgress);
      socket.off("lesson:started", invalidateSession);
      socket.off("lesson:ended", invalidateSession);
      socket.off("lesson:message", invalidateMessages);
      socket.off("lesson:resource-shared", invalidateResources);
    };
  }, [user, bookingId, queryClient]);

  function broadcastMediaState(state: RemoteMediaState) {
    socketRef.current?.emit("lesson:relay", { bookingId, event: "media-state", payload: state });
  }

  function broadcastStroke(stroke: WhiteboardStroke) {
    socketRef.current?.emit("lesson:relay", { bookingId, event: "whiteboard-stroke", payload: stroke });
  }

  function broadcastProgress(stage: number) {
    setProgressStage(stage);
    socketRef.current?.emit("lesson:relay", { bookingId, event: "lesson-progress", payload: stage });
  }

  return { remoteMediaState, remoteStroke, participantOnline, progressStage, broadcastMediaState, broadcastStroke, broadcastProgress };
}
