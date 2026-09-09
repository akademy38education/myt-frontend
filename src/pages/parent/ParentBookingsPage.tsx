import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Calendar, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CardListSkeleton } from "@/components/shared/CardListSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/features/parents";
import { bookingsService, BookingStatusBadge, isUpcoming, CancelBookingModal } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";
import type { Booking } from "@myt/shared";

export function ParentBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboard, isLoading: isChildrenLoading } = useParentDashboard(user?.id ?? "");
  const [childId, setChildId] = useState<string | undefined>(undefined);
  const [cancelling, setCancelling] = useState<Booking | null>(null);

  const children = useMemo(() => dashboard?.children ?? [], [dashboard]);
  const bookingQueries = useQueries({
    queries: children.map((child) => ({
      queryKey: ["bookings", { studentId: child.id }],
      queryFn: () => bookingsService.list({ studentId: child.id }),
      enabled: children.length > 0,
    })),
  });
  const isLoading = isChildrenLoading || bookingQueries.some((q) => q.isLoading);
  const isError = bookingQueries.some((q) => q.isError);

  const allBookings = useMemo(() => {
    return bookingQueries.flatMap((q, i) => (q.data ?? []).map((b) => ({ booking: b, childName: children[i]?.fullName ?? children[i]?.yearGroup ?? "Child" })));
  }, [bookingQueries, children]);

  const filtered = allBookings
    .filter((row) => !childId || row.booking.studentId === childId)
    .sort((a, b) => a.booking.scheduledStart.localeCompare(b.booking.scheduledStart));

  const tutorIds = Array.from(new Set(filtered.map((row) => row.booking.tutorId)));
  const tutorQueries = useQueries({ queries: tutorIds.map((id) => ({ queryKey: ["tutors", id], queryFn: () => tutorsService.getById(id) })) });
  const tutorNameById = new Map(tutorQueries.map((q, i) => [tutorIds[i], q.data?.headline ?? "Tutor"]));

  return (
    <div>
      <PageHeader title="Bookings" description="Every lesson booked for your children." />

      <div className="mb-6 max-w-xs">
        <Select value={childId ?? "all"} onValueChange={(v) => setChildId(v === "all" ? undefined : v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Children" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.fullName ?? child.yearGroup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <CardListSkeleton />}
      {isError && <ErrorState onRetry={() => window.location.reload()} />}
      {!isLoading && !isError && filtered.length === 0 && <EmptyState title="No bookings yet" description="Once a lesson is booked for your child, it'll appear here." />}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(({ booking, childName }) => {
            const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
            return (
              <Card key={booking.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback>{initials(childName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{subjectName}</p>
                        <BookingStatusBadge booking={booking} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {childName} · with {tutorNameById.get(booking.tutorId) ?? "Tutor"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateTime(booking.scheduledStart)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/parent/bookings/${booking.id}`)}>
                      View
                    </Button>
                    {isUpcoming(booking) && (
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setCancelling(booking)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CancelBookingModal
        booking={cancelling}
        tutorName={cancelling ? tutorNameById.get(cancelling.tutorId) ?? "" : ""}
        subjectName={cancelling ? SUBJECTS.find((s) => s.id === cancelling.subjectId)?.name ?? "" : ""}
        onOpenChange={(open) => !open && setCancelling(null)}
      />
    </div>
  );
}
