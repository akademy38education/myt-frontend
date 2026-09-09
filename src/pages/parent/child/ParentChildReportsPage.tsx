import { Link, useOutletContext } from "react-router-dom";
import type { StudentProfile } from "@myt/shared";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { useReports } from "@/features/reports";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate } from "@/utils/formatters";

export function ParentChildReportsPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();
  const { data: reports, isLoading } = useReports({ childId: child.id });

  if (isLoading) return <LoadingState label="Loading reports..." />;

  if (!reports || reports.length === 0) {
    return <EmptyState icon={FileText} title="No reports yet" description={`Tutor lesson reports for ${child.fullName ?? "your child"} will appear here after a lesson is completed.`} />;
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => (
        <Link key={report.bookingId} to={`/parent/reports/${report.bookingId}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{SUBJECTS.find((s) => s.id === report.subjectId)?.name ?? report.subjectId}</p>
                <p className="text-xs text-muted-foreground">{formatDate(report.lessonDate)}</p>
              </div>
              <p className="text-sm text-muted-foreground">with {report.tutorName}</p>
              {report.summary && <p className="mt-2 line-clamp-2 text-sm">{report.summary}</p>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
