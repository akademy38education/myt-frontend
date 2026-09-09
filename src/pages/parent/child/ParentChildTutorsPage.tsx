import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import type { StudentProfile } from "@myt/shared";
import { BookingStatus } from "@myt/shared";
import { GraduationCap, MessageSquare, Star } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useBookings, isUpcoming } from "@/features/bookings";
import { tutorsService } from "@/features/tutors";
import { formatDate, initials } from "@/utils/formatters";

export function ParentChildTutorsPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();
  const navigate = useNavigate();
  const { data: bookings } = useBookings({ studentId: child.id });

  const tutorIds = Array.from(new Set((bookings ?? []).map((b) => b.tutorId)));
  const tutorQueries = useQueries({ queries: tutorIds.map((id) => ({ queryKey: ["tutors", id], queryFn: () => tutorsService.getById(id) })) });

  const rows = useMemo(() => {
    return tutorIds.map((tutorId, i) => {
      const tutorBookings = (bookings ?? []).filter((b) => b.tutorId === tutorId);
      const upcoming = tutorBookings.filter(isUpcoming).sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))[0];
      const past = tutorBookings
        .filter((b) => b.status === BookingStatus.COMPLETED)
        .sort((a, b) => b.scheduledStart.localeCompare(a.scheduledStart))[0];
      return { tutor: tutorQueries[i]?.data, tutorId, upcoming, past };
    });
  }, [tutorIds, bookings, tutorQueries]);

  if (rows.length === 0) {
    return <EmptyState icon={GraduationCap} title="No tutors yet" description={`Tutors teaching ${child.fullName ?? "your child"} will appear here once a lesson is booked.`} />;
  }

  return (
    <div className="space-y-3">
      {rows.map(({ tutor, tutorId, upcoming, past }) => (
        <Card key={tutorId}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback>{initials(tutor?.headline ?? "Tutor")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{tutor?.headline ?? "Tutor"}</p>
                {tutor && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-warning" />
                    {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews)
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {upcoming ? `Next lesson ${formatDate(upcoming.scheduledStart)}` : past ? `Last lesson ${formatDate(past.scheduledStart)}` : "No lessons yet"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate(`/parent/tutors/${tutorId}`)}>
                View Profile
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/parent/messages")}>
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button size="sm" onClick={() => navigate(`/parent/tutors/${tutorId}/book?childId=${child.id}`)}>
                Book Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
