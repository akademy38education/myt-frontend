import type { LessonResource, LessonResourceInput, LessonParticipantRole } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { randomUUID } from "@/utils/uuid";

const mockResources = new Map<string, LessonResource[]>();

export const lessonResourcesService = {
  async list(bookingId: string): Promise<LessonResource[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      return mockResources.get(bookingId) ?? [];
    }
    return apiRequest<LessonResource[]>(ENDPOINTS.lessons.resources(bookingId));
  },

  async add(bookingId: string, uploadedByRole: LessonParticipantRole, input: LessonResourceInput): Promise<LessonResource> {
    if (env.VITE_USE_MOCK_API) {
      await delay(400);
      const now = new Date().toISOString();
      const resource: LessonResource = { id: randomUUID(), bookingId, uploadedByRole, createdAt: now, updatedAt: now, ...input };
      mockResources.set(bookingId, [...(mockResources.get(bookingId) ?? []), resource]);
      return resource;
    }
    return apiRequest<LessonResource>(ENDPOINTS.lessons.resources(bookingId), { method: "POST", body: input });
  },
};
