import { Progress } from "@/components/ui/progress";

export function SubjectProgressBar({ subjectName, percent, trend }: { subjectName: string; percent: number; trend?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{subjectName}</span>
        <span className="text-muted-foreground">
          {percent}%{typeof trend === "number" && trend !== 0 && (
            <span className={trend > 0 ? "ml-1 text-success" : "ml-1 text-destructive"}>
              {trend > 0 ? "+" : ""}
              {trend}% this month
            </span>
          )}
        </span>
      </div>
      <Progress value={percent} />
    </div>
  );
}
