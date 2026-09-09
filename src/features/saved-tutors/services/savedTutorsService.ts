import type { TutorProfile } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors } from "@/mocks";
import { useSavedTutorsStore } from "../store";

export const savedTutorsService = {
  async list(): Promise<TutorProfile[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const { tutorIds } = useSavedTutorsStore.getState();
      return mockTutors.filter((t) => tutorIds.includes(t.id));
    }
    return apiRequest<TutorProfile[]>(ENDPOINTS.tutors.saved);
  },

  async save(tutorId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      useSavedTutorsStore.getState().add(tutorId);
      return;
    }
    await apiRequest(ENDPOINTS.tutors.save(tutorId), { method: "POST" });
  },

  async unsave(tutorId: string): Promise<void> {
    if (env.VITE_USE_MOCK_API) {
      await delay(150);
      useSavedTutorsStore.getState().remove(tutorId);
      return;
    }
    await apiRequest(ENDPOINTS.tutors.save(tutorId), { method: "DELETE" });
  },
};
