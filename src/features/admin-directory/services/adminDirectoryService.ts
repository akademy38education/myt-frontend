import type { StudentProfile, ParentProfile, TutorProfile } from "@myt/shared";
import { apiRequest } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockStudents, mockParents, mockTutors } from "@/mocks";

/**
 * These three admin directories return full unpaginated arrays from the
 * backend (they reuse the existing student/parent/tutor repositories
 * directly) — pagination/search for all three happens client-side in the
 * page components, same as everywhere else `DataTable` is used.
 */
export const adminDirectoryService = {
  async getStudents(): Promise<StudentProfile[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockStudents;
    }
    return apiRequest<StudentProfile[]>(ENDPOINTS.admin.students);
  },

  async getParents(): Promise<ParentProfile[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockParents;
    }
    return apiRequest<ParentProfile[]>(ENDPOINTS.admin.parents);
  },

  async getTutors(): Promise<TutorProfile[]> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return mockTutors;
    }
    return apiRequest<TutorProfile[]>(ENDPOINTS.admin.tutors);
  },
};
