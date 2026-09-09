import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { tutorsService, TutorProfileError } from "@/features/tutors";
import { BookingWizard } from "@/features/bookings";

/** Full-page equivalent of `BookingDialog` — same `BookingWizard`, no modal chrome. This is the real entry point the tutor profile's "Book a Lesson" CTA now routes to for a logged-in student. */
export function BookTutorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: tutor, isLoading, isError, refetch } = useQuery({
    queryKey: ["tutors", id],
    queryFn: () => tutorsService.getById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) return <LoadingState label="Loading tutor..." />;
  if (isError) return <TutorProfileError onRetry={() => refetch()} />;
  if (!tutor) return <NotFoundState />;

  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const initialSlot = date && time ? { date, time } : undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardContent className="p-6">
          <BookingWizard tutor={tutor} initialSlot={initialSlot} onComplete={(booking) => navigate(`/student/bookings/${booking.id}/confirmation`)} />
        </CardContent>
      </Card>
    </div>
  );
}
