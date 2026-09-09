import { TutorVerificationStatus, type TutorApplication, type TutorApplicationInput } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";

export const tutorVerificationService = {
  async getStatus(tutorId: string): Promise<TutorApplication | null> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return null;
    }
    return apiRequest<TutorApplication | null>(ENDPOINTS.tutorVerification.status(tutorId));
  },

  async saveApplication(input: Partial<TutorApplicationInput>, submit: boolean): Promise<TutorApplication> {
    if (env.VITE_USE_MOCK_API) {
      await delay(400);
      const now = new Date().toISOString();
      return {
        id: "mock-application",
        tutorId: "mock-tutor",
        status: submit ? TutorVerificationStatus.PENDING : TutorVerificationStatus.UNSUBMITTED,
        headline: input.headline ?? "",
        bio: input.bio ?? "",
        languages: input.languages ?? [],
        subjects: input.subjects ?? [],
        yearLevels: input.yearLevels ?? [],
        curricula: input.curricula ?? [],
        yearsExperience: input.yearsExperience ?? 0,
        ageGroups: input.ageGroups ?? [],
        qualifications: input.qualifications ?? [],
        teachingStyle: input.teachingStyle ?? "",
        hourlyRate: input.hourlyRate ?? 0,
        currency: input.currency ?? "GBP",
        trialLessonEnabled: input.trialLessonEnabled ?? false,
        availability: input.availability ?? [],
        createdAt: now,
        updatedAt: now,
      };
    }
    return apiRequest<TutorApplication>(ENDPOINTS.tutorVerification.apply, { method: "POST", body: { ...input, submit } });
  },
};
