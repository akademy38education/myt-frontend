import { useState } from "react";
import { toast } from "sonner";
import { CANCELLATION_REASONS, type Booking } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/utils/formatters";
import { CancellationPolicy } from "./CancellationPolicy";
import { useCancelBooking } from "../hooks/useCancelBooking";

export interface CancelBookingModalProps {
  booking: Booking | null;
  tutorName: string;
  subjectName: string;
  onOpenChange: (open: boolean) => void;
}

export function CancelBookingModal({ booking, tutorName, subjectName, onOpenChange }: CancelBookingModalProps) {
  const [reason, setReason] = useState<(typeof CANCELLATION_REASONS)[number] | undefined>(undefined);
  const cancelBooking = useCancelBooking();

  if (!booking) return null;

  async function handleConfirm() {
    if (!booking) return;
    try {
      await cancelBooking.mutateAsync({ bookingId: booking.id, input: { reason } });
      toast.success("Lesson cancelled");
      onOpenChange(false);
      setReason(undefined);
    } catch {
      toast.error("We couldn't cancel this lesson. Please try again.");
    }
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
          <DialogDescription>
            {subjectName} with {tutorName} — {formatDateTime(booking.scheduledStart)}
          </DialogDescription>
        </DialogHeader>

        <CancellationPolicy scheduledStart={booking.scheduledStart} />

        <div className="space-y-1.5">
          <Label>Why are you cancelling? (optional)</Label>
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as (typeof CANCELLATION_REASONS)[number])}>
            {CANCELLATION_REASONS.map((option) => (
              <label key={option} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value={option} id={`cancel-reason-${option}`} />
                {option}
              </label>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep lesson
          </Button>
          <Button variant="destructive" isLoading={cancelBooking.isPending} onClick={handleConfirm}>
            Cancel lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
