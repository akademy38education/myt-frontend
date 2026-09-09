import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge, canManageBooking } from "@/features/bookings";
import { lessonSessionService } from "@/features/classroom";
import { formatDateTime } from "@/utils/formatters";
import type { CalendarEvent } from "../types";

export interface CalendarEventDetailsDialogProps {
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
  onReschedule?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
}

export function CalendarEventDetailsDialog({ event, onOpenChange, onReschedule, onCancel }: CalendarEventDetailsDialogProps) {
  const navigate = useNavigate();

  if (!event) return null;

  const { booking } = event;
  const durationMinutes = booking ? Math.round((new Date(booking.scheduledEnd).getTime() - new Date(booking.scheduledStart).getTime()) / 60000) : undefined;
  const joinState = booking ? lessonSessionService.getJoinState(booking) : undefined;
  // The calendar is shared across student/tutor/parent, so the classroom route is derived from where this dialog is currently rendered.
  const classroomRole = window.location.pathname.startsWith("/tutor") ? "tutor" : "student";

  return (
    <Dialog open={Boolean(event)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.title}
            {booking && <BookingStatusBadge booking={booking} />}
          </DialogTitle>
          {event.tutorName && <DialogDescription>with {event.tutorName}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDateTime(event.date)}
          </p>
          {durationMinutes !== undefined && (
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {durationMinutes} minutes
            </p>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {booking && joinState === "live" && (
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate(`/${classroomRole}/classroom/${booking.id}`);
              }}
            >
              <Video className="h-4 w-4" />
              Join Lesson
            </Button>
          )}
          {booking && canManageBooking(booking) && onReschedule && (
            <Button variant="outline" onClick={() => onReschedule(event)}>
              Reschedule
            </Button>
          )}
          {booking && canManageBooking(booking) && onCancel && (
            <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onCancel(event)}>
              Cancel
            </Button>
          )}
          {event.link && (
            <Button variant="outline" asChild>
              <Link to={event.link}>View details</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
