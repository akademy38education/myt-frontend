import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, MessageSquare } from "lucide-react";
import type { Booking } from "@myt/shared";
import { PaymentStatus, UserRole } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatDateInTimezone, formatTimeRangeInTimezone } from "@/utils/timezone";
import { trackEvent } from "@/utils/analytics";
import { AddToCalendar } from "./AddToCalendar";

export interface BookingConfirmationProps {
  booking: Booking;
  tutorName: string;
  subjectName: string;
}

/** The "your lesson is booked" moment — shown inline in `BookingWizard`'s last step (modal flow) and standalone at `/student/bookings/:id/confirmation` (full-page flow, and what a reload of that URL re-renders). One component, two entry points. */
export function BookingConfirmation({ booking, tutorName, subjectName }: BookingConfirmationProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPaymentPending = booking.paymentStatus === PaymentStatus.PENDING;

  useEffect(() => {
    trackEvent("booking_completed", { bookingId: booking.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Lesson booked!</h2>
        <p className="text-sm text-muted-foreground">
          You're booked with {tutorName}.
          <br />
          {subjectName} · {formatDateInTimezone(booking.scheduledStart, booking.studentTimezone)}
          <br />
          {formatTimeRangeInTimezone(booking.scheduledStart, booking.scheduledEnd, booking.studentTimezone)}
        </p>
      </div>
      {isPaymentPending && (
        <div className="flex items-start gap-2.5 rounded-md bg-warning/10 p-3 text-sm text-warning-foreground">
          <CreditCard className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            {user?.role === UserRole.PARENT
              ? "This lesson is booked but not yet paid for — complete payment from your Payments page to confirm it."
              : "This lesson is booked but not yet paid for. Ask your parent or guardian to complete payment from their Payments page."}
          </p>
        </div>
      )}
      <AddToCalendar booking={booking} tutorName={tutorName} subjectName={subjectName} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={() => navigate(`/student/bookings/${booking.id}`)}>
          View Lesson
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => toast.info("You'll be able to message this tutor from your Messages page shortly after booking.")}>
          <MessageSquare className="h-4 w-4" />
          Message Tutor
        </Button>
      </div>
    </div>
  );
}
