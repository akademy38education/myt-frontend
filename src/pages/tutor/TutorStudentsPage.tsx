import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorStudents } from "@/features/tutor-students";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate, initials } from "@/utils/formatters";

const STATUS_FILTERS = [
  { value: "all", label: "All students" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export function TutorStudentsPage() {
  const { tutorId } = useCurrentTutorProfile();
  const { data: students, isLoading, isError, refetch } = useTutorStudents(tutorId);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
  const [subjectId, setSubjectId] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (subjectId !== "all" && !s.subjects.includes(subjectId)) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [students, status, subjectId, query]);

  const subjectOptions = Array.from(new Set((students ?? []).flatMap((s) => s.subjects)));

  return (
    <div>
      <PageHeader title="Students" description="Everyone you're currently teaching, in one place." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name..." className="sm:max-w-xs" />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {subjectOptions.length > 0 && (
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjectOptions.map((id) => (
                <SelectItem key={id} value={id}>
                  {SUBJECTS.find((s) => s.id === id)?.name ?? id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading && <LoadingState label="Loading your students..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={Users}
          title={students && students.length > 0 ? "No students match your filters" : "Your students will appear here"}
          description={students && students.length > 0 ? "Try a different search or filter." : "Once you start teaching a lesson, that student shows up here automatically."}
        />
      )}

      {filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((student) => (
            <Link key={student.studentId} to={`/tutor/students/${student.studentId}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback>{initials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.subjects.map((id) => SUBJECTS.find((s) => s.id === id)?.name ?? id).join(", ")}</p>
                      </div>
                    </div>
                    <Badge variant={student.status === "active" ? "success" : "muted"}>{student.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>Lessons taught</p>
                      <p className="font-medium text-foreground">{student.lessonsCount}</p>
                    </div>
                    <div>
                      <p>{student.nextLessonAt ? "Next lesson" : "Last lesson"}</p>
                      <p className="font-medium text-foreground">{formatDate(student.nextLessonAt ?? student.lastLessonAt ?? new Date().toISOString())}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
