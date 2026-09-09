import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { useSubjectMastery, SubjectProgressBar } from "@/features/mastery";
import { initials } from "@/utils/formatters";

/** One child's progress card — its own `useSubjectMastery` call, independent of its siblings, so each renders as soon as its own data is ready. */
function ChildProgressCard({ childId, childName }: { childId: string; childName: string }) {
  const { data: mastery, isLoading } = useSubjectMastery(childId);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials(childName)}</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{childName}</p>
        </div>
        {isLoading ? (
          <LoadingState label="Loading..." />
        ) : !mastery || mastery.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No progress data yet" description="We're just getting started — progress will appear here once lessons begin." className="py-6" />
        ) : (
          <div className="space-y-3">
            {mastery.slice(0, 4).map((summary) => (
              <SubjectProgressBar key={summary.subjectId} subjectName={summary.subjectName} percent={summary.overallPercent} />
            ))}
          </div>
        )}
        <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
          <Link to={`/parent/children/${childId}/progress`}>View full progress</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function ParentProgressPage() {
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading } = useChildren(parentId);

  if (!parentId || isLoading) return <LoadingState label="Loading progress..." />;

  return (
    <div>
      <PageHeader title="Progress" description="Each child's learning, shown on its own — never compared against a sibling." />
      {!children || children.length === 0 ? (
        <EmptyState title="No children added yet" description="Add a child to start tracking their progress." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <ChildProgressCard key={child.id} childId={child.id} childName={child.fullName ?? "Student"} />
          ))}
        </div>
      )}
    </div>
  );
}
