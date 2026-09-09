import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CardListSkeleton } from "@/components/shared/CardListSkeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentStudentProfile } from "@/features/students";
import { useLessons, StudentLessonCard, type LessonView, type LessonViewState } from "@/features/lessons";
import { CancelBookingModal, RescheduleBookingModal } from "@/features/bookings";
import { SUBJECTS } from "@/constants/subjects";

const TABS: Array<{ value: string; label: string; states: LessonViewState[] }> = [
  { value: "upcoming", label: "Upcoming", states: ["upcoming", "starting-soon", "ready-to-join"] },
  { value: "completed", label: "Completed", states: ["completed"] },
  { value: "cancelled", label: "Cancelled", states: ["cancelled", "missed"] },
];

export function StudentLessonsPage() {
  const { studentId } = useCurrentStudentProfile();
  const { data: lessons, isLoading, isError, refetch } = useLessons(studentId);

  const [tab, setTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [cancellingLesson, setCancellingLesson] = useState<LessonView | null>(null);
  const [reschedulingLesson, setReschedulingLesson] = useState<LessonView | null>(null);

  const filtered = useMemo(() => {
    if (!lessons) return [];
    const states = TABS.find((t) => t.value === tab)?.states ?? [];
    return lessons.filter((lesson) => {
      if (!states.includes(lesson.state)) return false;
      if (subjectId && lesson.booking.subjectId !== subjectId) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!lesson.tutorName.toLowerCase().includes(q) && !lesson.subjectName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [lessons, tab, subjectId, query]);

  return (
    <div>
      <PageHeader title="My Lessons" description="Everything you've booked, taught, or missed — in one place." />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by tutor or subject..." className="sm:flex-1" />
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <CardListSkeleton />}
      {isError && <ErrorState title="We couldn't load your lessons" description="Your work is safe." onRetry={() => refetch()} />}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState title={`No ${tab} lessons`} description={tab === "upcoming" ? "Ready to book your first lesson?" : "Nothing here yet."} />
      )}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((lesson) => (
            <StudentLessonCard key={lesson.booking.id} lesson={lesson} onCancel={setCancellingLesson} onReschedule={setReschedulingLesson} />
          ))}
        </div>
      )}

      <CancelBookingModal
        booking={cancellingLesson?.booking ?? null}
        tutorName={cancellingLesson?.tutorName ?? ""}
        subjectName={cancellingLesson?.subjectName ?? ""}
        onOpenChange={(open) => !open && setCancellingLesson(null)}
      />
      <RescheduleBookingModal
        booking={reschedulingLesson?.booking ?? null}
        tutorName={reschedulingLesson?.tutorName ?? ""}
        subjectName={reschedulingLesson?.subjectName ?? ""}
        onOpenChange={(open) => !open && setReschedulingLesson(null)}
      />
    </div>
  );
}
