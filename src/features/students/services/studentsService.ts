import type { StudentOnboardingInput, StudentProfile } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockStudents, mockBookings, mockGoals } from "@/mocks";
import type { StudentDashboardSummary } from "../types";

export const studentsService = {
  /** Accepts either the StudentProfile id or the owning user's id (the backend resolves either — see students.service.ts). */
  async getProfile(studentId: string): Promise<StudentProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const profile = mockStudents.find((s) => s.id === studentId || s.userId === studentId);
      if (!profile) throw new Error("Student not found");
      return profile;
    }
    return apiRequest<StudentProfile>(ENDPOINTS.students.byId(studentId));
  },

  async getDashboardSummary(studentId: string): Promise<StudentDashboardSummary> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      const profile = mockStudents.find((s) => s.id === studentId);
      if (!profile) throw new Error("Student not found");
      return {
        profile,
        upcomingBookings: mockBookings.filter((b) => b.studentId === profile.id && new Date(b.scheduledStart) > new Date()),
        homeworkDueCount: 1,
        activeGoalsCount: mockGoals.filter((g) => g.studentId === profile.id).length,
      };
    }
    return apiRequest<StudentDashboardSummary>(ENDPOINTS.students.dashboard(studentId));
  },

  /** Saves one onboarding step's data. `completeOnboarding: true` on the final step finalises the profile. */
  async saveOnboardingStep(studentUserId: string, input: StudentOnboardingInput, completeOnboarding = false): Promise<StudentProfile> {
    if (env.VITE_USE_MOCK_API) {
      await delay(300);
      const base = mockStudents.find((s) => s.userId === studentUserId) ?? mockStudents[0];
      if (!base) throw new Error("No mock student to update");
      return { ...base, ...input };
    }
    return apiRequest<StudentProfile>(ENDPOINTS.students.onboarding(studentUserId), {
      method: "PATCH",
      body: { ...input, completeOnboarding },
    });
  },
};
