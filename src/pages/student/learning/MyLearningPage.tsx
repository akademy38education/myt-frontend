import { Link } from "react-router-dom";
import { Flame, ClipboardList, Target, CheckCircle2, ChevronRight, RotateCcw, BookOpen, Sparkles } from "lucide-react";
import { scoreToMasteryLevel } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLearningProfile, useLearningProgress, useRevisionQueue, MASTERY_LEVEL_META } from "@/features/learning";
import { AchievementsList } from "@/features/achievements";
import { LearningInsightsPanel } from "@/features/learning-insights";
import { useCurrentStudentProfile } from "@/features/students/hooks/useCurrentStudentProfile";

const REVISION_REASON_LABEL: Record<string, string> = {
  "low-mastery": "Needs practice",
  stale: "Hasn't been revisited",
  "upcoming-lesson": "Upcoming lesson",
};

export function MyLearningPage() {
  const profileQuery = useLearningProfile();
  const progressQuery = useLearningProgress();
  const revisionQuery = useRevisionQueue();
  const { studentId } = useCurrentStudentProfile();

  if (profileQuery.isLoading || progressQuery.isLoading) return <LoadingState label="Loading your learning..." />;
  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState title="We couldn't load your learning profile" onRetry={() => profileQuery.refetch()} />;
  }
  if (progressQuery.isError || !progressQuery.data) {
    return <ErrorState title="We couldn't load your subject progress" onRetry={() => progressQuery.refetch()} />;
  }

  const profile = profileQuery.data;
  const subjects = progressQuery.data;
  const revisionPreview = (revisionQuery.data ?? []).slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader title="My Learning" description="Your progress, strengths, and what's worth revisiting next — all in one place." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Day streak" value={profile.learningStreak} icon={Flame} />
        <StatCard label="Recent activity" value={profile.recentActivityCount} icon={ClipboardList} hint="Homework submitted in the last 7 days" />
        <StatCard label="Goals in progress" value={profile.goalsInProgress} icon={Target} />
        <StatCard label="Goals completed" value={profile.goalsCompleted} icon={CheckCircle2} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Insights</h2>
        <LearningInsightsPanel />
      </section>

      {(profile.strengths.length > 0 || profile.areasNeedingImprovement.length > 0) && (
        <Card>
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-success">Strengths</p>
              {profile.strengths.length > 0 ? (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {profile.strengths.map((topic) => (
                    <li key={topic}>✓ {topic}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nothing secure yet — keep going.</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-destructive">Areas needing improvement</p>
              {profile.areasNeedingImprovement.length > 0 ? (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {profile.areasNeedingImprovement.map((topic) => (
                    <li key={topic}>• {topic}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nothing flagged right now.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Your subjects</h2>
        {subjects.length === 0 ? (
          <EmptyState icon={BookOpen} title="No subjects tracked yet" description="Once you start lessons or homework, your subject progress will show up here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const meta = MASTERY_LEVEL_META[scoreToMasteryLevel(subject.overallScore)];
              return (
                <Link key={subject.subjectId} to={`/student/learning/subjects/${subject.subjectId}`}>
                  <Card className="h-full transition-colors hover:border-primary/40">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium">{subject.subjectName}</h3>
                        <Badge variant="outline" className={meta.className}>
                          {meta.label}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{subject.overallScore}%</span>
                          <span>
                            {subject.topicsStarted}/{subject.topicsTotal} topics started
                          </span>
                        </div>
                        <Progress value={subject.overallScore} />
                      </div>
                      <p className="text-xs text-muted-foreground">{subject.topicsMastered} topic{subject.topicsMastered === 1 ? "" : "s"} mastered</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Revision queue</h2>
          <Link to="/student/learning/revision" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {revisionQuery.isLoading && <LoadingState label="Loading revision queue..." className="py-8" />}
        {revisionQuery.isError && <ErrorState title="We couldn't load your revision queue" onRetry={() => revisionQuery.refetch()} className="py-8" />}
        {revisionQuery.data && revisionQuery.data.length === 0 && (
          <EmptyState icon={Sparkles} title="Nothing to revise right now" description="Keep it up — new revision items appear here as topics need attention." />
        )}
        {revisionPreview.length > 0 && (
          <div className="space-y-2">
            {revisionPreview.map((item) => (
              <Link key={item.topicId} to={`/student/learning/topics/${item.topicId}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.topicTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.subjectName} · {REVISION_REASON_LABEL[item.reason] ?? item.reason}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={MASTERY_LEVEL_META[item.level].className}>
                      {item.score}%
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Achievements</h2>
        {studentId && <AchievementsList studentId={studentId} />}
      </section>
    </div>
  );
}
