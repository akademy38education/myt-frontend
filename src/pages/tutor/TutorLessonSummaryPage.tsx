import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useBookingDetail } from "@/features/bookings";
import { useLessonSession, useLessonParticipants } from "@/features/classroom";
import { homeworkService } from "@/features/homework";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate } from "@/utils/formatters";

export function TutorLessonSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingId = id ?? "";
  const { data: booking, isLoading: isBookingLoading, isError, refetch } = useBookingDetail(bookingId);
  const { data: lesson, isLoading: isLessonLoading } = useLessonSession(bookingId);
  const { data: participants } = useLessonParticipants(bookingId, booking);
  const { data: homework } = useQuery({ queryKey: ["lesson-homework", bookingId], queryFn: () => homeworkService.listForLesson(bookingId), enabled: Boolean(bookingId) });

  if (isBookingLoading || isLessonLoading) return <LoadingState label="Loading lesson summary..." />;
  if (isError || !booking) return <ErrorState onRetry={() => refetch()} />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? "Lesson";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-brand p-6 text-center text-white">
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10" />
          <h1 className="text-xl font-semibold">Lesson complete</h1>
          <p className="mt-1 text-sm text-white/90">
            {subjectName} with {participants?.student.name ?? "your student"}
          </p>
        </div>
        <CardContent className="grid grid-cols-2 gap-4 p-5 text-center sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold">{booking.durationMinutes} minutes</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-semibold">{formatDate(booking.scheduledStart)}</p>
          </div>
          <div className="col-span-2 flex items-center justify-center gap-1.5 sm:col-span-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="font-semibold">{participants?.student.name ?? "Student"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-2 font-semibold">Your summary</h2>
          {lesson?.summary ? <p className="text-sm text-muted-foreground">{lesson.summary}</p> : <EmptyState title="No summary added" description="You ended this lesson without adding a summary." className="py-6" />}
        </CardContent>
      </Card>

      {lesson?.objectives && lesson.objectives.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 font-semibold">Objectives covered</h2>
            <ul className="space-y-1.5">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {objective}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {lesson?.nextSteps && lesson.nextSteps.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Next steps</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {lesson.nextSteps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {homework && homework.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <ClipboardList className="h-4 w-4 text-primary" />
              Homework assigned
            </h2>
            <ul className="space-y-2 text-sm">
              {homework.map((hw) => (
                <li key={hw.id} className="rounded-md border border-border p-3">
                  {hw.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" className="w-full" onClick={() => navigate("/tutor/bookings")}>
        Back to Bookings
      </Button>
    </div>
  );
}
