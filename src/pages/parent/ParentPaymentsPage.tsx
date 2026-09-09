import { useState } from "react";
import { CreditCard, Download, FileText, Plus, Star, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import {
  usePaymentSummary,
  usePaymentsList,
  usePaymentMethods,
  useAddPaymentMethod,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
  paymentsService,
  PaymentMethodSelector,
  type Payment,
} from "@/features/payments";
import { useCheckout } from "@/features/bookings";
import { useMyInvoices, invoicesService } from "@/features/invoices";
import { randomUUID } from "@/utils/uuid";
import { SUBJECTS } from "@/constants/subjects";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { PaymentMethodBrand, PaymentStatus } from "@myt/shared";

function statusVariant(status: PaymentStatus): "success" | "warning" | "destructive" | "outline" {
  if (status === "PAID") return "success";
  if (status === "PENDING") return "outline";
  if (status === "FAILED") return "destructive";
  return "warning";
}

export function ParentPaymentsPage() {
  const { parentId } = useCurrentParentProfile();
  const { data: children } = useChildren(parentId);
  const { data: summary, isLoading, isError, refetch } = usePaymentSummary(parentId);
  const [childFilter, setChildFilter] = useState<string>("all");
  const { data: payments } = usePaymentsList(parentId, childFilter === "all" ? {} : { childId: childFilter });
  const { data: methods } = usePaymentMethods(parentId);
  const { data: invoices } = useMyInvoices();
  const addMethod = useAddPaymentMethod(parentId);
  const removeMethod = useRemovePaymentMethod(parentId);
  const setDefaultMethod = useSetDefaultPaymentMethod(parentId);

  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [brand, setBrand] = useState<PaymentMethodBrand>("visa");
  const [last4, setLast4] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const [payNowPayment, setPayNowPayment] = useState<Payment | null>(null);
  const [payNowMethodId, setPayNowMethodId] = useState<string | undefined>(undefined);
  const [payNowIdempotencyKey, setPayNowIdempotencyKey] = useState(() => randomUUID());
  const checkout = useCheckout();

  function openPayNow(payment: Payment) {
    setPayNowPayment(payment);
    setPayNowMethodId(undefined);
    setPayNowIdempotencyKey(randomUUID());
  }

  async function handlePayNow() {
    if (!payNowPayment || !payNowMethodId) return;
    try {
      const result = await checkout.mutateAsync({
        bookingId: payNowPayment.bookingId,
        input: { paymentMethodId: payNowMethodId, idempotencyKey: payNowIdempotencyKey },
      });
      if (result.status === "PAID") {
        toast.success("Payment successful");
        setPayNowPayment(null);
      } else {
        toast.error("That card was declined. Try a different payment method.");
      }
    } catch {
      toast.error("Something went wrong processing your payment.");
    }
  }

  const childNameById = new Map((children ?? []).map((c) => [c.id, c.fullName ?? "Student"]));

  async function handleDownloadInvoice(paymentId: string) {
    const text = await paymentsService.exportInvoice(parentId, paymentId);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${paymentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadInvoiceDoc(invoiceId: string, number: string) {
    const text = await invoicesService.download(invoiceId);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddMethod() {
    if (last4.length !== 4 || !expiryMonth || !expiryYear) return;
    addMethod.mutate(
      { brand, last4, expiryMonth: Number(expiryMonth), expiryYear: Number(expiryYear), isDefault: (methods ?? []).length === 0 },
      {
        onSuccess: () => {
          toast.success("Payment method added");
          setMethodDialogOpen(false);
          setLast4("");
          setExpiryMonth("");
          setExpiryYear("");
        },
      }
    );
  }

  if (!parentId || isLoading) return <LoadingState label="Loading payments..." />;
  if (isError || !summary) return <ErrorState onRetry={() => refetch()} />;

  const currency = summary.currency;

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Your family's spending, payment methods and invoices." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">This month</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.thisMonth, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Last month</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.lastMonth, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.upcoming, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Needs attention</p>
            <p className="mt-1 text-2xl font-semibold">{summary.overdueCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment methods</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setMethodDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {!methods || methods.length === 0 ? (
            <EmptyState icon={CreditCard} title="No payment methods yet" description="Add a card to pay for lessons." className="py-8" />
          ) : (
            <div className="space-y-2">
              {methods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{method.brand}</span>
                    <span className="text-sm text-muted-foreground">•••• {method.last4}</span>
                    <span className="text-xs text-muted-foreground">
                      Exp {String(method.expiryMonth).padStart(2, "0")}/{method.expiryYear}
                    </span>
                    {method.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button size="sm" variant="ghost" onClick={() => setDefaultMethod.mutate(method.id)}>
                        <Star className="h-4 w-4" />
                        Set default
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => removeMethod.mutate(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment history</CardTitle>
          {(children?.length ?? 0) > 1 && (
            <Select value={childFilter} onValueChange={setChildFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All children</SelectItem>
                {(children ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent>
          {!payments || payments.length === 0 ? (
            <EmptyState icon={Wallet} title="No payments yet" description="Payments appear here once you book a lesson." className="py-10" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.lessonDate ?? payment.createdAt)}</TableCell>
                    <TableCell>{childNameById.get(payment.studentId ?? "") ?? "—"}</TableCell>
                    <TableCell>{SUBJECTS.find((s) => s.id === payment.subjectId)?.name ?? payment.subjectId ?? "—"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(payment.status)}>{payment.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center justify-end gap-1">
                      {(payment.status === "PENDING" || payment.status === "FAILED") && (
                        <Button size="sm" variant="outline" onClick={() => openPayNow(payment)}>
                          Pay now
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDownloadInvoice(payment.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {!invoices || invoices.length === 0 ? (
            <EmptyState icon={FileText} title="No invoices yet" description="A real, numbered invoice is issued automatically once a lesson is paid for." className="py-8" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{formatDate(invoice.issuedAt)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "issued" ? "success" : "outline"}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => handleDownloadInvoiceDoc(invoice.id, invoice.number)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={methodDialogOpen} onOpenChange={setMethodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">For this demo, only the card's brand and last 4 digits are stored — never a real card number or CVV.</p>
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
              <div className="col-span-1">
                <Label htmlFor="last4">Last 4 digits</Label>
                <Input id="last4" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="exp-month">Month</Label>
                <Input id="exp-month" maxLength={2} value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="exp-year">Year</Label>
                <Input id="exp-year" maxLength={4} value={expiryYear} onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, ""))} className="mt-1.5" />
              </div>
            </div>
            <Button className="w-full" onClick={handleAddMethod} disabled={last4.length !== 4 || !expiryMonth || !expiryYear || addMethod.isPending}>
              Add Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(payNowPayment)} onOpenChange={(open) => !open && setPayNowPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {payNowPayment ? formatCurrency(payNowPayment.amount, payNowPayment.currency) : ""}</DialogTitle>
          </DialogHeader>
          {payNowPayment && (
            <div className="space-y-4">
              <PaymentMethodSelector parentId={parentId} value={payNowMethodId} onChange={setPayNowMethodId} />
              <Button className="w-full" disabled={!payNowMethodId} isLoading={checkout.isPending} onClick={handlePayNow}>
                {checkout.isPending ? "Processing payment..." : `Pay ${formatCurrency(payNowPayment.amount, payNowPayment.currency)}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
