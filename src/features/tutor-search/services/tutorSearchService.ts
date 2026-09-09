import { TutorVerificationStatus, type TutorProfile } from "@myt/shared";
import { apiRequestWithMeta } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { env } from "@/config/env";
import { delay } from "@/utils/delay";
import { mockTutors } from "@/mocks";
import type { TutorSearchFilter, TutorSearchResponse, TutorSortOrder } from "../types";

const DEFAULT_PAGE_SIZE = 12;

function sortTutors(tutors: TutorProfile[], sort: TutorSortOrder = "recommended"): TutorProfile[] {
  const sorted = [...tutors];
  switch (sort) {
    case "priceAsc":
      return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "priceDesc":
      return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "experience":
      return sorted.sort((a, b) => b.yearsExperience - a.yearsExperience);
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "availability":
      return sorted.sort((a, b) => b.availabilitySlots.length - a.availabilitySlots.length);
    case "rating":
    case "recommended":
    default:
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }
}

function searchMock(filter: TutorSearchFilter): TutorSearchResponse {
  let tutors = mockTutors.filter((tutor) => {
    if (filter.subjectId && !tutor.subjects.includes(filter.subjectId)) return false;
    if (filter.yearLevel && !tutor.yearLevels.includes(filter.yearLevel)) return false;
    if (filter.curriculum && !tutor.curricula.includes(filter.curriculum)) return false;
    if (filter.teachingStyle && tutor.teachingStyle !== filter.teachingStyle) return false;
    if (filter.availability && !tutor.availabilitySlots.includes(filter.availability)) return false;
    if (filter.language && !tutor.languages.includes(filter.language)) return false;
    if (filter.minRating && tutor.rating < filter.minRating) return false;
    if (filter.minPrice && tutor.hourlyRate < filter.minPrice) return false;
    if (filter.maxPrice && tutor.hourlyRate > filter.maxPrice) return false;
    if (filter.verifiedOnly && tutor.verificationStatus !== TutorVerificationStatus.APPROVED) return false;
    if (filter.trialAvailable && !tutor.trialLessonEnabled) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      const haystack = [tutor.headline, tutor.bio, tutor.teachingStyle, ...tutor.yearLevels, ...tutor.curricula].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  tutors = sortTutors(tutors, filter.sort);

  const total = tutors.length;
  const pageSize = filter.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = filter.page ?? 1;
  const items = tutors.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export const tutorSearchService = {
  async search(filter: TutorSearchFilter): Promise<TutorSearchResponse> {
    if (env.VITE_USE_MOCK_API) {
      await delay();
      return searchMock(filter);
    }
    const response = await apiRequestWithMeta<TutorProfile[]>(ENDPOINTS.tutors.search, {
      query: {
        query: filter.query,
        subjectId: filter.subjectId,
        yearLevel: filter.yearLevel,
        curriculum: filter.curriculum,
        teachingStyle: filter.teachingStyle,
        availability: filter.availability,
        language: filter.language,
        minRating: filter.minRating,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        verifiedOnly: filter.verifiedOnly,
        trialAvailable: filter.trialAvailable,
        sort: filter.sort,
        page: filter.page,
        pageSize: filter.pageSize,
      },
    });
    const meta = response.meta ?? { page: 1, pageSize: response.data.length, total: response.data.length, totalPages: 1 };
    return { items: response.data, ...meta };
  },
};
