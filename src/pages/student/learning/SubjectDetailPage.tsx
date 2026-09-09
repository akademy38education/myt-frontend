import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useSubjectDetail, MASTERY_LEVEL_META } from "@/features/learning";
import type { SubjectDetailTopic } from "@/features/learning";

function TopicRow({ topic, depth, allTopics }: { topic: SubjectDetailTopic; depth: number; allTopics: SubjectDetailTopic[] }) {
  const children = allTopics.filter((t) => t.parentTopicId === topic.topicId).sort((a, b) => a.order - b.order);
  const meta = MASTERY_LEVEL_META[topic.level];

  return (
    <div>
      <Link to={`/student/learning/topics/${topic.topicId}`}>
        <div
          className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
          style={{ marginLeft: depth * 20 }}
        >
          <div>
            <p className="text-sm font-medium">{topic.title}</p>
            {topic.description && <p className="mt-0.5 text-xs text-muted-foreground">{topic.description}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className={meta.className}>
              {meta.label} · {topic.score}%
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </Link>
      {children.length > 0 && (
        <div className="mt-2 space-y-2">
          {children.map((child) => (
            <TopicRow key={child.topicId} topic={child} depth={depth + 1} allTopics={allTopics} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSubjectDetail(subjectId ?? "");

  if (isLoading) return <LoadingState label="Loading subject..." />;
  if (isError || !data) return <ErrorState title="We couldn't load this subject" onRetry={() => refetch()} />;

  const topLevelTopics = data.topics.filter((t) => !t.parentTopicId).sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/learning")}>
        <ArrowLeft className="h-4 w-4" />
        Back to My Learning
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{data.subjectName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Topic-by-topic mastery for this subject.</p>
      </div>

      {topLevelTopics.length === 0 ? (
        <EmptyState icon={BookOpen} title="No topics yet" description="Topics for this subject will appear here once they're available." />
      ) : (
        <Card>
          <CardContent className="space-y-2 p-4">
            {topLevelTopics.map((topic) => (
              <TopicRow key={topic.topicId} topic={topic} depth={0} allTopics={data.topics} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
