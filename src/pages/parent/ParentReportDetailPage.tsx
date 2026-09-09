import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReportDetail, reportsService } from "@/features/reports";
import { SUBJECTS } from "@/constants/subjects";
import { formatDate } from "@/utils/formatters";

export function ParentReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, isError, refetch } = useReportDetail(id ?? "");

  async function handleDownload() {
    if (!id) return;
    const text = await reportsService.exportOne(id);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) return <LoadingState label="Loading report..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!report) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/parent/reports")}>
        <ArrowLeft className="h-4 w-4" />
        Back to reports
      </Button>

      <PageHeader
        title={SUBJECTS.find((s) => s.id === report.subjectId)?.name ?? report.subjectId}
        description={`${formatDate(report.lessonDate)} · with ${report.tutorName}`}
        actions={
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        }
      />

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Lesson summary</h2>
            <p className="text-sm text-muted-foreground">{report.summary}</p>
          </CardContent>
        </Card>

        {report.objectives && report.objectives.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-2 font-semibold">Topics covered</h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {report.objectives.map((o) => (
                  <li key={o}>• {o}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {report.nextSteps && report.nextSteps.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-2 font-semibold">Recommended next steps</h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {report.nextSteps.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Duration</h2>
            <p className="text-sm text-muted-foreground">{report.durationMinutes} minutes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
