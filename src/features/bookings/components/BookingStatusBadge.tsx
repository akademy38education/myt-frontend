import type { Booking } from "@myt/shared";
import { Badge } from "@/components/ui/badge";
import { computeDisplayState } from "../bookingState";

const META: Record<ReturnType<typeof computeDisplayState>, { label: string; variant: "success" | "warning" | "outline" | "muted" | "destructive" | "secondary" }> = {
  pending: { label: "Pending", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "secondary" },
  "starting-soon": { label: "Starting soon", variant: "warning" },
  "in-progress": { label: "In progress", variant: "success" },
  completed: { label: "Completed", variant: "muted" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  rescheduled: { label: "Rescheduled", variant: "warning" },
  "no-show": { label: "No show", variant: "destructive" },
};

export function BookingStatusBadge({ booking }: { booking: Booking }) {
  const state = computeDisplayState(booking);
  return <Badge variant={META[state].variant}>{META[state].label}</Badge>;
}
