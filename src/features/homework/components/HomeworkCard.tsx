import { Link } from "react-router-dom";
import { HomeworkStatus } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatRelativeToNow } from "@/utils/formatters";
import type { HomeworkView } from "../types";

const STATUS_META: Record<HomeworkStatus, { label: string; variant: "success" | "warning" | "outline" | "muted" | "destructive" }> = {
  [HomeworkStatus.ASSIGNED]: { label: "Not started", variant: "outline" },
  [HomeworkStatus.IN_PROGRESS]: { label: "In progress", variant: "warning" },
  [HomeworkStatus.SUBMITTED]: { label: "Submitted", variant: "success" },
  [HomeworkStatus.REVIEWED]: { label: "Marked", variant: "success" },
  [HomeworkStatus.OVERDUE]: { label: "Overdue", variant: "destructive" },
};

export function HomeworkCard({ homework }: { homework: HomeworkView }) {
  const percent = homework.questions.length ? Math.round((homework.answeredCount / homework.questions.length) * 100) : 0;
  const isDone = homework.status === HomeworkStatus.SUBMITTED || homework.status === HomeworkStatus.REVIEWED;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{homework.title}</p>
            <p className="text-sm text-muted-foreground">
              {homework.subjectName} · with {homework.tutorName}
            </p>
          </div>
          <Badge variant={STATUS_META[homework.status].variant}>{STATUS_META[homework.status].label}</Badge>
        </div>

        {!isDone && (
          <div className="space-y-1.5">
            <Progress value={percent} />
            <p className="text-xs text-muted-foreground">
              {homework.answeredCount} / {homework.questions.length} questions answered
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isDone ? `Submitted` : `Due ${formatRelativeToNow(homework.dueAt)}`}
          </p>
          <Button size="sm" variant={isDone ? "outline" : "default"} asChild>
            <Link to={`/student/homework/${homework.id}`}>{isDone ? "Review" : "Continue"}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
