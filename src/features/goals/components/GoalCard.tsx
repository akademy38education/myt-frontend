import { Target } from "lucide-react";
import type { Goal } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SUBJECTS } from "@/constants/subjects";

export function GoalCard({ goal }: { goal: Goal }) {
  const subjectName = goal.subjectId ? SUBJECTS.find((s) => s.id === goal.subjectId)?.name : undefined;
  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">{goal.title}</p>
            {subjectName && <p className="text-sm text-muted-foreground">{subjectName}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} />
        </div>
        <p className="text-xs text-muted-foreground">{daysLeft > 0 ? `${daysLeft} days left` : "Target date passed"}</p>
      </CardContent>
    </Card>
  );
}
