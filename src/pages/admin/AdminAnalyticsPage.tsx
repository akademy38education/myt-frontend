import { TrendingUp, Wallet, Receipt, PiggyBank, CheckCircle2, XCircle, UserX, Repeat, ShieldAlert, ShieldCheck, FileText } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "@/components/ui/chart";
import { useAdminAnalytics, useFinancialReconciliation } from "@/features/admin";
import { formatCurrency } from "@/utils/formatters";

function statusLabel(status: string): string {
  return status.toLowerCase().replace(/_/g, " ");
}

function reconciliationIssueLabel(type: string): string {
  return type.toLowerCase().replace(/_/g, " ");
}

export function AdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAdminAnalytics();
  const { data: reconciliation, isLoading: isReconciliationLoading } = useFinancialReconciliation();

  if (isLoading) return <LoadingState label="Loading analytics..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const bookingsChartData = Object.entries(data.bookings.byStatus).map(([status, count]) => ({ status: statusLabel(status), count }));
  const revenueChartData = [
    { name: "Gross", amount: data.revenue.gross },
    { name: "Fees", amount: data.revenue.platformFees },
    { name: "Payouts", amount: data.revenue.payouts },
    { name: "Net", amount: data.revenue.net },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform growth, revenue and booking trends, computed from real activity." />

      <Card>
        <CardHeader>
          <CardTitle>User growth</CardTitle>
        </CardHeader>
        <CardContent>
          {data.userGrowth.length === 0 ? (
            <EmptyState title="Not enough data yet" description="User growth appears here once monthly signups accumulate." className="py-10" />
          ) : (
            <>
              <ChartContainer height={260}>
                <LineChart data={data.userGrowth}>
                  <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={40} />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="newUsers" name="New users" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="cumulativeUsers" name="Cumulative users" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[0] }} />
                  New users
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[1] }} />
                  Cumulative users
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Revenue</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Gross revenue" value={formatCurrency(data.revenue.gross, data.revenue.currency)} icon={Wallet} />
          <StatCard label="Platform fees" value={formatCurrency(data.revenue.platformFees, data.revenue.currency)} icon={Receipt} />
          <StatCard label="Tutor payouts" value={formatCurrency(data.revenue.payouts, data.revenue.currency)} icon={PiggyBank} />
          <StatCard label="Net revenue" value={formatCurrency(data.revenue.net, data.revenue.currency)} icon={TrendingUp} />
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Revenue breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer height={220}>
              <BarChart data={revenueChartData}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={48} />
                <ChartTooltip formatter={(value: number) => formatCurrency(value, data.revenue.currency)} />
                <Bar dataKey="amount" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Payments (Phase 13)</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Transactions succeeded" value={data.revenue.transactionsSucceeded} icon={CheckCircle2} />
          <StatCard label="Transactions failed" value={data.revenue.transactionsFailed} icon={XCircle} />
          <StatCard label="Refunded total" value={formatCurrency(data.revenue.refundedTotal, data.revenue.currency)} icon={Receipt} />
          <StatCard label="Invoices issued" value={data.revenue.invoicesIssued} icon={FileText} />
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {reconciliation && reconciliation.issues.length > 0 ? (
                <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              )}
              Financial reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isReconciliationLoading ? (
              <LoadingState label="Checking payment ledger..." />
            ) : !reconciliation || reconciliation.issues.length === 0 ? (
              <EmptyState
                title="No issues found"
                description={`${reconciliation?.totalTransactions ?? 0} transactions and ${reconciliation?.totalInvoices ?? 0} invoices checked — no mismatches detected.`}
                className="py-8"
              />
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {reconciliation.issues.length} issue{reconciliation.issues.length === 1 ? "" : "s"} found across {reconciliation.totalTransactions} transactions and{" "}
                  {reconciliation.totalInvoices} invoices.
                </p>
                {reconciliation.issues.map((issue, index) => (
                  <div key={`${issue.type}-${issue.transactionId ?? issue.bookingId ?? issue.invoiceId ?? index}`} className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <Badge variant="destructive" className="shrink-0">
                      {reconciliationIssueLabel(issue.type)}
                    </Badge>
                    <p className="text-muted-foreground">{issue.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Bookings</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total bookings" value={data.bookings.total} icon={TrendingUp} />
          <StatCard label="Completion rate" value={`${data.bookings.completionRate}%`} icon={CheckCircle2} />
          <StatCard label="Cancellation rate" value={`${data.bookings.cancellationRate}%`} icon={XCircle} />
          <StatCard label="No-show rate" value={`${data.bookings.noShowRate}%`} icon={UserX} />
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Bookings by status</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsChartData.length === 0 ? (
              <EmptyState title="No bookings yet" className="py-10" />
            ) : (
              <ChartContainer height={220}>
                <BarChart data={bookingsChartData}>
                  <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={32} />
                  <ChartTooltip />
                  <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-start justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Repeat booking rate</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{data.repeatBookingRate}%</p>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              Share of students with more than one booking — an honest proxy for retention, not a full cohort or lifetime-value analysis.
            </p>
          </div>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Repeat className="h-5 w-5" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
