import { useState } from "react";
import { toast } from "sonner";
import type { Payment } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatters";
import { useRefundPayment } from "../hooks/useRefundPayment";

export interface RefundPaymentDialogProps {
  payment: Payment | null;
  onOpenChange: (open: boolean) => void;
}

export function RefundPaymentDialog({ payment, onOpenChange }: RefundPaymentDialogProps) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const refundPayment = useRefundPayment();

  if (!payment) return null;

  const trimmedReason = reason.trim();
  const parsedAmount = amount ? Number(amount) : undefined;
  const amountInvalid = amount !== "" && (!Number.isFinite(parsedAmount) || (parsedAmount as number) <= 0 || (parsedAmount as number) > payment.amount);

  function reset() {
    setReason("");
    setAmount("");
  }

  async function handleConfirm() {
    if (!payment || !trimmedReason || amountInvalid) return;
    try {
      await refundPayment.mutateAsync({ paymentId: payment.id, input: { reason: trimmedReason, amount: parsedAmount } });
      toast.success(parsedAmount ? "Partial refund issued" : "Payment refunded in full");
      onOpenChange(false);
      reset();
    } catch {
      toast.error("We couldn't process this refund. Please try again.");
    }
  }

  return (
    <Dialog
      open={Boolean(payment)}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund this payment?</DialogTitle>
          <DialogDescription>
            {payment.reference ?? payment.id} — {formatCurrency(payment.amount, payment.currency)}. This updates MyT's own payment records; no real card
            network is contacted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="refund-amount">Refund amount (optional — leave blank to refund in full)</Label>
            <Input
              id="refund-amount"
              type="number"
              min={0}
              max={payment.amount}
              step="0.01"
              placeholder={formatCurrency(payment.amount, payment.currency)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amountInvalid && (
              <p className="text-xs text-destructive">Enter an amount between 0 and {formatCurrency(payment.amount, payment.currency)}.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="refund-reason">Reason (required)</Label>
            <Textarea id="refund-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this payment being refunded?" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep payment
          </Button>
          <Button variant="destructive" isLoading={refundPayment.isPending} disabled={!trimmedReason || amountInvalid} onClick={handleConfirm}>
            Confirm refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
