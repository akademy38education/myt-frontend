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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useBookings, BookingStatusBadge, isUpcoming, CancelBookingModal, RescheduleBookingModal } from "@/features/bookings";
import { studentsService } from "@/features/students";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";
import type { Booking } from "@myt/shared";
import { BookingStatus } from "@myt/shared";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function TutorBookingsPage() {
  const navigate = useNavigate();
  const { tutorId } = useCurrentTutorProfile();
  const { data: bookings, isLoading, isError, refetch } = useBookings({ tutorId });
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("upcoming");
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);

  const studentIds = Array.from(new Set((bookings ?? []).map((b) => b.studentId)));
  const studentQueries = useQueries({ queries: studentIds.map((id) => ({ queryKey: ["students", id], queryFn: () => studentsService.getProfile(id) })) });
  const studentNameById = new Map(studentQueries.map((q, i) => [studentIds[i], q.data?.fullName ?? "Student"]));

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (tab === "upcoming") return isUpcoming(b);
      if (tab === "cancelled") return b.status === BookingStatus.CANCELLED;
      return b.status === BookingStatus.COMPLETED || b.status === BookingStatus.NO_SHOW;
    });
  }, [bookings, tab]);

  return (
    <div>
      <PageHeader title="Bookings" description="Every lesson booked with you." />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <CardListSkeleton />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && filtered.length === 0 && <EmptyState title={`No ${tab} bookings`} description="Nothing here yet." />}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId;
            const studentName = studentNameById.get(booking.studentId) ?? "Student";
            return (
              <Card key={booking.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback>{initials(studentName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{subjectName}</p>
                        <BookingStatusBadge booking={booking} />
                      </div>
                      <p className="text-sm text-muted-foreground">with {studentName}</p>
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
                    <Button size="sm" variant="outline" onClick={() => navigate(`/tutor/bookings/${booking.id}`)}>
                      View
                    </Button>
                    {isUpcoming(booking) && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setRescheduling(booking)}>
                          Reschedule
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setCancelling(booking)}>
                          Cancel
                        </Button>
                      </>
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
        tutorName=""
        subjectName={cancelling ? SUBJECTS.find((s) => s.id === cancelling.subjectId)?.name ?? "" : ""}
        onOpenChange={(open) => !open && setCancelling(null)}
      />
      <RescheduleBookingModal
        booking={rescheduling}
        tutorName=""
        subjectName={rescheduling ? SUBJECTS.find((s) => s.id === rescheduling.subjectId)?.name ?? "" : ""}
        onOpenChange={(open) => !open && setRescheduling(null)}
      />
    </div>
  );
}
