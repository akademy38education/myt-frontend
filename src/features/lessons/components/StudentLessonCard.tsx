import { Link } from "react-router-dom";
import { Calendar, Clock, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/formatters";
import { initials } from "@/utils/formatters";
import type { LessonView, LessonViewState } from "../types";

const STATE_META: Record<LessonViewState, { label: string; variant: "success" | "warning" | "outline" | "muted" | "destructive" }> = {
  "starting-soon": { label: "Starting soon", variant: "warning" },
  "ready-to-join": { label: "Ready to join", variant: "success" },
  upcoming: { label: "Upcoming", variant: "outline" },
  completed: { label: "Completed", variant: "muted" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  missed: { label: "Missed", variant: "destructive" },
};

export interface StudentLessonCardProps {
  lesson: LessonView;
  onCancel?: (lesson: LessonView) => void;
  onReschedule?: (lesson: LessonView) => void;
}

export function StudentLessonCard({ lesson, onCancel, onReschedule }: StudentLessonCardProps) {
  const { booking, meta, tutorName, subjectName, state } = lesson;
  const durationMinutes = Math.round((new Date(booking.scheduledEnd).getTime() - new Date(booking.scheduledStart).getTime()) / 60000);
  const canManage = state === "upcoming" || state === "starting-soon";

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarFallback>{initials(tutorName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{subjectName}</p>
              <Badge variant={STATE_META[state].variant}>{STATE_META[state].label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">with {tutorName}</p>
            {meta?.topic && <p className="mt-1 text-sm text-muted-foreground">{meta.topic}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(booking.scheduledStart)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {durationMinutes} min
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
          {state === "ready-to-join" && (
            <Button size="sm" asChild>
              <Link to={`/student/lessons/${booking.id}`}>
                <Video className="h-4 w-4" />
                Join lesson
              </Link>
            </Button>
          )}
          {(state === "upcoming" || state === "starting-soon") && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/student/lessons/${booking.id}`}>Prepare</Link>
            </Button>
          )}
          {state === "completed" && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/student/lessons/${booking.id}`}>View summary</Link>
            </Button>
          )}
          {(state === "cancelled" || state === "missed") && (
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/student/lessons/${booking.id}`}>View details</Link>
            </Button>
          )}
          {canManage && onReschedule && (
            <Button size="sm" variant="ghost" onClick={() => onReschedule(lesson)}>
              Reschedule
            </Button>
          )}
          {canManage && onCancel && (
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onCancel(lesson)}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
