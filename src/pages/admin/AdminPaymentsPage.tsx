import { useState } from "react";
import type { Payment } from "@myt/shared";
import { PaymentStatus, PERMISSIONS } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ForbiddenState } from "@/components/shared/ForbiddenState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAdminPayments, RefundPaymentDialog } from "@/features/admin-payments";
import { usePermission } from "@/hooks/usePermission";
import { formatCurrency, formatDate } from "@/utils/formatters";

const STATUS_FILTERS: Array<{ value: PaymentStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: PaymentStatus.PENDING, label: "Pending" },
  { value: PaymentStatus.AUTHORIZED, label: "Authorized" },
  { value: PaymentStatus.PAID, label: "Paid" },
  { value: PaymentStatus.FAILED, label: "Failed" },
  { value: PaymentStatus.REFUNDED, label: "Refunded" },
  { value: PaymentStatus.PARTIALLY_REFUNDED, label: "Partially refunded" },
];

const REFUNDABLE = new Set<PaymentStatus>([PaymentStatus.PAID, PaymentStatus.PARTIALLY_REFUNDED]);

function paymentStatusVariant(status: PaymentStatus): "success" | "warning" | "destructive" | "outline" | "muted" {
  if (status === PaymentStatus.PAID) return "success";
  if (status === PaymentStatus.PARTIALLY_REFUNDED) return "warning";
  if (status === PaymentStatus.FAILED) return "destructive";
  if (status === PaymentStatus.REFUNDED) return "muted";
  return "outline"; // PENDING, AUTHORIZED
}

export function AdminPaymentsPage() {
  const canView = usePermission(PERMISSIONS.PAYMENTS_VIEW);
  const canRefund = usePermission(PERMISSIONS.PAYMENTS_REFUND);
  const [status, setStatus] = useState<PaymentStatus | "all">("all");
  const [childId, setChildId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [refunding, setRefunding] = useState<Payment | null>(null);

  const { data: payments, isLoading, isError, refetch } = useAdminPayments({
    status: status === "all" ? undefined : status,
    childId: childId.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const columns: DataTableColumn<Payment>[] = [
    { key: "reference", header: "Reference", render: (p) => <span className="font-mono text-xs">{p.reference ?? p.id}</span> },
    { key: "payerId", header: "Payer", render: (p) => <span className="font-mono text-xs">{p.payerId}</span> },
    { key: "studentId", header: "Student", render: (p) => <span className="font-mono text-xs">{p.studentId ?? "—"}</span> },
    { key: "amount", header: "Amount", sortable: true, sortValue: (p) => p.amount, render: (p) => formatCurrency(p.amount, p.currency) },
    { key: "status", header: "Status", render: (p) => <Badge variant={paymentStatusVariant(p.status)}>{p.status}</Badge> },
    {
      key: "date",
      header: "Date",
      sortable: true,
      sortValue: (p) => p.lessonDate ?? p.createdAt,
      render: (p) => formatDate(p.lessonDate ?? p.createdAt),
    },
  ];

  if (canRefund) {
    columns.push({
      key: "actions",
      header: "",
      render: (p) =>
        REFUNDABLE.has(p.status) ? (
          <Button size="sm" variant="outline" onClick={() => setRefunding(p)}>
            Refund
          </Button>
        ) : null,
    });
  }

  if (!canView) return <ForbiddenState />;

  return (
    <div>
      <PageHeader title="Payments" description="Every payment made on the platform, across all payers." />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus | "all")}>
            <SelectTrigger className="mt-1.5">
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
        </div>
        <div>
          <Label htmlFor="payment-child">Student ID</Label>
          <Input id="payment-child" value={childId} onChange={(e) => setChildId(e.target.value)} placeholder="student-1" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="payment-from">From</Label>
          <Input id="payment-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="payment-to">To</Label>
          <Input id="payment-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1.5" />
        </div>
      </div>

      {isLoading && <LoadingState label="Loading payments..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={payments ?? []}
          getRowId={(p) => p.id}
          emptyTitle="No payments match these filters"
          emptyDescription="Try widening the status or date range."
        />
      )}

      <RefundPaymentDialog payment={refunding} onOpenChange={(open) => !open && setRefunding(null)} />
    </div>
  );
}
