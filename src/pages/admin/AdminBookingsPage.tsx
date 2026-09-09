import { useMemo, useState } from "react";
import type { Booking } from "@myt/shared";
import { BookingStatus, PaymentStatus, PERMISSIONS } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ForbiddenState } from "@/components/shared/ForbiddenState";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useAdminBookings } from "@/features/admin-bookings";
import { usePermission } from "@/hooks/usePermission";
import { SUBJECTS } from "@/constants/subjects";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

const STATUS_FILTERS: Array<{ value: BookingStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: BookingStatus.PENDING, label: "Pending" },
  { value: BookingStatus.CONFIRMED, label: "Confirmed" },
  { value: BookingStatus.RESCHEDULED, label: "Rescheduled" },
  { value: BookingStatus.COMPLETED, label: "Completed" },
  { value: BookingStatus.CANCELLED, label: "Cancelled" },
  { value: BookingStatus.NO_SHOW, label: "No show" },
];

function bookingStatusVariant(status: BookingStatus): "success" | "warning" | "destructive" | "outline" | "secondary" {
  if (status === BookingStatus.CONFIRMED) return "success";
  if (status === BookingStatus.PENDING) return "warning";
  if (status === BookingStatus.RESCHEDULED) return "outline";
  if (status === BookingStatus.COMPLETED) return "secondary";
  return "destructive"; // CANCELLED, NO_SHOW
}

function paymentStatusVariant(status: PaymentStatus): "success" | "warning" | "destructive" | "outline" | "muted" {
  if (status === PaymentStatus.PAID) return "success";
  if (status === PaymentStatus.PARTIALLY_REFUNDED) return "warning";
  if (status === PaymentStatus.FAILED) return "destructive";
  if (status === PaymentStatus.REFUNDED) return "muted";
  return "outline"; // PENDING, AUTHORIZED
}

export function AdminBookingsPage() {
  const canView = usePermission(PERMISSIONS.BOOKINGS_VIEW);
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [studentId, setStudentId] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: bookings, isLoading, isError, refetch } = useAdminBookings({
    status: status === "all" ? undefined : status,
    studentId: studentId.trim() || undefined,
    tutorId: tutorId.trim() || undefined,
  });

  // GET /admin/bookings only accepts status/studentId/tutorId as query
  // params (no date range) — the date-range filter is applied here,
  // client-side, over whatever page of results those params already
  // narrowed down.
  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const day = b.scheduledStart.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      return true;
    });
  }, [bookings, from, to]);

  const columns: DataTableColumn<Booking>[] = [
    { key: "studentId", header: "Student", render: (b) => <span className="font-mono text-xs">{b.studentId}</span> },
    { key: "tutorId", header: "Tutor", render: (b) => <span className="font-mono text-xs">{b.tutorId}</span> },
    { key: "subject", header: "Subject", render: (b) => SUBJECTS.find((s) => s.id === b.subjectId)?.name ?? b.subjectId },
    {
      key: "scheduledStart",
      header: "Scheduled",
      sortable: true,
      sortValue: (b) => b.scheduledStart,
      render: (b) => formatDateTime(b.scheduledStart),
    },
    { key: "status", header: "Status", render: (b) => <Badge variant={bookingStatusVariant(b.status)}>{b.status}</Badge> },
    { key: "paymentStatus", header: "Payment", render: (b) => <Badge variant={paymentStatusVariant(b.paymentStatus)}>{b.paymentStatus}</Badge> },
    {
      key: "priceTotal",
      header: "Price",
      sortable: true,
      sortValue: (b) => b.priceTotal,
      render: (b) => formatCurrency(b.priceTotal, b.currency),
    },
  ];

  if (!canView) return <ForbiddenState />;

  return (
    <div>
      <PageHeader title="Bookings" description="Every lesson booked on the platform, across all students and tutors." />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus | "all")}>
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
          <Label htmlFor="booking-student">Student ID</Label>
          <Input id="booking-student" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="student-1" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="booking-tutor">Tutor ID</Label>
          <Input id="booking-tutor" value={tutorId} onChange={(e) => setTutorId(e.target.value)} placeholder="tutor-1" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="booking-from">From</Label>
          <Input id="booking-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="booking-to">To</Label>
          <Input id="booking-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1.5" />
        </div>
      </div>

      {isLoading && <LoadingState label="Loading bookings..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(b) => b.id}
          emptyTitle="No bookings match these filters"
          emptyDescription="Try widening the status, id or date range filters."
        />
      )}
    </div>
  );
}
