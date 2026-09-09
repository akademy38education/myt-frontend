import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ListChecks } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { Question } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "@/components/ui/chart";
import { useTopicDetail, usePracticeQuestions, MASTERY_LEVEL_META } from "@/features/learning";
import { formatDate } from "@/utils/formatters";

function PracticeQuestionCard({ question, index }: { question: Question; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const answerText = Array.isArray(question.answer) ? question.answer.join(", ") : question.answer;

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">Question {index + 1}</p>
          <Badge variant="outline">{question.difficulty}</Badge>
        </div>
        <p className="font-medium">{question.prompt}</p>
        {question.choices && question.choices.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {question.choices.map((choice) => (
              <li key={choice}>• {choice}</li>
            ))}
          </ul>
        )}
        <Button variant="outline" size="sm" onClick={() => setRevealed((r) => !r)}>
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {revealed ? "Hide answer" : "Reveal answer"}
        </Button>
        {revealed && <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">{answerText}</p>}
      </CardContent>
    </Card>
  );
}

export function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { data: topic, isLoading, isError, refetch } = useTopicDetail(topicId ?? "");
  const [practiceStarted, setPracticeStarted] = useState(false);
  const practiceQuery = usePracticeQuestions(topicId ?? "", { enabled: practiceStarted });

  if (isLoading) return <LoadingState label="Loading topic..." />;
  if (isError) return <ErrorState title="We couldn't load this topic" description="It may not exist, or something went wrong." onRetry={() => refetch()} />;
  if (!topic) return <NotFoundState />;

  const meta = MASTERY_LEVEL_META[topic.level];
  const sortedHistory = [...topic.history].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  const chartData = sortedHistory.map((point) => ({ recordedAt: formatDate(point.recordedAt), score: point.score }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/student/learning/subjects/${topic.subjectId}`)}>
        <ArrowLeft className="h-4 w-4" />
        Back to {topic.subjectName}
      </Button>

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <Link to={`/student/learning/subjects/${topic.subjectId}`} className="hover:underline">
                {topic.subjectName}
              </Link>
            </p>
          </div>
          <Badge variant="outline" className={meta.className}>
            {meta.label} · {topic.score}%
          </Badge>
        </div>
        {topic.description && <p className="mt-3 text-sm text-muted-foreground">{topic.description}</p>}
      </div>

      {topic.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              Learning objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {topic.objectives.map((objective) => (
                <li key={objective}>• {objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mastery over time</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedHistory.length >= 2 ? (
            <ChartContainer height={220}>
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="recordedAt" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={36} />
                <ChartTooltip />
                <Line type="monotone" dataKey="score" name="Score" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                {topic.evidenceCount > 0
                  ? `Current score: ${topic.score}%. Not enough history yet for a trend chart.`
                  : "No activity recorded yet for this topic."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Practice this topic</h2>
          {!practiceStarted && <Button onClick={() => setPracticeStarted(true)}>Start practice</Button>}
        </div>
        {practiceStarted && (
          <>
            {practiceQuery.isLoading && <LoadingState label="Loading practice questions..." className="py-8" />}
            {practiceQuery.isError && <ErrorState title="We couldn't load practice questions" onRetry={() => practiceQuery.refetch()} className="py-8" />}
            {practiceQuery.data && practiceQuery.data.length === 0 && (
              <EmptyState title="No practice questions yet" description="There aren't any self-directed practice questions for this topic yet." />
            )}
            {practiceQuery.data && practiceQuery.data.length > 0 && (
              <div className="space-y-3">
                {practiceQuery.data.map((question, index) => (
                  <PracticeQuestionCard key={question.id} question={question} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
