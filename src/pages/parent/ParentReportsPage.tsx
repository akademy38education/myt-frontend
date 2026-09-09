import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { reportsService } from "@/features/reports";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate } from "@/utils/formatters";

export function ParentReportsPage() {
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading: isChildrenLoading } = useChildren(parentId);
  const [childFilter, setChildFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const reportQueries = useQueries({
    queries: (children ?? []).map((child) => ({
      queryKey: ["reports", { childId: child.id }],
      queryFn: () => reportsService.list({ childId: child.id }),
      enabled: Boolean(child.id),
    })),
  });

  const childNameById = new Map((children ?? []).map((c) => [c.id, c.fullName ?? "Student"]));
  const allReports = (children ?? []).flatMap((_child, i) => reportQueries[i]?.data ?? []);
  const filtered = allReports
    .filter((r) => childFilter === "all" || r.studentId === childFilter)
    .filter((r) => subjectFilter === "all" || r.subjectId === subjectFilter)
    .sort((a, b) => b.lessonDate.localeCompare(a.lessonDate));

  const isLoading = isChildrenLoading || reportQueries.some((q) => q.isLoading);
  const subjectOptions = Array.from(new Set(allReports.map((r) => r.subjectId)));

  if (!parentId || isLoading) return <LoadingState label="Loading reports..." />;

  return (
    <div>
      <PageHeader title="Reports" description="Lesson reports your tutors have written for your family." />

      {(children?.length ?? 0) > 1 && (
        <div className="mb-4 flex flex-wrap gap-3">
          <Select value={childFilter} onValueChange={setChildFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All children</SelectItem>
              {(children ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {subjectOptions.length > 0 && (
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-44">
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
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" description="Reports appear here once a tutor writes up a completed lesson." />
      ) : (
        <div className="space-y-2">
          {filtered.map((report) => (
            <Link key={report.bookingId} to={`/parent/reports/${report.bookingId}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {SUBJECTS.find((s) => s.id === report.subjectId)?.name ?? report.subjectId} — {childNameById.get(report.studentId) ?? "Student"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(report.lessonDate)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">with {report.tutorName}</p>
                  {report.summary && <p className="mt-2 line-clamp-2 text-sm">{report.summary}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
