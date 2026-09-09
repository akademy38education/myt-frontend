import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ExternalLink, FileText, HelpCircle, ListChecks, PlayCircle, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentStudentProfile } from "@/features/students";
import { useLessonDetail } from "@/features/lessons";
import { BookingStatusBadge, CancelBookingModal, RescheduleBookingModal, canManageBooking } from "@/features/bookings";
import { lessonSessionService } from "@/features/classroom";
import { formatDateTime, initials } from "@/utils/formatters";

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studentId } = useCurrentStudentProfile();
  const { data: lesson, isLoading, isError, refetch } = useLessonDetail(studentId, id ?? "");
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  if (isLoading) return <LoadingState label="Loading lesson..." />;
  if (isError) return <ErrorState title="We couldn't load this lesson" onRetry={() => refetch()} />;
  if (!lesson) return <NotFoundState />;

  const { booking, meta, tutorName, subjectName, state, lesson: lessonRecord } = lesson;
  const durationMinutes = Math.round((new Date(booking.scheduledEnd).getTime() - new Date(booking.scheduledStart).getTime()) / 60000);
  const isPast = state === "completed" || state === "cancelled" || state === "missed";
  const joinState = lessonSessionService.getJoinState(booking);
  const canManage = canManageBooking(booking);

  // The classroom page itself handles "too early" (waiting room with a countdown) — no need to gate navigation here, see Phase 7 spec §6.
  function handleJoinClick() {
    navigate(`/student/classroom/${booking.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/student/lessons")}>
        <ArrowLeft className="h-4 w-4" />
        Back to lessons
      </Button>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{initials(tutorName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold">{subjectName}</h1>
                <BookingStatusBadge booking={booking} />
              </div>
              <p className="text-sm text-muted-foreground">with {tutorName}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateTime(booking.scheduledStart)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {durationMinutes} min
                </span>
              </div>
            </div>
          </div>
          {!isPast && (
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleJoinClick} variant={joinState === "live" ? "default" : "outline"}>
                <Video className="h-4 w-4" />
                {joinState === "live" ? "Join Lesson" : "Enter Waiting Room"}
              </Button>
            </div>
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

      {isPast ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Lesson summary
              </h2>
              {lessonRecord?.summary ? (
                <>
                  <p className="text-sm text-muted-foreground">{lessonRecord.summary}</p>
                  <Link to={`/student/lessons/${booking.id}/summary`} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                    View full summary →
                  </Link>
                </>
              ) : state === "completed" ? (
                <Link to={`/student/lessons/${booking.id}/summary`} className="text-sm font-medium text-primary hover:underline">
                  View full summary →
                </Link>
              ) : (
                <EmptyState title="No summary available" description={state === "missed" ? "This lesson was missed." : "This lesson was cancelled."} className="py-8" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <PlayCircle className="h-4 w-4 text-primary" />
                Recording
              </h2>
              <EmptyState title="Recording not available yet" description="Lesson recordings are coming in a future update." className="py-8" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 font-semibold">{meta?.topic ?? "Lesson topic to be confirmed"}</h2>
              {meta?.goals && meta.goals.length > 0 && (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {meta.goals.map((goal) => (
                    <li key={goal} className="flex items-start gap-2">
                      <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {goal}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {meta?.prepNotes && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-2 font-semibold">Preparation</h2>
                <p className="text-sm text-muted-foreground">{meta.prepNotes}</p>
              </CardContent>
            </Card>
          )}

          {meta?.resources && meta.resources.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 font-semibold">Resources</h2>
                <ul className="space-y-2">
                  {meta.resources.map((resource) => (
                    <li key={resource.title} className="flex items-center gap-2 text-sm">
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">{resource.type}</span>
                      {resource.title}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {meta?.questionsToAsk && meta.questionsToAsk.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 flex items-center gap-2 font-semibold">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Questions you might want to ask
                </h2>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {meta.questionsToAsk.map((q) => (
                    <li key={q}>• {q}</li>
                  ))}
                </ul>
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

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-2 font-semibold">Homework</h2>
              <p className="text-sm text-muted-foreground">
                Any homework set from this lesson will appear on your{" "}
                <Link to="/student/homework" className="font-medium text-primary hover:underline">
                  Homework
                </Link>{" "}
                page.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <CancelBookingModal booking={showCancel ? booking : null} tutorName={tutorName} subjectName={subjectName} onOpenChange={setShowCancel} />
      <RescheduleBookingModal booking={showReschedule ? booking : null} tutorName={tutorName} subjectName={subjectName} onOpenChange={setShowReschedule} />
    </div>
  );
}
