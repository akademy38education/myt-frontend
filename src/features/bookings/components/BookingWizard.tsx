import { useEffect, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import type { Booking, Payment, TutorProfile } from "@myt/shared";
import { PaymentStatus } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/shared/ErrorState";
import { TimezoneSelector } from "@/components/shared/TimezoneSelector";
import { useCurrentStudentProfile } from "@/features/students";
import { useCurrentParentProfile } from "@/features/parents";
import { PaymentMethodSelector } from "@/features/payments";
import { AvailabilityPicker, type SelectedSlot } from "@/features/tutor-availability";
import { formatCurrency } from "@/utils/formatters";
import { formatDateInTimezone, formatTimeRangeInTimezone, getBrowserTimezone, zonedTimeToUtc } from "@/utils/timezone";
import { randomUUID } from "@/utils/uuid";
import { SUBJECTS } from "@/constants/subjects";
import { BookingConfirmation } from "./BookingConfirmation";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { useCheckout } from "../hooks/useCheckout";
import { pricingService } from "../pricing";
import { isBookingConflictError } from "../services/bookingsService";

const DURATIONS = [
  { label: "30 minutes", minutes: 30 },
  { label: "60 minutes", minutes: 60 },
  { label: "90 minutes", minutes: 90 },
];

type Step = "lessonType" | "subject" | "datetime" | "duration" | "review" | "payment" | "confirmation";

/** Compact, purely presentational step indicator — mirrors `step` state but never drives navigation/validation. */
function WizardStepIndicator({ count, currentIndex }: { count: number; currentIndex: number }) {
  return (
    <div className="mb-5 flex items-center" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={i} className="flex flex-1 items-center">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-normal ease-brand",
                isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-primary bg-background text-primary ring-2 ring-primary/25"
                    : "border-border bg-background text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {i < count - 1 && (
              <span className={cn("mx-1.5 h-0.5 flex-1 rounded-full transition-colors duration-normal ease-brand", isCompleted ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface BookingWizardProps {
  tutor: TutorProfile;
  initialSlot?: SelectedSlot;
  /** Set when a parent is booking on behalf of one of their children — sends `childId` so the backend records and re-verifies the parent-child relationship itself (never trusted as-is). Skips the student-self-profile lookup entirely. */
  bookingForChildId?: string;
  /** Called once a booking is successfully created (in addition to always showing the in-place confirmation step). */
  onComplete?: (booking: Booking) => void;
}

export function BookingWizard({ tutor, initialSlot, bookingForChildId, onComplete }: BookingWizardProps) {
  const { studentId: ownStudentId } = useCurrentStudentProfile({ enabled: !bookingForChildId });
  const studentId = bookingForChildId || ownStudentId;
  // Payment methods are a parent-owned surface today (Phase 9) — a
  // self-funded student booking themselves has no stored card to check out
  // with, so the payment step only applies to the parent-booking-for-child
  // flow. That student can still pay from their family's Payments page
  // once a parent adds a card (see ParentPaymentsPage's "Pay now").
  const isParentFlow = Boolean(bookingForChildId);
  const { parentId } = useCurrentParentProfile({ enabled: isParentFlow });
  const [step, setStep] = useState<Step>("lessonType");
  const [lessonType, setLessonType] = useState<"regular" | "trial">("regular");
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState<SelectedSlot | undefined>(undefined);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [timezone, setTimezone] = useState(getBrowserTimezone());
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [conflictError, setConflictError] = useState(false);
  const [idempotencyKey] = useState(() => randomUUID());
  const [checkoutIdempotencyKey] = useState(() => randomUUID());
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | undefined>(undefined);
  const [paymentResult, setPaymentResult] = useState<Payment | null>(null);
  const createBooking = useCreateBooking();
  const checkout = useCheckout();

  useEffect(() => {
    setSubjectId(tutor.subjects[0]);
    if (initialSlot) {
      setSlot(initialSlot);
      setStep(tutor.trialLessonEnabled ? "lessonType" : "duration");
    } else {
      setStep(tutor.trialLessonEnabled ? "lessonType" : tutor.subjects.length === 1 ? "datetime" : "subject");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor.id]);

  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
  // Availability slots are always expressed in the TUTOR's local time (see AvailabilityPicker/tutorAvailabilityService) — never reinterpret them in the viewing browser's timezone.
  const scheduledStart = slot ? zonedTimeToUtc(slot.date, slot.time, tutor.timezone ?? "Europe/London") : undefined;
  const scheduledEnd = scheduledStart ? new Date(scheduledStart.getTime() + durationMinutes * 60_000) : undefined;
  const estimatedPrice = pricingService.calculatePrice(tutor, durationMinutes, lessonType);

  function afterLessonType() {
    setStep(tutor.subjects.length === 1 ? "datetime" : "subject");
  }

  async function handleConfirm() {
    if (!scheduledStart || !scheduledEnd || !subjectId || !studentId) return;
    setConflictError(false);
    try {
      const booking = await createBooking.mutateAsync({
        studentId,
        input: {
          tutorId: tutor.id,
          subjectId,
          lessonType,
          scheduledStart: scheduledStart.toISOString(),
          scheduledEnd: scheduledEnd.toISOString(),
          studentTimezone: timezone,
          idempotencyKey,
          ...(bookingForChildId ? { childId: bookingForChildId } : {}),
        },
      });
      setConfirmedBooking(booking);
      if (isParentFlow) {
        // The parent flow still has a payment step ahead — `onComplete`
        // (which navigates away in every consumer, e.g. to the booking
        // detail page) must wait until that step is actually done, or the
        // payment UI would never get a chance to render.
        setStep("payment");
      } else {
        onComplete?.(booking);
        setStep("confirmation");
      }
    } catch (error) {
      if (isBookingConflictError(error)) {
        setConflictError(true);
        setSlot(undefined);
        setStep("datetime");
      }
    }
  }

  function finishWithoutPaying() {
    if (confirmedBooking) onComplete?.(confirmedBooking);
    setStep("confirmation");
  }

  async function handlePay() {
    if (!confirmedBooking || !selectedMethodId) return;
    const payment = await checkout.mutateAsync({
      bookingId: confirmedBooking.id,
      input: { paymentMethodId: selectedMethodId, idempotencyKey: checkoutIdempotencyKey },
    });
    setPaymentResult(payment);
    if (payment.status === PaymentStatus.PAID) {
      onComplete?.(confirmedBooking);
      setStep("confirmation");
    }
  }

  // Presentational-only step list — order mirrors the actual navigation logic above but never drives it.
  const allSteps: Step[] = [
    ...(tutor.trialLessonEnabled ? (["lessonType"] as Step[]) : []),
    ...(tutor.subjects.length > 1 ? (["subject"] as Step[]) : []),
    "datetime",
    "duration",
    "review",
    ...(isParentFlow ? (["payment"] as Step[]) : []),
  ];
  const currentStepIndex = step === "confirmation" ? allSteps.length : allSteps.indexOf(step);

  return (
    <div>
      {step !== "confirmation" && <WizardStepIndicator count={allSteps.length} currentIndex={currentStepIndex} />}
      <div key={step} className="animate-in fade-in duration-200">
      {step === "lessonType" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Lesson type</h3>
            <p className="text-sm text-muted-foreground">Booking with {tutor.headline}</p>
          </div>
          <RadioGroup value={lessonType} onValueChange={(v) => setLessonType(v as "regular" | "trial")}>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="regular" id="lesson-type-regular" />
              <span className="flex-1">Regular Lesson</span>
              <span className="text-muted-foreground">{formatCurrency(tutor.hourlyRate, tutor.currency)}/hr</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="trial" id="lesson-type-trial" />
              <span className="flex-1">
                Trial Lesson
                <Sparkles className="ml-1.5 inline h-3.5 w-3.5 text-primary" />
              </span>
              <span className="text-muted-foreground">{formatCurrency(tutor.trialLessonPrice ?? 0, tutor.currency)}</span>
            </label>
          </RadioGroup>
          <Button className="w-full" onClick={afterLessonType}>
            Continue
          </Button>
        </div>
      )}

      {step === "subject" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What would you like help with?</h3>
            <p className="text-sm text-muted-foreground">Booking with {tutor.headline}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {tutor.subjects.map((id) => (
                  <SelectItem key={id} value={id}>
                    {SUBJECTS.find((s) => s.id === id)?.name ?? id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-2">
            {tutor.trialLessonEnabled && (
              <Button variant="outline" onClick={() => setStep("lessonType")}>
                Back
              </Button>
            )}
            <Button className="flex-1" disabled={!subjectId} onClick={() => setStep("datetime")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "datetime" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Choose a time</h3>
            <p className="text-sm text-muted-foreground">
              {subjectName} with {tutor.headline}
            </p>
          </div>
          {conflictError && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">This time was just booked by someone else. Please choose another time.</p>
          )}
          <div className="max-h-80 overflow-y-auto pr-1">
            <AvailabilityPicker tutorId={tutor.id} selected={slot} onSelect={setSlot} />
          </div>
          <div className="flex justify-between gap-2">
            {tutor.subjects.length > 1 && (
              <Button variant="outline" onClick={() => setStep("subject")}>
                Back
              </Button>
            )}
            <Button className="flex-1" disabled={!slot} onClick={() => setStep("duration")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "duration" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Choose a duration</h3>
            <p className="text-sm text-muted-foreground">{scheduledStart && formatDateInTimezone(scheduledStart.toISOString(), timezone)}</p>
          </div>
          <RadioGroup value={String(durationMinutes)} onValueChange={(v) => setDurationMinutes(Number(v))}>
            {DURATIONS.map((d) => (
              <label key={d.minutes} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value={String(d.minutes)} id={`duration-${d.minutes}`} />
                <span className="flex-1">{d.label}</span>
                <span className="text-muted-foreground">{formatCurrency(pricingService.calculatePrice(tutor, d.minutes, lessonType), tutor.currency)}</span>
              </label>
            ))}
          </RadioGroup>
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setStep("datetime")}>
              Back
            </Button>
            <Button className="flex-1" onClick={() => setStep("review")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Your lesson</h3>
          </div>
          <div className="space-y-2 rounded-md border border-border p-4 text-sm">
            <p className="font-semibold">{tutor.headline}</p>
            <p className="text-muted-foreground">{subjectName}</p>
            {scheduledStart && scheduledEnd && (
              <>
                <p className="font-medium">{formatDateInTimezone(scheduledStart.toISOString(), timezone)}</p>
                <p className="text-muted-foreground">{formatTimeRangeInTimezone(scheduledStart.toISOString(), scheduledEnd.toISOString(), timezone)}</p>
              </>
            )}
            <p className="text-muted-foreground">{durationMinutes} minutes</p>
            <p className="text-lg font-semibold">{formatCurrency(estimatedPrice, tutor.currency)}</p>
          </div>
          <div className="space-y-1.5">
            <Label>Your timezone</Label>
            <TimezoneSelector value={timezone} onChange={setTimezone} />
            <p className="text-xs text-muted-foreground">Tutor timezone: {tutor.timezone ?? "Europe/London"}</p>
          </div>
          <label className="flex items-start gap-2.5 text-sm">
            <Checkbox checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked === true)} className="mt-0.5" />I understand the lesson time and cancellation policy.
          </label>
          {createBooking.isError && !conflictError && (
            <ErrorState title="Couldn't create your booking" description="Please try again." onRetry={handleConfirm} />
          )}
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setStep("duration")}>
              Back
            </Button>
            <Button className="flex-1" disabled={!termsAccepted} isLoading={createBooking.isPending} onClick={handleConfirm}>
              {createBooking.isPending ? "Confirming your lesson..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      )}

      {step === "payment" && confirmedBooking && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Pay for your lesson</h3>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(confirmedBooking.priceTotal, confirmedBooking.currency)} for {subjectName} with {tutor.headline}
            </p>
          </div>

          {paymentResult?.status === PaymentStatus.FAILED && (
            <div className="flex items-start gap-2.5 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Payment failed</p>
                <p className="text-destructive/90">That card was declined. Try a different payment method.</p>
              </div>
            </div>
          )}

          {parentId ? (
            <PaymentMethodSelector parentId={parentId} value={selectedMethodId} onChange={setSelectedMethodId} />
          ) : (
            <p className="text-sm text-muted-foreground">Loading your payment methods...</p>
          )}

          {checkout.isError && (
            <div className="flex items-start gap-2.5 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>Something went wrong processing your payment. Please try again.</p>
            </div>
          )}

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={finishWithoutPaying}>
              Pay later
            </Button>
            <Button className="flex-1" disabled={!selectedMethodId} isLoading={checkout.isPending} onClick={handlePay}>
              {checkout.isPending ? "Processing payment..." : `Pay ${formatCurrency(confirmedBooking.priceTotal, confirmedBooking.currency)}`}
            </Button>
          </div>
        </div>
      )}

      {step === "confirmation" && confirmedBooking && (
        <div className="space-y-4">
          {paymentResult?.status === PaymentStatus.PAID && (
            <div className="flex items-center gap-2.5 rounded-md bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="font-medium">Payment successful — you're all set.</p>
            </div>
          )}
          <BookingConfirmation booking={confirmedBooking} tutorName={tutor.headline} subjectName={subjectName ?? ""} />
        </div>
      )}
      </div>
    </div>
  );
}
