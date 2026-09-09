import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ExternalLink, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { useBookingDetail, BookingStatusBadge, CancelBookingModal, RescheduleBookingModal, canManageBooking, isUpcoming } from "@/features/bookings";
import { lessonSessionService } from "@/features/classroom";
import { studentsService } from "@/features/students";
import { useQuery } from "@tanstack/react-query";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";

export function TutorBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError, refetch } = useBookingDetail(id ?? "");
  const { data: student } = useQuery({
    queryKey: ["students", booking?.studentId],
    queryFn: () => studentsService.getProfile(booking!.studentId),
    enabled: Boolean(booking),
  });
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  if (isLoading) return <LoadingState label="Loading booking..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!booking) return <NotFoundState />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
  const studentName = student?.fullName ?? "Student";
  const joinState = lessonSessionService.getJoinState(booking);
  const canManage = canManageBooking(booking);

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/tutor/bookings")}>
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Button>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{initials(studentName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{subjectName}</h1>
                <BookingStatusBadge booking={booking} />
              </div>
              <p className="text-sm text-muted-foreground">with {studentName}</p>
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
          {isUpcoming(booking) && (
            <Button onClick={() => navigate(`/tutor/classroom/${booking.id}`)} variant={joinState === "live" ? "default" : "outline"}>
              <Video className="h-4 w-4" />
              {joinState === "live" ? "Join Classroom" : "Enter Waiting Room"}
            </Button>
          )}
        </CardContent>
        {canManage && (
          <CardContent className="flex gap-2 border-t border-border p-4 pt-4">
            <Button variant="outline" size="sm" onClick={() => setShowReschedule(true)}>
              Reschedule
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setShowCancel(true)}>
              Cancel lesson
            </Button>
          </CardContent>
        )}
      </Card>

      {booking.notes && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Student notes</h2>
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      {booking.meetingUrl && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Meeting link</h2>
            <a href={booking.meetingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" />
              {booking.meetingUrl}
            </a>
          </CardContent>
        </Card>
      )}

      <CancelBookingModal booking={showCancel ? booking : null} tutorName="" subjectName={subjectName} onOpenChange={setShowCancel} />
      <RescheduleBookingModal booking={showReschedule ? booking : null} tutorName="" subjectName={subjectName} onOpenChange={setShowReschedule} />
    </div>
  );
}
