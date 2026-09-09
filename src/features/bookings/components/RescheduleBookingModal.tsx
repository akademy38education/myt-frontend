import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import type { Booking } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import { AvailabilityPicker, type SelectedSlot } from "@/features/tutor-availability";
import { formatDateTime } from "@/utils/formatters";
import { zonedTimeToUtc } from "@/utils/timezone";
import { isBookingConflictError } from "../services/bookingsService";
import { useRescheduleBooking } from "../hooks/useRescheduleBooking";

export interface RescheduleBookingModalProps {
  booking: Booking | null;
  tutorName: string;
  subjectName: string;
  onOpenChange: (open: boolean) => void;
}

export function RescheduleBookingModal({ booking, tutorName, subjectName, onOpenChange }: RescheduleBookingModalProps) {
  const [slot, setSlot] = useState<SelectedSlot | undefined>(undefined);
  const [conflict, setConflict] = useState(false);
  const reschedule = useRescheduleBooking();

  if (!booking) return null;

  async function handleConfirm() {
    if (!booking || !slot) return;
    setConflict(false);
    const durationMs = new Date(booking.scheduledEnd).getTime() - new Date(booking.scheduledStart).getTime();
    // Slots are in the tutor's local time — never reinterpret them in the viewing browser's timezone.
    const newStart = zonedTimeToUtc(slot.date, slot.time, booking.tutorTimezone);
    const newEnd = new Date(newStart.getTime() + durationMs);

    try {
      await reschedule.mutateAsync({ bookingId: booking.id, input: { scheduledStart: newStart.toISOString(), scheduledEnd: newEnd.toISOString() } });
      toast.success("Lesson rescheduled");
      onOpenChange(false);
      setSlot(undefined);
    } catch (error) {
      if (isBookingConflictError(error)) setConflict(true);
      else toast.error("We couldn't reschedule this lesson. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule lesson</DialogTitle>
          <DialogDescription>
            {subjectName} with {tutorName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
          <span className="text-muted-foreground">Current:</span>
          <span className="font-medium">{formatDateTime(booking.scheduledStart)}</span>
          {slot && (
            <>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-primary">
                {slot.date} {slot.time}
              </span>
            </>
          )}
        </div>

        {conflict && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">This time was just booked. Please choose another time.</p>}

        <div className="max-h-72 overflow-y-auto pr-1">
          <AvailabilityPicker tutorId={booking.tutorId} selected={slot} onSelect={setSlot} />
        </div>

        {reschedule.isError && !conflict && <ErrorState title="Couldn't reschedule" description="Please try again." onRetry={handleConfirm} />}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!slot} isLoading={reschedule.isPending} onClick={handleConfirm}>
            Confirm new time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
