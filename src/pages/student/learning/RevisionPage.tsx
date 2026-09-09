import { Link } from "react-router-dom";
import { AlertCircle, Clock, CalendarClock, Sparkles } from "lucide-react";
import type { RevisionQueueItem, RevisionReason } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRevisionQueue, MASTERY_LEVEL_META } from "@/features/learning";

const REASON_META: Record<RevisionReason, { label: string; description: string; icon: typeof AlertCircle }> = {
  "low-mastery": { label: "Needs practice", description: "Mastery is still low here — a bit more practice will help it stick.", icon: AlertCircle },
  stale: { label: "Hasn't been revisited", description: "It's been a while since this was last practiced.", icon: Clock },
  "upcoming-lesson": { label: "Upcoming lesson", description: "Worth a quick review before your next lesson on this.", icon: CalendarClock },
};

function RevisionGroup({ reason, items }: { reason: RevisionReason; items: RevisionQueueItem[] }) {
  const meta = REASON_META[reason];
  const Icon = meta.icon;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold tracking-tight">{meta.label}</h2>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{meta.description}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.topicId} to={`/student/learning/topics/${item.topicId}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium">{item.topicTitle}</p>
                  <p className="text-xs text-muted-foreground">{item.subjectName}</p>
                </div>
                <Badge variant="outline" className={MASTERY_LEVEL_META[item.level].className}>
                  {item.score}%
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RevisionPage() {
  const { data, isLoading, isError, refetch } = useRevisionQueue();

  if (isLoading) return <LoadingState label="Loading revision queue..." />;
  if (isError || !data) return <ErrorState title="We couldn't load your revision queue" onRetry={() => refetch()} />;

  const groups: Array<{ reason: RevisionReason; items: RevisionQueueItem[] }> = (["low-mastery", "stale", "upcoming-lesson"] as RevisionReason[])
    .map((reason) => ({ reason, items: data.filter((item) => item.reason === reason) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Revision" description="Topics worth another look, grouped by why they're here." />

      {groups.length === 0 ? (
        <EmptyState icon={Sparkles} title="Nothing to revise right now" description="Nothing needs revisiting at the moment — keep up the good work." />
      ) : (
        groups.map((group) => <RevisionGroup key={group.reason} reason={group.reason} items={group.items} />)
      )}
    </div>
  );
}
