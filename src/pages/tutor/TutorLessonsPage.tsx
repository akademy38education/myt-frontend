import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { AlertCircle, Calendar, Clock, MessageSquare, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CardListSkeleton } from "@/components/shared/CardListSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorStudents } from "@/features/tutor-students";
import { useBookings, isUpcoming, BookingStatusBadge, CancelBookingModal, RescheduleBookingModal } from "@/features/bookings";
import { lessonSessionService, useUpdateLessonSummary } from "@/features/classroom";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";
import type { Booking } from "@myt/shared";
import { BookingStatus } from "@myt/shared";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "today", label: "Today" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function SummaryEditorDialog({ booking, onOpenChange }: { booking: Booking | null; onOpenChange: (open: boolean) => void }) {
  const bookingId = booking?.id ?? "";
  const updateSummary = useUpdateLessonSummary(bookingId);
  const [summary, setSummary] = useState("");
  const [topics, setTopics] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!booking) return;
    let cancelled = false;
    lessonSessionService.get(booking.id).then((lesson) => {
      if (cancelled) return;
      setSummary(lesson.summary ?? "");
      setTopics((lesson.objectives ?? []).join(", "));
      setNextSteps((lesson.nextSteps ?? []).join(", "));
      setSaveState("idle");
    });
    return () => {
      cancelled = true;
    };
  }, [booking]);

  function scheduleSave(next: { summary?: string; topics?: string; nextSteps?: string }) {
    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSummary.mutate(
        {
          summary: next.summary ?? summary,
          objectives: (next.topics ?? topics).split(",").map((t) => t.trim()).filter(Boolean),
          nextSteps: (next.nextSteps ?? nextSteps).split(",").map((t) => t.trim()).filter(Boolean),
        },
        { onSuccess: () => setSaveState("saved"), onError: () => setSaveState("idle") }
      );
    }, 1200);
  }

  if (!booking) return null;

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Lesson summary</DialogTitle>
          <DialogDescription>
            {SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId} · {formatDateTime(booking.scheduledStart)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">What did you cover?</label>
            <Textarea
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                scheduleSave({ summary: e.target.value });
              }}
              rows={4}
              placeholder="Summary of the lesson, strengths shown, areas to improve..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Topics covered</label>
            <Textarea
              value={topics}
              onChange={(e) => {
                setTopics(e.target.value);
                scheduleSave({ topics: e.target.value });
              }}
              rows={2}
              placeholder="Comma-separated, e.g. Quadratic equations, Factorising"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Next lesson focus</label>
            <Textarea
              value={nextSteps}
              onChange={(e) => {
                setNextSteps(e.target.value);
                scheduleSave({ nextSteps: e.target.value });
              }}
              rows={2}
              placeholder="Comma-separated next steps"
            />
          </div>
          <p className="text-xs text-muted-foreground">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : " "}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TutorLessonsPage() {
  const navigate = useNavigate();
  const { tutorId } = useCurrentTutorProfile();
  const { data: bookings, isLoading, isError, refetch } = useBookings({ tutorId });
  const { data: students } = useTutorStudents(tutorId);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("upcoming");
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [editingSummary, setEditingSummary] = useState<Booking | null>(null);

  const studentNameById = new Map((students ?? []).map((s) => [s.studentId, s.name]));

  const completedBookings = useMemo(() => (bookings ?? []).filter((b) => b.status === BookingStatus.COMPLETED), [bookings]);
  const lessonQueries = useQueries({
    queries: completedBookings.map((b) => ({ queryKey: ["lesson-session", b.id], queryFn: () => lessonSessionService.get(b.id) })),
  });
  const unfinishedSummaries = completedBookings.filter((_, i) => !lessonQueries[i]?.data?.summary);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (tab === "upcoming") return isUpcoming(b) && !isToday(b.scheduledStart);
      if (tab === "today") return isToday(b.scheduledStart) && b.status !== BookingStatus.CANCELLED;
      if (tab === "completed") return b.status === BookingStatus.COMPLETED;
      return b.status === BookingStatus.CANCELLED;
    });
  }, [bookings, tab]);

  return (
    <div>
      <PageHeader title="Lessons" description="Manage your teaching schedule and lesson summaries." />

      {unfinishedSummaries.length > 0 && (
        <Card className="mb-4 border-warning/40 bg-warning/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4 text-warning" />
              {unfinishedSummaries.length} lesson{unfinishedSummaries.length === 1 ? "" : "s"} need{unfinishedSummaries.length === 1 ? "s" : ""} a summary
            </p>
            <Button size="sm" variant="outline" onClick={() => setEditingSummary(unfinishedSummaries[0]!)}>
              Complete summary
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <CardListSkeleton />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && filtered.length === 0 && <EmptyState title={`No ${tab} lessons`} description="Nothing here yet." />}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
            const studentName = studentNameById.get(booking.studentId) ?? "Student";
            const hasSummary = lessonQueries[completedBookings.findIndex((b) => b.id === booking.id)]?.data?.summary;

            return (
              <Card key={booking.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback>{initials(studentName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{subjectName}</p>
                        <BookingStatusBadge booking={booking} />
                      </div>
                      <p className="text-sm text-muted-foreground">with {studentName}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                    {(tab === "today" || tab === "upcoming") && isUpcoming(booking) && (
                      <Button size="sm" onClick={() => navigate(`/tutor/classroom/${booking.id}`)}>
                        <Video className="h-4 w-4" />
                        Join
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => navigate(`/tutor/bookings/${booking.id}`)}>
                      View
                    </Button>
                    {tab === "completed" && (
                      <Button size="sm" variant={hasSummary ? "ghost" : "outline"} onClick={() => setEditingSummary(booking)}>
                        {hasSummary ? "Edit summary" : "Add summary"}
                      </Button>
                    )}
                    {isUpcoming(booking) && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => navigate("/tutor/messages")}>
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRescheduling(booking)}>
                          Reschedule
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setCancelling(booking)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CancelBookingModal
        booking={cancelling}
        tutorName=""
        subjectName={cancelling ? SUBJECTS.find((s) => s.id === cancelling.subjectId)?.name ?? "" : ""}
        onOpenChange={(open) => !open && setCancelling(null)}
      />
      <RescheduleBookingModal
        booking={rescheduling}
        tutorName=""
        subjectName={rescheduling ? SUBJECTS.find((s) => s.id === rescheduling.subjectId)?.name ?? "" : ""}
        onOpenChange={(open) => !open && setRescheduling(null)}
      />
      <SummaryEditorDialog booking={editingSummary} onOpenChange={(open) => !open && setEditingSummary(null)} />
    </div>
  );
}
