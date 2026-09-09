import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, Dumbbell, ArrowRight, BookOpen, Flame, CheckCircle2, FileCheck2, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";
import { ProgressRing } from "@/components/shared/decor";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentStudentProfile, computeNextBestAction, computeRecentActivity, NextBestAction, type RecentActivityKind } from "@/features/students";
import { useLessons, StudentLessonCard } from "@/features/lessons";
import { useHomeworkList } from "@/features/homework";
import { useSubjectMastery } from "@/features/mastery";
import { useGoals } from "@/features/goals";
import { useLearningProfile } from "@/features/learning";
import { AchievementsList } from "@/features/achievements";
import { RecommendationList, WeeklySummaryCard } from "@/features/recommendations";
import { formatDateTime, formatRelativeToNow, firstName } from "@/utils/formatters";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const ACTIVITY_ICON: Record<RecentActivityKind, LucideIcon> = {
  lesson: CheckCircle2,
  homework: FileCheck2,
  goal: Target,
};

export function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { studentId, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useCurrentStudentProfile();
  const { data: lessons, isLoading: isLessonsLoading } = useLessons(studentId);
  const { data: homework, isLoading: isHomeworkLoading } = useHomeworkList(studentId);
  const { data: masterySummaries } = useSubjectMastery(studentId);
  const { data: goals } = useGoals(studentId);
  const { data: learningProfile } = useLearningProfile();

  const isLoading = isProfileLoading || isLessonsLoading || isHomeworkLoading;
  const greetName = user ? firstName(user.fullName) : "there";

  if (isProfileError) {
    return <ErrorState title="We couldn't load your dashboard" description="Your progress is safe — please try again." onRetry={() => refetchProfile()} />;
  }

  if (isLoading || !lessons || !homework) {
    return <LoadingState label="Loading your dashboard..." />;
  }

  const nextAction = computeNextBestAction(lessons, homework);
  const upcomingLessons = lessons.filter((l) => l.state === "upcoming" || l.state === "starting-soon" || l.state === "ready-to-join").slice(0, 2);
  const pendingHomework = homework.filter((h) => h.status !== "SUBMITTED" && h.status !== "REVIEWED").slice(0, 2);
  const [nextLesson] = upcomingLessons;
  const [firstPendingHomework] = pendingHomework;
  const [firstGoal] = goals ?? [];
  const needsAttentionTopic = masterySummaries?.flatMap((s) => s.needsAttentionTopics.map((t) => ({ subject: s.subjectName, topic: t })))[0];
  const recentActivity = computeRecentActivity(lessons, homework, goals ?? []).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card/80 px-6 py-7 backdrop-blur-sm sm:px-8">
        <AnimatedLearningBackground variant="student" intensity="subtle" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {greeting()}, <span className="text-primary">{greetName}</span> 👋
            </h1>
            <p className="mt-1.5 text-muted-foreground">You're making progress — here's what's next.</p>
          </div>
          {learningProfile && learningProfile.learningStreak > 0 && (
            <Badge variant="warning" className="w-fit gap-1.5 px-3 py-1.5 text-sm">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {learningProfile.learningStreak}-day streak
            </Badge>
          )}
        </div>
      </div>

      <NextBestAction action={nextAction} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationList />
        </div>
        <WeeklySummaryCard />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">Today's learning</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="myt-card-hover lg:col-span-1">
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <p className="text-sm font-medium text-muted-foreground">Next lesson</p>
              {nextLesson ? (
                <>
                  <p className="font-semibold">{nextLesson.subjectName}</p>
                  <p className="text-sm text-muted-foreground">with {nextLesson.tutorName}</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(nextLesson.booking.scheduledStart)}</p>
                  <Button size="sm" variant="outline" className="mt-auto w-fit" asChild>
                    <Link to={`/student/lessons/${nextLesson.booking.id}`}>Prepare</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Nothing booked yet.</p>
                  <Button size="sm" variant="outline" className="mt-auto w-fit" asChild>
                    <Link to="/student/find-tutor">Find a tutor</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="myt-card-hover lg:col-span-1">
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <p className="text-sm font-medium text-muted-foreground">Homework</p>
              {pendingHomework.length > 0 ? (
                <>
                  <p className="font-semibold">
                    {pendingHomework.length} task{pendingHomework.length === 1 ? "" : "s"} waiting
                  </p>
                  <p className="text-sm text-muted-foreground">{firstPendingHomework?.title}</p>
                  <Button size="sm" variant="outline" className="mt-auto w-fit" asChild>
                    <Link to={`/student/homework/${firstPendingHomework?.id}`}>Continue</Link>
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">You're all caught up 🎉</p>
              )}
            </CardContent>
          </Card>

          <Card className="myt-card-hover lg:col-span-1">
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <p className="text-sm font-medium text-muted-foreground">Recommended practice</p>
              {needsAttentionTopic ? (
                <>
                  <p className="font-semibold">{needsAttentionTopic.topic}</p>
                  <p className="text-sm text-muted-foreground">{needsAttentionTopic.subject} · ~15 min</p>
                  <Button size="sm" variant="outline" className="mt-auto w-fit" asChild>
                    <Link to="/student/library">
                      <Dumbbell className="h-4 w-4" />
                      Start practice
                    </Link>
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Nothing flagged right now — nice work.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Your progress</h2>
          <Link to="/student/progress" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {masterySummaries && masterySummaries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {masterySummaries.map((summary) => (
              <Link key={summary.subjectId} to={`/student/learning/subjects/${summary.subjectId}`}>
                <Card className="myt-card-hover h-full">
                  <CardContent className="flex items-center gap-4 p-5">
                    <ProgressRing percent={summary.overallPercent} size={56} strokeWidth={5} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{summary.subjectName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {summary.strongTopics.length > 0
                          ? `${summary.strongTopics.length} strong topic${summary.strongTopics.length === 1 ? "" : "s"}`
                          : "Just getting started"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-5">
              <EmptyState icon={BookOpen} title="No progress data yet" description="Complete a lesson or homework task to start tracking progress." />
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Upcoming lessons</h2>
          <Link to="/student/lessons" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {upcomingLessons.length === 0 ? (
          <EmptyState title="Your learning calendar is clear" description="Ready to book your first lesson?" actionLabel="Find a tutor" onAction={() => navigate("/student/find-tutor")} />
        ) : (
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <StudentLessonCard key={lesson.booking.id} lesson={lesson} />
            ))}
          </div>
        )}
      </section>

      {firstGoal && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Goals</h2>
            <Link to="/student/goals" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Card className="myt-card-hover">
            <CardHeader>
              <CardTitle className="text-base">{firstGoal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                <ClipboardList className="h-3 w-3" />
                {firstGoal.progress}% complete
              </Badge>
            </CardContent>
          </Card>
        </section>
      )}

      {studentId && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Achievements</h2>
            {learningProfile && (
              <span className="text-sm text-muted-foreground">
                {learningProfile.goalsCompleted} goal{learningProfile.goalsCompleted === 1 ? "" : "s"} completed
              </span>
            )}
          </div>
          <AchievementsList studentId={studentId} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground">Recent activity</h2>
        {recentActivity.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No activity yet" description="Your completed lessons, homework and goals will show up here." />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {recentActivity.map((item) => {
                const Icon = ACTIVITY_ICON[item.kind];
                return (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeToNow(item.at)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
