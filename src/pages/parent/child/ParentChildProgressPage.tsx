import { useOutletContext } from "react-router-dom";
import type { StudentProfile } from "@myt/shared";
import { Info } from "lucide-react";
import { MasteryOverview } from "@/features/mastery";

export function ParentChildProgressPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();

  return (
    <div className="space-y-4">
      <p className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Mastery percentages reflect {child.fullName ?? "your child"}'s current understanding of each topic, based on lesson and homework activity — not a test score or a comparison to other students.
      </p>
      <MasteryOverview studentId={child.id} emptyStateDescription={`Once ${child.fullName ?? "your child"} completes a lesson or some homework, their progress will appear here.`} />
    </div>
  );
}
