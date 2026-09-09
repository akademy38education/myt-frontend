import type { TutorProfile } from "@myt/shared";

export type TutorSortOrder = "recommended" | "rating" | "priceAsc" | "priceDesc" | "experience" | "availability" | "newest";

/**
 * A single flat filter/sort/pagination shape shared by the marketplace UI,
 * the URL query string and the search service — see
 * `features/tutor-search/hooks/useMarketplaceState.ts` for how it's kept in
 * sync with `useSearchParams`.
 */
export interface TutorSearchFilter {
  query?: string;
  subjectId?: string;
  yearLevel?: string;
  curriculum?: string;
  teachingStyle?: string;
  availability?: string;
  language?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  trialAvailable?: boolean;
  sort?: TutorSortOrder;
  page?: number;
  pageSize?: number;
}

export interface TutorSearchResponse {
  items: TutorProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
