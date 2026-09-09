import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, CheckCircle2, ClipboardList, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useBookingDetail } from "@/features/bookings";
import { useLessonSession, useLessonParticipants, lessonSummaryService } from "@/features/classroom";
import { homeworkService } from "@/features/homework";
import { tutorReviewsService } from "@/features/tutor-reviews";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate } from "@/utils/formatters";

export function StudentLessonSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingId = id ?? "";
  const { data: booking, isLoading: isBookingLoading, isError, refetch } = useBookingDetail(bookingId);
  const { data: lesson, isLoading: isLessonLoading } = useLessonSession(bookingId);
  const { data: participants } = useLessonParticipants(bookingId, booking);
  const { data: homework } = useQuery({ queryKey: ["lesson-homework", bookingId], queryFn: () => homeworkService.listForLesson(bookingId), enabled: Boolean(bookingId) });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isBookingLoading || isLessonLoading) return <LoadingState label="Loading your lesson summary..." />;
  if (isError || !booking) return <ErrorState onRetry={() => refetch()} />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? "Lesson";
  const tutorName = participants?.tutor.name ?? "your tutor";
  const durationMinutes = booking.durationMinutes;
  const recommendations = lesson ? lessonSummaryService.buildRecommendations({ lesson, subjectName }) : null;

  async function handleSubmitFeedback() {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await tutorReviewsService.submit({ bookingId, rating, comment: comment.trim() || undefined });
      setSubmitted(true);
      toast.success("Thanks for your feedback!");
    } catch {
      toast.error("We couldn't submit your feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="animate-in fade-in-0 zoom-in-95 overflow-hidden duration-500">
        <div className="bg-gradient-brand p-6 text-center text-white">
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10" />
          <h1 className="text-xl font-semibold">Lesson complete</h1>
          <p className="mt-1 text-sm text-white/90">
            {subjectName} with {tutorName}
          </p>
        </div>
        <CardContent className="grid grid-cols-2 gap-4 p-5 text-center sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold">{durationMinutes} minutes</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-semibold">{formatDate(booking.scheduledStart)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Tutor</p>
            <p className="font-semibold">{tutorName}</p>
          </div>
        </CardContent>
      </Card>

      {lesson?.summary && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">What you learned</h2>
            <p className="text-sm text-muted-foreground">{lesson.summary}</p>
          </CardContent>
        </Card>
      )}

      {lesson?.objectives && lesson.objectives.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 font-semibold">Key points</h2>
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

      {homework && homework.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <ClipboardList className="h-4 w-4 text-primary" />
              Homework
            </h2>
            <div className="space-y-2">
              {homework.map((hw) => (
                <Link key={hw.id} to={`/student/homework/${hw.id}`} className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-muted/50">
                  {hw.title}
                  <span className="text-xs text-muted-foreground">Due {formatDate(hw.dueAt)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Recommended next steps
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Practice</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  {recommendations.practice.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Review</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  {recommendations.review.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4 text-primary" />
            Resources
          </h2>
          <EmptyState title="View shared resources" description="Anything your tutor shared during the lesson is in the Resources tab of your lesson history." className="py-6" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-3 font-semibold">How was your lesson?</h2>
          {submitted ? (
            <p className="text-sm text-success">Thanks — your feedback has been sent to {tutorName}.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`}>
                    <Star className={value <= rating ? "h-7 w-7 fill-warning text-warning" : "h-7 w-7 text-muted"} />
                  </button>
                ))}
              </div>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Anything you'd like to add? (optional)" rows={3} />
              <Button disabled={rating === 0} isLoading={submitting} onClick={handleSubmitFeedback}>
                Submit feedback
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => navigate("/student/lessons")}>
        Back to My Lessons
      </Button>
    </div>
  );
}
