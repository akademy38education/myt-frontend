import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import type { PaymentMethod, PaymentMethodBrand } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePaymentMethods, useAddPaymentMethod } from "../hooks/usePayments";

export interface PaymentMethodSelectorProps {
  parentId: string;
  value: string | undefined;
  onChange: (methodId: string) => void;
}

/** Lets the payer pick which stored (tokenized-only — never a raw card number) method to charge, or add a new one inline without leaving the flow (Phase 13 spec §9-10, checkout UX). */
export function PaymentMethodSelector({ parentId, value, onChange }: PaymentMethodSelectorProps) {
  const { data: methods, isLoading } = usePaymentMethods(parentId);
  const addMethod = useAddPaymentMethod(parentId);
  const [adding, setAdding] = useState(false);
  const [brand, setBrand] = useState<PaymentMethodBrand>("visa");
  const [last4, setLast4] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  function handleAdd() {
    if (last4.length !== 4 || !expiryMonth || !expiryYear) return;
    addMethod.mutate(
      { brand, last4, expiryMonth: Number(expiryMonth), expiryYear: Number(expiryYear), isDefault: (methods ?? []).length === 0 },
      {
        onSuccess: (method: PaymentMethod) => {
          onChange(method.id);
          setAdding(false);
          setLast4("");
          setExpiryMonth("");
          setExpiryYear("");
        },
      }
    );
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading payment methods...</p>;

  return (
    <div className="space-y-3">
      {methods && methods.length > 0 && (
        <RadioGroup value={value} onValueChange={onChange}>
          {methods.map((method) => (
            <label
              key={method.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <RadioGroupItem value={method.id} id={`pm-${method.id}`} />
              <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 capitalize">{method.brand}</span>
              <span className="text-muted-foreground">•••• {method.last4}</span>
              <span className="text-xs text-muted-foreground">
                Exp {String(method.expiryMonth).padStart(2, "0")}/{method.expiryYear}
              </span>
            </label>
          ))}
        </RadioGroup>
      )}

      {!adding ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" />
          {methods && methods.length > 0 ? "Add another card" : "Add a card"}
        </Button>
      ) : (
        <div className="space-y-3 rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">Only the card's brand and last 4 digits are stored — never a real card number or CVV.</p>
          <div>
            <Label>Card brand</Label>
            <Select value={brand} onValueChange={(v) => setBrand(v as PaymentMethodBrand)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">Amex</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="checkout-last4">Last 4 digits</Label>
              <Input id="checkout-last4" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="checkout-exp-month">Month</Label>
              <Input id="checkout-exp-month" maxLength={2} value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="checkout-exp-year">Year</Label>
              <Input id="checkout-exp-year" maxLength={4} value={expiryYear} onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd} disabled={last4.length !== 4 || !expiryMonth || !expiryYear || addMethod.isPending}>
              Save card
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
