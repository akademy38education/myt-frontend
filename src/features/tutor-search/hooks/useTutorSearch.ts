import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tutorSearchService } from "../services/tutorSearchService";
import type { TutorSearchFilter } from "../types";

export function useTutorSearch(filter: TutorSearchFilter) {
  return useQuery({
    queryKey: ["tutors", "search", filter],
    queryFn: () => tutorSearchService.search(filter),
    placeholderData: keepPreviousData,
  });
}
