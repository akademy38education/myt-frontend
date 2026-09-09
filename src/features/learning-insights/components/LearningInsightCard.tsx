import { Lightbulb, Target, TrendingUp, type LucideIcon } from "lucide-react";
import type { LearningInsight, LearningInsightKind } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

const KIND_STYLE: Record<LearningInsightKind, { icon: LucideIcon; iconClassName: string }> = {
  strength: { icon: TrendingUp, iconClassName: "bg-success/10 text-success" },
  improvement: { icon: Target, iconClassName: "bg-primary/10 text-primary" },
  opportunity: { icon: Lightbulb, iconClassName: "bg-muted text-muted-foreground" },
};

export function LearningInsightCard({ insight, className }: { insight: LearningInsight; className?: string }) {
  const { icon: Icon, iconClassName } = KIND_STYLE[insight.kind];

  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-start gap-3 p-4">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium">{insight.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{insight.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
