import { useLocation, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import type { TutorProfile } from "@myt/shared";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useSavedTutors, useToggleSavedTutor } from "@/features/saved-tutors";
import { TutorCard, getMarketplaceContext, tutorProfilePath, findTutorPath } from "@/features/tutor-search";
import { BookingDialog } from "@/features/bookings";

export function SavedTutorsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = getMarketplaceContext(location.pathname);
  const { data, isLoading, isError, refetch } = useSavedTutors();
  const toggleSaved = useToggleSavedTutor();
  const [bookingTutor, setBookingTutor] = useState<TutorProfile | null>(null);

  return (
    <div>
      <PageHeader title="Saved tutors" description="Tutors you've bookmarked to compare or book later." />

      {isLoading && <LoadingState label="Loading your saved tutors..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No saved tutors yet"
          description="Save tutors you like so you can compare them later."
          actionLabel="Find tutors"
          onAction={() => navigate(findTutorPath(context))}
        />
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onViewProfile={(t) => navigate(tutorProfilePath(context, t.id))}
              onBook={setBookingTutor}
              isSaved
              onToggleSave={(t) => toggleSaved.mutate({ tutorId: t.id, isSaved: true })}
            />
          ))}
        </div>
      )}

      <BookingDialog tutor={bookingTutor} onOpenChange={(open) => !open && setBookingTutor(null)} />
    </div>
  );
}
