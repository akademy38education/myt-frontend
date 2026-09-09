import { CheckCircle2 } from "lucide-react";

export function LessonObjectives({ objectives }: { objectives: string[] | undefined }) {
  if (!objectives || objectives.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today's goals</p>
      <ul className="space-y-1.5">
        {objectives.map((objective) => (
          <li key={objective} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {objective}
          </li>
        ))}
      </ul>
    </div>
  );
}
