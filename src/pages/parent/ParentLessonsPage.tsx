import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Calendar, Clock, MessageSquare, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookingStatusBadge, isUpcoming, bookingsService } from "@/features/bookings";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { tutorsService } from "@/features/tutors";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime, initials } from "@/utils/formatters";
import type { Booking } from "@myt/shared";

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function ParentLessonsPage() {
  const navigate = useNavigate();
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading: isChildrenLoading } = useChildren(parentId);

  const bookingQueries = useQueries({
    queries: (children ?? []).map((child) => ({
      queryKey: ["bookings", { studentId: child.id }],
      queryFn: () => bookingsService.list({ studentId: child.id }),
      enabled: Boolean(child.id),
    })),
  });

  const allBookings: Array<Booking & { childName: string }> = useMemo(() => {
    return (children ?? []).flatMap((child, i) => (bookingQueries[i]?.data ?? []).map((b) => ({ ...b, childName: child.fullName ?? "Student" })));
  }, [children, bookingQueries]);

  const tutorIds = Array.from(new Set(allBookings.map((b) => b.tutorId)));
  const tutorQueries = useQueries({ queries: tutorIds.map((id) => ({ queryKey: ["tutors", id], queryFn: () => tutorsService.getById(id) })) });
  const tutorNameById = new Map(tutorQueries.map((q, i) => [tutorIds[i], q.data?.headline ?? "Tutor"]));

  const isLoading = isChildrenLoading || bookingQueries.some((q) => q.isLoading);
  const today = allBookings.filter((b) => isToday(b.scheduledStart)).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));
  const upcoming = allBookings.filter((b) => isUpcoming(b) && !isToday(b.scheduledStart)).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart));

  if (!parentId || isLoading) return <LoadingState label="Loading your family's lessons..." />;

  function LessonRow({ booking }: { booking: Booking & { childName: string } }) {
    return (
      <Card key={booking.id}>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials(booking.childName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{booking.childName}</p>
                <BookingStatusBadge booking={booking} />
              </div>
              <p className="text-sm text-muted-foreground">
                {SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId} with {tutorNameById.get(booking.tutorId) ?? "Tutor"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
          <div className="flex flex-wrap gap-2">
            {isUpcoming(booking) && (
              <Button size="sm" onClick={() => navigate(`/parent/bookings/${booking.id}`)}>
                <Video className="h-4 w-4" />
                View
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate("/parent/messages")}>
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Lessons" description="Every upcoming lesson across your family, in one place." />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Today</h2>
        {today.length === 0 ? <EmptyState title="No lessons today" className="py-8" /> : <div className="space-y-3">{today.map((b) => <LessonRow key={b.id} booking={b} />)}</div>}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? <EmptyState title="Nothing else booked" className="py-8" /> : <div className="space-y-3">{upcoming.map((b) => <LessonRow key={b.id} booking={b} />)}</div>}
      </div>
    </div>
  );
}
