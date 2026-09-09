import type { LessonNote, LessonParticipantRole } from "@myt/shared";

export interface LessonParticipant {
  role: LessonParticipantRole;
  id: string;
  userId: string;
  name: string;
}

export interface LessonParticipants {
  student: LessonParticipant;
  tutor: LessonParticipant;
}

export interface LessonNotesResponse {
  shared: LessonNote | null;
  own: LessonNote | null;
}

/** The step within the "join a lesson" flow — see spec §2. Device check and waiting room are transient UI states inside the classroom page, not separate routes, since neither has meaning outside the context of joining this specific lesson. */
export type JoinFlowStep = "device-check" | "waiting-room" | "live" | "ended";

export type DeviceState = "checking" | "granted" | "denied" | "missing" | "unsupported";

export interface DeviceCheckResult {
  camera: DeviceState;
  microphone: DeviceState;
  speaker: DeviceState;
  connection: "good" | "unstable" | "offline" | "checking";
}

export type ConnectionQuality = "excellent" | "good" | "unstable" | "disconnected" | "reconnecting";
