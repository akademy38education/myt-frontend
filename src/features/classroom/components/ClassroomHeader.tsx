import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ConnectionQuality } from "../types";
import { ConnectionIndicator } from "./ConnectionIndicator";
import { LessonTimerDisplay } from "./LessonTimerDisplay";

export interface ClassroomHeaderProps {
  subjectName: string;
  lessonTitle?: string;
  startedAt?: string;
  isLive: boolean;
  connectionQuality: ConnectionQuality;
}

export function ClassroomHeader({ subjectName, lessonTitle, startedAt, isLive, connectionQuality }: ClassroomHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4">
      <div className="flex min-w-0 items-center gap-2">
        <GraduationCap className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">{subjectName}</p>
          {lessonTitle && <p className="truncate text-xs text-muted-foreground">{lessonTitle}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ConnectionIndicator quality={connectionQuality} />
        {isLive && (
          <Badge variant="destructive" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> Live
          </Badge>
        )}
        {startedAt && <LessonTimerDisplay startedAt={startedAt} />}
      </div>
    </header>
  );
}
