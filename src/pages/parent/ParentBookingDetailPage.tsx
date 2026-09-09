import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { useBookingDetail, BookingStatusBadge, CancelBookingModal, isUpcoming } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { studentsService } from "@/features/students";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";

export function ParentBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, refetch } = useBookingDetail(id ?? "");
  const { data: tutor } = useQuery({ queryKey: ["tutors", booking?.tutorId], queryFn: () => tutorsService.getById(booking!.tutorId), enabled: Boolean(booking) });
  const { data: student } = useQuery({ queryKey: ["students", booking?.studentId], queryFn: () => studentsService.getProfile(booking!.studentId), enabled: Boolean(booking) });
  const [showCancel, setShowCancel] = useState(false);

  if (isLoading) return <LoadingState label="Loading booking..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!booking) return <NotFoundState />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
  const childName = student?.fullName ?? student?.yearGroup ?? "Your child";

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/parent/bookings")}>
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Button>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{initials(tutor?.headline ?? "T")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{subjectName}</h1>
                <BookingStatusBadge booking={booking} />
              </div>
              <p className="text-sm text-muted-foreground">
                {childName} · with {tutor?.headline ?? "Tutor"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateTime(booking.scheduledStart)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {booking.durationMinutes} min
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/parent/messages")}>
            <MessageSquare className="h-4 w-4" />
            Message tutor
          </Button>
        </CardContent>
        {isUpcoming(booking) && (
          <CardContent className="flex gap-2 border-t border-border p-4 pt-4">
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setShowCancel(true)}>
              Cancel lesson
            </Button>
          </CardContent>
        )}
      </Card>

      {booking.notes && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Notes</h2>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      <CancelBookingModal booking={showCancel ? booking : null} tutorName={tutor?.headline ?? ""} subjectName={subjectName} onOpenChange={setShowCancel} />
    </div>
  );
}
