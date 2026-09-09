import type { LessonMessage } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { randomUUID } from "@/utils/uuid";

/** Ephemeral, lesson-scoped chat — intentionally separate from `features/messaging`'s persistent DM inbox (see that feature's doc comments). Mock mode keeps messages only in memory for the tab's lifetime. */
const mockMessages = new Map<string, LessonMessage[]>();

export const lessonChatService = {
  async list(bookingId: string): Promise<LessonMessage[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return mockMessages.get(bookingId) ?? [];
    }
    return apiRequest<LessonMessage[]>(ENDPOINTS.lessons.messages(bookingId));
  },

  async send(bookingId: string, senderRole: LessonMessage["senderRole"], body: string): Promise<LessonMessage> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      const now = new Date().toISOString();
      const message: LessonMessage = { id: randomUUID(), bookingId, senderRole, body, createdAt: now, updatedAt: now };
      mockMessages.set(bookingId, [...(mockMessages.get(bookingId) ?? []), message]);
      return message;
    }
    return apiRequest<LessonMessage>(ENDPOINTS.lessons.messages(bookingId), { method: "POST", body: { body } });
  },
};
