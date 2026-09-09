import type { LessonNote, LessonParticipantRole } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { randomUUID } from "@/utils/uuid";
import type { LessonNotesResponse } from "../types";

const mockNotes = new Map<string, LessonNote[]>();

function upsertMock(bookingId: string, authorRole: LessonParticipantRole, visibility: "private" | "shared", body: string): LessonNote {
  const existing = mockNotes.get(bookingId) ?? [];
  const match = existing.find((n) => n.authorRole === authorRole && n.visibility === visibility);
  const now = new Date().toISOString();
  const note: LessonNote = match ? { ...match, body, updatedAt: now } : { id: randomUUID(), bookingId, authorRole, visibility, body, createdAt: now, updatedAt: now };
  mockNotes.set(bookingId, [...existing.filter((n) => n !== match), note]);
  return note;
}

export const lessonNotesService = {
  async get(bookingId: string, role: LessonParticipantRole): Promise<LessonNotesResponse> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      const all = mockNotes.get(bookingId) ?? [];
      return {
        shared: all.find((n) => n.visibility === "shared" && n.authorRole === "tutor") ?? null,
        own: all.find((n) => n.visibility === "private" && n.authorRole === role) ?? null,
      };
    }
    return apiRequest<LessonNotesResponse>(ENDPOINTS.lessons.notes(bookingId));
  },

  async save(bookingId: string, role: LessonParticipantRole, visibility: "private" | "shared", body: string): Promise<LessonNote> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return upsertMock(bookingId, role, visibility, body);
    }
    return apiRequest<LessonNote>(ENDPOINTS.lessons.notes(bookingId), { method: "PATCH", body: { visibility, body } });
  },
};
