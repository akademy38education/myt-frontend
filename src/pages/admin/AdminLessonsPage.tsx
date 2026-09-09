import type { Lesson } from "@myt/shared";
import { LessonStatus, PERMISSIONS } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ForbiddenState } from "@/components/shared/ForbiddenState";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAdminLessons } from "@/features/admin-bookings";
import { usePermission } from "@/hooks/usePermission";
import { formatDateTime } from "@/utils/formatters";

function lessonStatusVariant(status: LessonStatus): "success" | "warning" | "destructive" | "outline" {
  if (status === LessonStatus.COMPLETED) return "success";
  if (status === LessonStatus.IN_PROGRESS) return "warning";
  if (status === LessonStatus.SCHEDULED) return "outline";
  return "destructive"; // CANCELLED, MISSED
}

export function AdminLessonsPage() {
  const canView = usePermission(PERMISSIONS.BOOKINGS_VIEW);
  const { data: lessons, isLoading, isError, refetch } = useAdminLessons();

  const columns: DataTableColumn<Lesson>[] = [
    { key: "bookingId", header: "Booking", render: (l) => <span className="font-mono text-xs">{l.bookingId}</span> },
    { key: "status", header: "Status", render: (l) => <Badge variant={lessonStatusVariant(l.status)}>{l.status}</Badge> },
    {
      key: "startedAt",
      header: "Started",
      sortable: true,
      sortValue: (l) => l.startedAt ?? "",
      render: (l) => (l.startedAt ? formatDateTime(l.startedAt) : "—"),
    },
    {
      key: "endedAt",
      header: "Ended",
      sortable: true,
      sortValue: (l) => l.endedAt ?? "",
      render: (l) => (l.endedAt ? formatDateTime(l.endedAt) : "—"),
    },
  ];

  if (!canView) return <ForbiddenState />;

  return (
    <div>
      <PageHeader
        title="Lessons"
        description="Live-classroom sessions that have actually started. A booking only appears here once its lesson session begins, so most confirmed bookings won't have one yet — that's expected, not an error."
      />

      {isLoading && <LoadingState label="Loading lessons..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={lessons ?? []}
          getRowId={(l) => l.id}
          emptyTitle="No lessons yet"
          emptyDescription="A lesson record is only created once a booking's classroom session actually starts. Most bookings are still just scheduled or completed without ever opening the classroom, so an empty list here is normal."
        />
      )}
    </div>
  );
}
