export { lessonSessionService } from "./services/lessonSessionService";
export type { JoinState } from "./services/lessonSessionService";
export { lessonChatService } from "./services/lessonChatService";
export { lessonNotesService } from "./services/lessonNotesService";
export { lessonResourcesService } from "./services/lessonResourcesService";
export { whiteboardService } from "./services/whiteboardService";
export { lessonSummaryService } from "./services/lessonSummaryService";
export type { RecommendedNextSteps } from "./services/lessonSummaryService";
export { createVideoProvider } from "./services/videoProvider";
export { getClassroomPermissions } from "./classroomPermissionService";
export type { ClassroomPermissions } from "./classroomPermissionService";

export { useLessonSession, useLessonParticipants, useStartLesson, useEndLesson, useUpdateLessonSummary } from "./hooks/useLessonSession";
export { useLessonRealtime } from "./hooks/useLessonRealtime";
export { useMediaControls } from "./hooks/useMediaControls";
export { useWhiteboard } from "./hooks/useWhiteboard";
export { useLessonChat, useSendLessonMessage } from "./hooks/useLessonChat";
export { useLessonNotes, useSaveLessonNote } from "./hooks/useLessonNotes";
export { useLessonResources, useAddLessonResource } from "./hooks/useLessonResources";

export { ClassroomShell } from "./components/ClassroomShell";

export type { JoinFlowStep, DeviceState, DeviceCheckResult, ConnectionQuality, LessonParticipant, LessonParticipants, LessonNotesResponse } from "./types";
