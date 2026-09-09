import { useMemo, useState } from "react";
import { Wallet, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "@/components/ui/chart";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useEarningsSummary, useEarningsList, useEarningsPayouts, tutorEarningsService } from "@/features/tutor-earnings";
import { SUBJECTS } from "@/constants/subjects";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { EarningsStatus } from "@myt/shared";

const STATUS_FILTERS: Array<{ value: EarningsStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "available", label: "Available" },
  { value: "paid", label: "Paid" },
];

function statusVariant(status: EarningsStatus): "success" | "outline" | "warning" {
  if (status === "paid") return "success";
  if (status === "available") return "outline";
  return "warning";
}

export function TutorEarningsPage() {
  const { tutorId, data: tutor } = useCurrentTutorProfile();
  const { data: summary, isLoading, isError, refetch } = useEarningsSummary(tutorId);
  const [statusFilter, setStatusFilter] = useState<EarningsStatus | "all">("all");
  const { data: entries } = useEarningsList(tutorId, statusFilter === "all" ? {} : { status: statusFilter });
  const { data: payouts } = useEarningsPayouts(tutorId);
  const currency = tutor?.currency ?? "GBP";

  const chartData = useMemo(() => {
    if (!entries) return [];
    const byWeek = new Map<string, number>();
    for (const entry of entries) {
      const d = new Date(entry.lessonDate);
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() + diff);
      const key = weekStart.toISOString().slice(0, 10);
      byWeek.set(key, (byWeek.get(key) ?? 0) + entry.netAmount);
    }
    return Array.from(byWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, amount]) => ({ week, amount: Math.round(amount * 100) / 100 }));
  }, [entries]);

  async function handleExport() {
    const csv = await tutorEarningsService.exportCsv(tutorId, statusFilter === "all" ? {} : { status: statusFilter });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${tutorId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!tutorId || isLoading) return <LoadingState label="Loading your earnings..." />;
  if (isError || !summary) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings"
        description="Your income from completed lessons."
        actions={
          <Button variant="outline" onClick={handleExport} disabled={!entries || entries.length === 0}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">This month</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.thisMonth, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">This week</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.thisWeek, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.pending, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(summary.available, currency)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings over time</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <EmptyState icon={Wallet} title="No earnings yet" description="Complete your first lesson to start earning." className="py-10" />
          ) : (
            <ChartContainer height={240}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={40} />
                <ChartTooltip />
                <Bar dataKey="amount" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Breakdown</CardTitle>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {!entries || entries.length === 0 ? (
            <EmptyState title="No earnings entries" description="Nothing matches this filter yet." className="py-10" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.lessonDate)}</TableCell>
                    <TableCell>{SUBJECTS.find((s) => s.id === entry.subjectId)?.name ?? entry.subjectId}</TableCell>
                    <TableCell>{entry.durationMinutes} min</TableCell>
                    <TableCell>{formatCurrency(entry.grossAmount, entry.currency)}</TableCell>
                    <TableCell>{formatCurrency(entry.platformFeeAmount, entry.currency)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(entry.netAmount, entry.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(entry.status)}>{entry.status}</Badge>
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
          <CardTitle>Payout history</CardTitle>
        </CardHeader>
        <CardContent>
          {!payouts || payouts.length === 0 ? (
            <EmptyState title="No payouts yet" description="Payouts appear here once your earnings are settled." className="py-10" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      {formatDate(payout.periodStart)} – {formatDate(payout.periodEnd)}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(payout.amount, payout.currency)}</TableCell>
                    <TableCell className="font-mono text-xs">{payout.reference}</TableCell>
                    <TableCell>
                      <Badge variant="success">{payout.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
