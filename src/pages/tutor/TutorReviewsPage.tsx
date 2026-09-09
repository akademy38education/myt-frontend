import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { useCurrentTutorProfile } from "@/features/tutors";
import { ReviewsSection } from "@/features/tutor-reviews";

export function TutorReviewsPage() {
  const { tutorId } = useCurrentTutorProfile();

  if (!tutorId) return <LoadingState label="Loading your reviews..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Reviews" description="What your students are saying." />
      <ReviewsSection tutorId={tutorId} />
    </div>
  );
}
