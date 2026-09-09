import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Calendar, MessageSquare, NotebookPen, Target } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorStudentDetail, useTutorStudentNotes, useAddTutorStudentNote } from "@/features/tutor-students";
import { homeworkService } from "@/features/homework";
import { BookingStatusBadge } from "@/features/bookings";
import { MasteryOverview } from "@/features/mastery";
import { useGoals } from "@/features/goals";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate, formatDateTime, initials } from "@/utils/formatters";

export function TutorStudentDetailPage() {
  const { id: studentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tutorId } = useCurrentTutorProfile();
  const { data: detail, isLoading, isError, refetch } = useTutorStudentDetail(tutorId, studentId ?? "");
  const { data: notes } = useTutorStudentNotes(tutorId, studentId ?? "");
  const addNote = useAddTutorStudentNote(tutorId, studentId ?? "");
  const [draftNote, setDraftNote] = useState("");

  const { data: homework } = useQuery({
    queryKey: ["homework", studentId, "for-tutor", tutorId],
    queryFn: async () => (await homeworkService.list(studentId ?? "")).filter((h) => h.tutorId === tutorId),
    enabled: Boolean(studentId && tutorId),
  });
  const { data: goals } = useGoals(studentId ?? "");

  if (isLoading || !tutorId) return <LoadingState label="Loading student..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!detail) return <NotFoundState />;

  const { student, name, bookings, lessonsCount, nextLessonAt, attendanceRate } = detail;

  function handleAddNote() {
    if (!draftNote.trim()) return;
    addNote.mutate(draftNote.trim());
    setDraftNote("");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/tutor/students")}>
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Button>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{initials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{name}</h1>
              <p className="text-sm text-muted-foreground">{student.yearGroup}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {student.subjects.map((id) => (
                  <Badge key={id} variant="outline">
                    {SUBJECTS.find((s) => s.id === id)?.name ?? id}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/tutor/messages")}>
            <MessageSquare className="h-4 w-4" />
            Message Student
          </Button>
        </CardContent>
        <CardContent className="grid grid-cols-2 gap-4 border-t border-border p-4 pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Lessons taught</p>
            <p className="font-semibold">{lessonsCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p className="font-semibold">{attendanceRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next lesson</p>
            <p className="font-semibold">{nextLessonAt ? formatDate(nextLessonAt) : "None scheduled"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Learning goals</p>
            <p className="font-semibold">{student.learningGoals.length}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <Target className="h-4 w-4 text-primary" />
                Learning goals
              </h2>
              {student.learningGoals.length === 0 ? (
                <EmptyState title="No learning goals set" description="Goals set during onboarding will appear here." className="py-8" />
              ) : (
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {student.learningGoals.map((goal) => (
                    <li key={goal}>• {goal}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-semibold">Learning progress</h2>
              <MasteryOverview
                studentId={student.id}
                emptyStateDescription="Subject-by-subject mastery will appear here once this student has more lesson history."
              />
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="mb-3 text-sm font-semibold">Goals</h3>
                {!goals || goals.length === 0 ? (
                  <EmptyState title="No goals set yet" className="py-6" />
                ) : (
                  <ul className="space-y-2">
                    {goals.map((goal) => (
                      <li key={goal.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm">
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">Target {formatDate(goal.targetDate)}</p>
                        </div>
                        <span className="shrink-0 font-medium tabular-nums">{goal.progress}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          {bookings.length === 0 ? (
            <EmptyState icon={Calendar} title="No lessons yet" />
          ) : (
            <div className="space-y-2">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => navigate(`/tutor/bookings/${booking.id}`)}
                  className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.scheduledStart)} · {booking.durationMinutes} min
                    </p>
                  </div>
                  <BookingStatusBadge booking={booking} />
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="homework">
          {!homework || homework.length === 0 ? (
            <EmptyState icon={BookOpen} title="No homework assigned" description="Homework you assign this student will appear here." />
          ) : (
            <div className="space-y-2">
              {homework.map((hw) => (
                <div key={hw.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{hw.title}</p>
                    <p className="text-xs text-muted-foreground">Due {formatDate(hw.dueAt)}</p>
                  </div>
                  <Badge variant={hw.status === "REVIEWED" ? "success" : hw.status === "OVERDUE" ? "destructive" : "outline"}>{hw.status.toLowerCase()}</Badge>
                </div>
              ))}
            </div>
          )}
          <Link to="/tutor/homework" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Go to homework review queue →
          </Link>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="mb-4">
            <CardContent className="space-y-2 p-4">
              <p className="text-xs text-muted-foreground">Private notes — never visible to this student or their family.</p>
              <Textarea value={draftNote} onChange={(e) => setDraftNote(e.target.value)} placeholder="e.g. Prefers visual explanations, struggles with fractions..." rows={3} />
              <Button size="sm" onClick={handleAddNote} disabled={!draftNote.trim() || addNote.isPending}>
                <NotebookPen className="h-4 w-4" />
                Add note
              </Button>
            </CardContent>
          </Card>
          {!notes || notes.length === 0 ? (
            <EmptyState title="No notes yet" description="Add a private note above to remember something about this student." />
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <p className="text-sm">{note.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
