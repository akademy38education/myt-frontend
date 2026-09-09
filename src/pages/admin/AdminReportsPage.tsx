import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PERMISSIONS, ReportSeverity, ReportStatus, type Report } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";
import { useComplaints, useAssignComplaint, ResolveComplaintDialog, type ComplaintFilter } from "@/features/admin-complaints";

type TabValue = "ALL" | ReportStatus;

const TABS: { value: TabValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: ReportStatus.OPEN, label: "Open" },
  { value: ReportStatus.UNDER_REVIEW, label: "Under review" },
  { value: ReportStatus.RESOLVED, label: "Resolved" },
  { value: ReportStatus.DISMISSED, label: "Dismissed" },
];

const STATUS_BADGE_VARIANT: Record<ReportStatus, "warning" | "secondary" | "success" | "muted"> = {
  [ReportStatus.OPEN]: "warning",
  [ReportStatus.UNDER_REVIEW]: "secondary",
  [ReportStatus.RESOLVED]: "success",
  [ReportStatus.DISMISSED]: "muted",
};

const SEVERITY_BADGE_VARIANT: Record<ReportSeverity, "muted" | "secondary" | "warning" | "destructive"> = {
  [ReportSeverity.LOW]: "muted",
  [ReportSeverity.MEDIUM]: "secondary",
  [ReportSeverity.HIGH]: "warning",
  [ReportSeverity.CRITICAL]: "destructive",
};

export function AdminReportsPage() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [reportToResolve, setReportToResolve] = useState<Report | null>(null);
  const canManage = usePermission(PERMISSIONS.REPORTS_MANAGE);
  const { user } = useAuth();

  const filter: ComplaintFilter = useMemo(() => (tab === "ALL" ? {} : { status: tab }), [tab]);
  const { data: reports, isLoading, isError, refetch } = useComplaints(filter);
  const assignComplaint = useAssignComplaint();

  async function handleAssignToMe(report: Report) {
    if (!user) return;
    try {
      await assignComplaint.mutateAsync({ id: report.id, input: { adminId: user.id } });
      toast.success("Report assigned to you");
    } catch {
      toast.error("We couldn't assign this report. Please try again.");
    }
  }

  const columns: DataTableColumn<Report>[] = [
    {
      key: "entity",
      header: "Entity",
      sortable: true,
      sortValue: (r) => r.entityType,
      render: (r) => (
        <div>
          <div className="text-sm font-medium">{r.entityType}</div>
          <div className="font-mono text-xs text-muted-foreground">{r.entityLabel ?? r.entityId}</div>
        </div>
      ),
    },
    { key: "reason", header: "Reason", render: (r) => r.reason },
    {
      key: "severity",
      header: "Severity",
      sortable: true,
      sortValue: (r) => r.severity,
      render: (r) => <Badge variant={SEVERITY_BADGE_VARIANT[r.severity]}>{r.severity}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <Badge variant={STATUS_BADGE_VARIANT[r.status]}>{r.status}</Badge>,
    },
    { key: "reporterRole", header: "Reporter", sortable: true, sortValue: (r) => r.reporterRole, render: (r) => r.reporterRole },
    { key: "createdAt", header: "Filed", sortable: true, sortValue: (r) => r.createdAt, render: (r) => formatDate(r.createdAt) },
    {
      key: "actions",
      header: "",
      render: (r) => {
        if (!canManage) return null;
        const isOpen = r.status === ReportStatus.OPEN;
        const isActionable = r.status === ReportStatus.OPEN || r.status === ReportStatus.UNDER_REVIEW;
        return (
          <div className="flex justify-end gap-2">
            {isOpen && (
              <Button size="sm" variant="outline" isLoading={assignComplaint.isPending} onClick={() => handleAssignToMe(r)}>
                Assign to me
              </Button>
            )}
            {isActionable && (
              <Button size="sm" onClick={() => setReportToResolve(r)}>
                Resolve
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Reports & Moderation" description="Review and act on user-filed complaints against reviews, tutors, students, messages and other entities." />

      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <LoadingState label="Loading reports..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {reports && (
        <DataTable
          columns={columns}
          data={reports}
          getRowId={(r) => r.id}
          emptyTitle="No reports found"
          emptyDescription="There are no reports matching this filter."
        />
      )}

      <ResolveComplaintDialog report={reportToResolve} onOpenChange={(open) => !open && setReportToResolve(null)} />
    </div>
  );
}
