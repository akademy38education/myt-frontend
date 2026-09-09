import type { LessonWhiteboardState, WhiteboardStroke } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

const mockWhiteboards = new Map<string, WhiteboardStroke[]>();

function emptyState(bookingId: string): LessonWhiteboardState {
  const now = new Date().toISOString();
  return { id: `whiteboard-${bookingId}`, bookingId, strokes: [], createdAt: now, updatedAt: now };
}

export const whiteboardService = {
  async get(bookingId: string): Promise<LessonWhiteboardState> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return { ...emptyState(bookingId), strokes: mockWhiteboards.get(bookingId) ?? [] };
    }
    return apiRequest<LessonWhiteboardState>(ENDPOINTS.lessons.whiteboard(bookingId));
  },

  /** Persists the FULL current stroke list — the canvas is the source of truth locally, this just snapshots it (debounced by the caller) so a refresh/late joiner can restore it. Live sync between two open sessions happens over the socket, not through this endpoint. */
  async save(bookingId: string, strokes: WhiteboardStroke[]): Promise<LessonWhiteboardState> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      mockWhiteboards.set(bookingId, strokes);
      return { ...emptyState(bookingId), strokes };
    }
    return apiRequest<LessonWhiteboardState>(ENDPOINTS.lessons.whiteboard(bookingId), { method: "PUT", body: { strokes } });
  },
};
