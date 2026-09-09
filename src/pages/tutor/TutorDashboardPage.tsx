import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Clock3, Wallet, Video, CalendarDays, ClipboardList, UploadCloud } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";
import { VantaTopologyBackground } from "@/components/background/VantaTopologyBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentTutorProfile, useTutorDashboard } from "@/features/tutors";
import { useBookings, isUpcoming } from "@/features/bookings";
import { RecommendationList, WeeklySummaryCard } from "@/features/recommendations";
import { SUBJECTS } from "@/constants/subjects";
import { formatCurrency, formatTime, formatDate, initials, firstName } from "@/utils/formatters";
import { BookingStatus } from "@myt/shared";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function subjectName(id: string): string {
  return SUBJECTS.find((s) => s.id === id)?.name ?? id;
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs font-medium transition-colors hover:bg-muted/50">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}

function ScheduleStatusBadge({ status }: { status: BookingStatus }) {
  if (status === BookingStatus.COMPLETED) return <Badge variant="success">Completed</Badge>;
  if (status === BookingStatus.PENDING) return <Badge variant="warning">Pending</Badge>;
  return <Badge variant="outline">Confirmed</Badge>;
}

function OverviewTile({ to, label, value }: { to: string; label: string; value: string }) {
  return (
    <Link to={to}>
      <Card className="myt-card-hover cursor-pointer">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function TutorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tutorId, data: tutor } = useCurrentTutorProfile();
  const { data, isLoading, isError, refetch } = useTutorDashboard(tutorId);
  const { data: bookings } = useBookings({ tutorId });

  const upcomingLessons = useMemo(() => {
    if (!bookings) return [];
    return [...bookings]
      .filter(isUpcoming)
      .sort((a, b) => a.scheduledStart.localeCompare(b.scheduledStart))
      .slice(0, 6);
  }, [bookings]);

  if (!tutorId || isLoading) {
    return (
      <>
        <VantaTopologyBackground />
        <LoadingState label="Loading your dashboard..." />
      </>
    );
  }
  if (isError || !data) {
    return (
      <>
        <VantaTopologyBackground />
        <ErrorState onRetry={() => refetch()} />
      </>
    );
  }

  const greetName = user ? firstName(user.fullName) : "there";
  const currency = tutor?.currency ?? "GBP";

  return (
    <div className="space-y-6">
      <VantaTopologyBackground />
      <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-7 sm:px-8">
        <AnimatedLearningBackground variant="tutor" intensity="subtle" />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting()}, {greetName} 👋
          </h1>
          <p className="mt-1.5 text-muted-foreground">Here's what's happening with your teaching today.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewTile to="/tutor/lessons" label="Today's lessons" value={String(data.todaysLessonsCount)} />
        <OverviewTile to="/tutor/students" label="Students today" value={String(data.todaysStudentsCount)} />
        <OverviewTile to="/tutor/calendar" label="Teaching time" value={`${Math.floor(data.todaysTeachingMinutes / 60)}h ${data.todaysTeachingMinutes % 60}m`} />
        <OverviewTile to="/tutor/earnings" label="Today's earnings" value={formatCurrency(data.todaysEarnings, currency)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationList />
        </div>
        <WeeklySummaryCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {data.nextLesson ? (
            <Card className="myt-card-hover overflow-hidden border-primary/30">
              <div className="bg-gradient-brand p-5 text-white">
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">Next lesson</p>
                <p className="mt-1 text-xl font-semibold">{data.nextLesson.studentName}</p>
                <p className="text-sm text-white/90">{subjectName(data.nextLesson.subjectId)}</p>
              </div>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {formatDate(data.nextLesson.scheduledStart)} · {formatTime(data.nextLesson.scheduledStart)}–{formatTime(data.nextLesson.scheduledEnd)}
                </p>
                <Button onClick={() => navigate(`/tutor/classroom/${data.nextLesson!.bookingId}`)}>
                  <Video className="h-4 w-4" />
                  Open Lesson
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="No upcoming lessons" description="Your calendar is clear for now." />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Today's schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.todaysSchedule.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No lessons scheduled for today.</p>
              ) : (
                data.todaysSchedule.map((item) => (
                  <button
                    key={item.bookingId}
                    onClick={() => navigate(`/tutor/bookings/${item.bookingId}`)}
                    className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-14 shrink-0 text-sm font-medium tabular-nums">{formatTime(item.scheduledStart)}</span>
                      <div>
                        <p className="text-sm font-medium">{subjectName(item.subjectId)}</p>
                        <p className="text-xs text-muted-foreground">{item.studentName}</p>
                      </div>
                    </div>
                    <ScheduleStatusBadge status={item.status} />
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingLessons.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Nothing booked yet.</p>
              ) : (
                upcomingLessons.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between rounded-md border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{subjectName(booking.subjectId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(booking.scheduledStart)} · {formatTime(booking.scheduledStart)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/tutor/bookings/${booking.id}`)}>
                      View
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickAction to="/tutor/availability" icon={Clock3} label="Availability" />
              <QuickAction to="/tutor/calendar" icon={CalendarDays} label="Calendar" />
              <QuickAction to="/tutor/students" icon={Users} label="Students" />
              <QuickAction to="/tutor/earnings" icon={Wallet} label="Earnings" />
              <QuickAction to="/tutor/resources" icon={UploadCloud} label="Resources" />
              <QuickAction to="/tutor/homework" icon={ClipboardList} label="Homework" />
            </CardContent>
          </Card>

          <Card className="myt-card-hover">
            <CardHeader>
              <CardTitle className="text-base">Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">This month</p>
                <p className="text-xl font-semibold">{formatCurrency(data.earningsThisMonth, currency)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="This week" value={formatCurrency(data.earningsThisWeek, currency)} />
                <Stat label="Pending" value={formatCurrency(data.earningsPending, currency)} />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/tutor/earnings")}>
                View earnings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">This week</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Stat label="Lessons" value={data.lessonsThisWeek} />
              <Stat label="Hours taught" value={`${data.hoursTaughtThisWeek}h`} />
              <Stat label="Completion rate" value={`${data.completionRate}%`} />
              <Stat label="Avg rating" value={data.averageRating.toFixed(1)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {data.recentStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your students will appear here once you start teaching.</p>
              ) : (
                data.recentStudents.map((s) => (
                  <Link key={s.studentId} to={`/tutor/students/${s.studentId}`} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials(s.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{subjectName(s.subjectId)}</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
