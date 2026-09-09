import { useSearchParams } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubjectMastery } from "../hooks/useMastery";
import { SubjectProgressBar } from "./SubjectProgressBar";
import { MasteryMap } from "./MasteryMap";

/**
 * The subject-by-subject mastery breakdown (overall bars, strong/needs-attention
 * topics, topic map) — extracted so both the student's own Progress page and
 * a parent's per-child Progress view render identically off the same data,
 * rather than two copies of this UI drifting apart.
 */
export function MasteryOverview({ studentId, emptyStateDescription = "Complete a lesson or some homework to start tracking mastery." }: { studentId: string; emptyStateDescription?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: mastery, isLoading } = useSubjectMastery(studentId);

  const activeSubjectId = searchParams.get("subject") ?? mastery?.[0]?.subjectId;
  const activeSummary = mastery?.find((m) => m.subjectId === activeSubjectId);

  if (isLoading) return <LoadingState label="Loading progress..." />;

  if (!mastery || mastery.length === 0) {
    return <EmptyState icon={TrendingUp} title="No progress data yet" description={emptyStateDescription} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="font-semibold">Overall mastery</h2>
          {mastery.map((summary) => (
            <SubjectProgressBar key={summary.subjectId} subjectName={summary.subjectName} percent={summary.overallPercent} />
          ))}
        </CardContent>
      </Card>

      <div>
        <Tabs value={activeSubjectId} onValueChange={(v) => setSearchParams({ subject: v })} className="mb-4">
          <TabsList className="flex-wrap">
            {mastery.map((summary) => (
              <TabsTrigger key={summary.subjectId} value={summary.subjectId}>
                {summary.subjectName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeSummary && (
          <Card>
            <CardContent className="space-y-6 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Overall mastery</p>
                <p className="text-3xl font-bold tracking-tight">{activeSummary.overallPercent}%</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-success">Strong areas</p>
                  {activeSummary.strongTopics.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {activeSummary.strongTopics.map((t) => (
                        <li key={t}>✓ {t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nothing secure yet — keep going.</p>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-destructive">Needs attention</p>
                  {activeSummary.needsAttentionTopics.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {activeSummary.needsAttentionTopics.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nothing flagged right now.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Topic breakdown</p>
                <MasteryMap summary={activeSummary} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
