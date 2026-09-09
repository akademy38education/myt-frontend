import type { LessonParticipantRole } from "@myt/shared";

export interface ClassroomPermissions {
  canShareScreen: boolean;
  canEditWhiteboard: boolean;
  canUploadResource: boolean;
  canEndLesson: boolean;
  canStartLesson: boolean;
  canEditSharedNotes: boolean;
  canViewTutorNotes: boolean;
  canViewStudentNotes: boolean;
}

/**
 * The single source of truth for "what can this person do in the
 * classroom" — every control (`ClassroomControls`, `LessonNotesPanel`,
 * `LessonResourcesPanel`, `EndLessonDialog`) reads from here rather than
 * re-deriving role checks inline, per Phase 7 spec §46 ("never duplicate
 * permission logic across components"). The backend re-enforces the
 * server-side-relevant ones independently (start/end lesson, shared notes,
 * private-note visibility) — this is for UI affordance only, never the
 * actual security boundary.
 */
export function getClassroomPermissions(role: LessonParticipantRole): ClassroomPermissions {
  const isTutor = role === "tutor";
  return {
    canShareScreen: true,
    canEditWhiteboard: true,
    canUploadResource: isTutor,
    canEndLesson: isTutor,
    canStartLesson: isTutor,
    canEditSharedNotes: isTutor,
    canViewTutorNotes: isTutor,
    canViewStudentNotes: !isTutor,
  };
}
