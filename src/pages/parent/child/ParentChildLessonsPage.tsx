import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import type { StudentProfile } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { Calendar, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookings, isUpcoming, BookingStatusBadge } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime } from "@/utils/formatters";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function ParentChildLessonsPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();
  const navigate = useNavigate();
  const { data: bookings } = useBookings({ studentId: child.id });
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("upcoming");

  const tutorIds = Array.from(new Set((bookings ?? []).map((b) => b.tutorId)));
  const tutorQueries = useQueries({ queries: tutorIds.map((id) => ({ queryKey: ["tutors", id], queryFn: () => tutorsService.getById(id) })) });
  const tutorNameById = new Map(tutorQueries.map((q, i) => [tutorIds[i], q.data?.headline ?? "Tutor"]));

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
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${tab} lessons`} description="Nothing here yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? booking.subjectId}</p>
                    <BookingStatusBadge booking={booking} />
                  </div>
                  <p className="text-sm text-muted-foreground">with {tutorNameById.get(booking.tutorId) ?? "Tutor"}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                <Button size="sm" variant="outline" onClick={() => navigate(`/parent/bookings/${booking.id}`)}>
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
