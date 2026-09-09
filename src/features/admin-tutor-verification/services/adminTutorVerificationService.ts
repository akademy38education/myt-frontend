import { TutorVerificationStatus, type TutorApplication, type TutorApplicationWithApplicant, type VerificationDecisionInput, type RequestVerificationInfoInput } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { useMockTutorVerificationStore } from "../mockTutorVerificationStore";
import type { VerificationQueueFilter } from "../types";

export const adminTutorVerificationService = {
  async getQueue(filter: VerificationQueueFilter = {}): Promise<TutorApplicationWithApplicant[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return useMockTutorVerificationStore.getState().applications.filter((a) => !filter.status || a.status === filter.status);
    }
    return apiRequest<TutorApplicationWithApplicant[]>(ENDPOINTS.tutorVerification.queue, { query: { status: filter.status } });
  },

  async getApplication(applicationId: string): Promise<TutorApplicationWithApplicant> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const application = useMockTutorVerificationStore.getState().applications.find((a) => a.id === applicationId);
      if (!application) throw new Error("Application not found");
      return application;
    }
    return apiRequest<TutorApplicationWithApplicant>(ENDPOINTS.tutorVerification.application(applicationId));
  },

  async approve(applicationId: string, input: VerificationDecisionInput): Promise<TutorApplication> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      void input;
      const updated = useMockTutorVerificationStore.getState().update(applicationId, { status: TutorVerificationStatus.APPROVED });
      if (!updated) throw new Error("Application not found");
      return updated;
    }
    return apiRequest<TutorApplication>(ENDPOINTS.tutorVerification.approve(applicationId), { method: "POST", body: input });
  },

  async reject(applicationId: string, input: VerificationDecisionInput): Promise<TutorApplication> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      void input;
      const updated = useMockTutorVerificationStore.getState().update(applicationId, { status: TutorVerificationStatus.REJECTED });
      if (!updated) throw new Error("Application not found");
      return updated;
    }
    return apiRequest<TutorApplication>(ENDPOINTS.tutorVerification.reject(applicationId), { method: "POST", body: input });
  },

  /** No `INFO_REQUESTED` status exists on the real `TutorVerificationStatus` enum — requesting info moves an application to IN_REVIEW (someone is actively working it, pending the applicant's reply), matching what the real backend's own service does. */
  async requestInfo(applicationId: string, input: RequestVerificationInfoInput): Promise<TutorApplication> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      void input;
      const updated = useMockTutorVerificationStore.getState().update(applicationId, { status: TutorVerificationStatus.IN_REVIEW });
      if (!updated) throw new Error("Application not found");
      return updated;
    }
    return apiRequest<TutorApplication>(ENDPOINTS.tutorVerification.requestInfo(applicationId), { method: "POST", body: input });
  },
};
