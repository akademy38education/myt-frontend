import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { useBookingDetail, BookingConfirmation } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { SUBJECTS } from "@/constants/subjects";

/** Standalone confirmation view — reached by navigating here after a booking (see `BookTutorPage`) or by reloading/sharing the URL directly, so it re-fetches rather than relying on in-memory wizard state. */
export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading, isError, refetch } = useBookingDetail(id ?? "");
  const { data: tutor } = useQuery({
    queryKey: ["tutors", booking?.tutorId],
    queryFn: () => tutorsService.getById(booking!.tutorId),
    enabled: Boolean(booking),
  });

  if (isLoading) return <LoadingState label="Loading your booking..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!booking) return <NotFoundState />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <Card>
        <CardContent className="p-6">
          <BookingConfirmation booking={booking} tutorName={tutor?.headline ?? "your tutor"} subjectName={subjectName} />
        </CardContent>
      </Card>
    </div>
  );
}
