import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { AlertCircle, BookOpen, CalendarClock, ClipboardList, MessageSquare, Search, Users, Video, Wallet } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";
import { VantaFogBackground } from "@/components/background/VantaFogBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard, useCurrentParentProfile } from "@/features/parents";
import { RecommendationList, WeeklySummaryCard } from "@/features/recommendations";
import { homeworkService } from "@/features/homework";
import { masteryService } from "@/features/mastery";
import { SUBJECTS } from "@/constants/subjects";
import { formatCurrency, formatDate, formatTime, initials, firstName } from "@/utils/formatters";
import { HomeworkStatus } from "@myt/shared";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function subjectName(id: string): string {
  return SUBJECTS.find((s) => s.id === id)?.name ?? id;
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

export function ParentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { parentId } = useCurrentParentProfile();
  const { data, isLoading, isError, refetch } = useParentDashboard(parentId);

  const children = data?.children ?? [];
  const homeworkQueries = useQueries({
    queries: children.map((child) => ({ queryKey: ["homework", child.id], queryFn: () => homeworkService.list(child.id), enabled: Boolean(child.id) })),
  });
  const masteryQueries = useQueries({
    queries: children.map((child) => ({ queryKey: ["mastery", child.id], queryFn: () => masteryService.getSubjectSummaries(child.id), enabled: Boolean(child.id) })),
  });

  const homeworkByChild = new Map(children.map((c, i) => [c.id, homeworkQueries[i]?.data ?? []]));
  const progressByChild = new Map(
    children.map((c, i) => {
      const summaries = masteryQueries[i]?.data ?? [];
      const overall = summaries.length > 0 ? Math.round(summaries.reduce((sum, s) => sum + s.overallPercent, 0) / summaries.length) : null;
      return [c.id, overall];
    })
  );

  const homeworkDueCount = useMemo(
    () =>
      Array.from(homeworkByChild.values())
        .flat()
        .filter((h) => h.status === HomeworkStatus.ASSIGNED || h.status === HomeworkStatus.IN_PROGRESS || h.status === HomeworkStatus.OVERDUE).length,
    [homeworkQueries] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!parentId || isLoading) {
    return (
      <>
        <VantaFogBackground />
        <LoadingState label="Loading your family's dashboard..." />
      </>
    );
  }
  if (isError || !data) {
    return (
      <>
        <VantaFogBackground />
        <ErrorState onRetry={() => refetch()} />
      </>
    );
  }

  const greetName = user ? firstName(user.fullName) : "there";
  const isSingleChild = children.length === 1;

  return (
    <div className="space-y-6">
      <VantaFogBackground />
      <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-7 sm:px-8">
        <AnimatedLearningBackground variant="parent" intensity="subtle" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {greeting()}, {greetName} 👋
            </h1>
            <p className="mt-1.5 text-muted-foreground">Here's how your family is doing.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/parent/find-tutor")}>
            <Search className="h-4 w-4" />
            Find a Tutor
          </Button>
        </div>
      </div>

      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Add your first child to get started"
          description="Once you add a child, you'll see their lessons, progress and homework here."
          actionLabel="Add Child"
          onAction={() => navigate("/parent/children")}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewTile to="/parent/children" label="Children" value={String(children.length)} />
            <OverviewTile to="/parent/lessons" label="Upcoming lessons" value={String(data.upcomingSessionsCount)} />
            <OverviewTile to="/parent/children" label="Homework to review" value={String(homeworkDueCount)} />
            <OverviewTile to="/parent/payments" label="This month" value={formatCurrency(data.thisMonthSpending, data.currency)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecommendationList />
            </div>
            <WeeklySummaryCard />
          </div>

          {data.attentionItems.length > 0 && (
            <Card className="border-warning/40 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-base">Things to review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.attentionItems.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className={isSingleChild ? "sr-only" : "mb-3 text-lg font-semibold"}>{isSingleChild ? "Your child" : "Your children"}</h2>
            <div className={`grid gap-4 ${isSingleChild ? "" : "sm:grid-cols-2"}`}>
              {children.map((child) => {
                const homework = homeworkByChild.get(child.id) ?? [];
                const pendingHomework = homework.filter((h) => h.status === HomeworkStatus.ASSIGNED || h.status === HomeworkStatus.IN_PROGRESS).length;
                const overallProgress = progressByChild.get(child.id);
                const nextForChild = data.nextLesson?.childId === child.id ? data.nextLesson : null;

                return (
                  <Card key={child.id} className="myt-card-hover">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{initials(child.fullName ?? "Student")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{child.fullName}</p>
                          <p className="text-sm text-muted-foreground">{child.yearGroup}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {child.subjects.map((id) => (
                          <Badge key={id} variant="outline">
                            {subjectName(id)}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="font-semibold">{overallProgress !== null ? `${overallProgress}%` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Next lesson</p>
                          <p className="font-semibold">{nextForChild ? formatDate(nextForChild.scheduledStart) : "None"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Homework</p>
                          <p className="font-semibold">{pendingHomework} pending</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(`/parent/children/${child.id}`)}>
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
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
                        onClick={() => navigate(`/parent/bookings/${item.bookingId}`)}
                        className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-14 shrink-0 text-sm font-medium tabular-nums">{formatTime(item.scheduledStart)}</span>
                          <div>
                            <p className="text-sm font-medium">{item.childName}</p>
                            <p className="text-xs text-muted-foreground">
                              {subjectName(item.subjectId)} with {item.tutorName}
                            </p>
                          </div>
                        </div>
                      </button>
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
                  <Link to="/parent/calendar" className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs font-medium hover:bg-muted/50">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Calendar
                  </Link>
                  <Link to="/parent/messages" className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs font-medium hover:bg-muted/50">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Messages
                  </Link>
                  <Link to="/parent/reports" className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs font-medium hover:bg-muted/50">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Reports
                  </Link>
                  <Link to="/parent/payments" className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs font-medium hover:bg-muted/50">
                    <Wallet className="h-4 w-4 text-primary" />
                    Payments
                  </Link>
                </CardContent>
              </Card>

              {data.nextLesson && (
                <Card className="myt-card-hover overflow-hidden border-primary/30">
                  <div className="bg-gradient-brand p-5 text-white">
                    <p className="text-xs font-medium uppercase tracking-wide text-white/80">Next lesson</p>
                    <p className="mt-1 text-lg font-semibold">{data.nextLesson.childName}</p>
                    <p className="text-sm text-white/90">{subjectName(data.nextLesson.subjectId)} with {data.nextLesson.tutorName}</p>
                  </div>
                  <CardContent className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(data.nextLesson.scheduledStart)} · {formatTime(data.nextLesson.scheduledStart)}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/parent/bookings/${data.nextLesson!.bookingId}`)}>
                      <Video className="h-4 w-4" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Array.from(homeworkByChild.entries())
                    .flatMap(([childId, items]) => items.filter((h) => h.status !== HomeworkStatus.REVIEWED).map((h) => ({ ...h, childId })))
                    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
                    .slice(0, 4)
                    .map((h) => (
                      <div key={h.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{h.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(h.dueAt)}</span>
                      </div>
                    ))}
                  {Array.from(homeworkByChild.values()).flat().length === 0 && <p className="text-sm text-muted-foreground">Nothing due right now.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
