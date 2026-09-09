import { useQuery } from "@tanstack/react-query";
import { tutorReviewsService } from "../services/tutorReviewsService";

export function useTutorReviews(tutorId: string, minRating?: number) {
  return useQuery({
    queryKey: ["tutors", tutorId, "reviews", minRating],
    queryFn: () => tutorReviewsService.getForTutor(tutorId, minRating),
    enabled: Boolean(tutorId),
  });
}
