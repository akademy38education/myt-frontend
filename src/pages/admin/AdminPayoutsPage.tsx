import { useState } from "react";
import type { EarningsEntry, EarningsStatus, Payout, PayoutStatus } from "@myt/shared";
import { PERMISSIONS } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ForbiddenState } from "@/components/shared/ForbiddenState";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAdminPayouts, useAdminEarningsEntries } from "@/features/admin-payments";
import { usePermission } from "@/hooks/usePermission";
import { formatCurrency, formatDate } from "@/utils/formatters";

const TABS = [
  { value: "payouts", label: "Payouts" },
  { value: "entries", label: "Earnings entries" },
] as const;

function payoutStatusVariant(status: PayoutStatus): "success" | "warning" | "destructive" | "outline" {
  if (status === "paid") return "success";
  if (status === "processing") return "outline";
  if (status === "failed") return "destructive";
  return "warning"; // pending
}

function earningsStatusVariant(status: EarningsStatus): "success" | "warning" | "outline" {
  if (status === "paid") return "success";
  if (status === "available") return "outline";
  return "warning"; // pending
}

export function AdminPayoutsPage() {
  const canView = usePermission(PERMISSIONS.PAYOUTS_VIEW);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("payouts");
  const { data: payouts, isLoading: payoutsLoading, isError: payoutsError, refetch: refetchPayouts } = useAdminPayouts();
  const { data: entries, isLoading: entriesLoading, isError: entriesError, refetch: refetchEntries } = useAdminEarningsEntries();

  const payoutColumns: DataTableColumn<Payout>[] = [
    { key: "tutorId", header: "Tutor", render: (p) => <span className="font-mono text-xs">{p.tutorId}</span> },
    { key: "amount", header: "Amount", sortable: true, sortValue: (p) => p.amount, render: (p) => formatCurrency(p.amount, p.currency) },
    { key: "period", header: "Period", render: (p) => `${formatDate(p.periodStart)} – ${formatDate(p.periodEnd)}` },
    { key: "status", header: "Status", render: (p) => <Badge variant={payoutStatusVariant(p.status)}>{p.status}</Badge> },
    {
      key: "paidAt",
      header: "Paid",
      sortable: true,
      sortValue: (p) => p.paidAt ?? "",
      render: (p) => (p.paidAt ? formatDate(p.paidAt) : "—"),
    },
  ];

  const entryColumns: DataTableColumn<EarningsEntry>[] = [
    { key: "tutorId", header: "Tutor", render: (e) => <span className="font-mono text-xs">{e.tutorId}</span> },
    { key: "bookingId", header: "Booking", render: (e) => <span className="font-mono text-xs">{e.bookingId}</span> },
    { key: "lessonDate", header: "Lesson date", sortable: true, sortValue: (e) => e.lessonDate, render: (e) => formatDate(e.lessonDate) },
    { key: "grossAmount", header: "Gross", render: (e) => formatCurrency(e.grossAmount, e.currency) },
    { key: "netAmount", header: "Net", render: (e) => formatCurrency(e.netAmount, e.currency) },
    { key: "status", header: "Status", render: (e) => <Badge variant={earningsStatusVariant(e.status)}>{e.status}</Badge> },
  ];

  if (!canView) return <ForbiddenState />;

  return (
    <div>
      <PageHeader title="Payouts" description="Tutor payouts, and the underlying earnings entries they're built from." />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {tab === "payouts" && (
        <>
          {payoutsLoading && <LoadingState label="Loading payouts..." />}
          {payoutsError && <ErrorState onRetry={() => refetchPayouts()} />}
          {!payoutsLoading && !payoutsError && (
            <DataTable
              columns={payoutColumns}
              data={payouts ?? []}
              getRowId={(p) => p.id}
              emptyTitle="No payouts yet"
              emptyDescription="Payouts appear here once a tutor's settled earnings are paid out."
            />
          )}
        </>
      )}

      {tab === "entries" && (
        <>
          {entriesLoading && <LoadingState label="Loading earnings entries..." />}
          {entriesError && <ErrorState onRetry={() => refetchEntries()} />}
          {!entriesLoading && !entriesError && (
            <DataTable
              columns={entryColumns}
              data={entries ?? []}
              getRowId={(e) => e.id}
              emptyTitle="No earnings entries yet"
              emptyDescription="An entry is generated once a booking completes and its lesson is paid for."
            />
          )}
        </>
      )}
    </div>
  );
}
