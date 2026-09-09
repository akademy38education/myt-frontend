import { Users, CalendarCheck, ShieldCheck, Wallet, UserX, Flag, LifeBuoy, Star } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "@/components/ui/chart";
import { useAdminOverview } from "@/features/admin";
import { GlobalSearchBox } from "@/features/admin/components/GlobalSearchBox";
import { RecommendationList } from "@/features/recommendations";
import { formatCurrency } from "@/utils/formatters";

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminOverview();

  const bookingsChartData = data
    ? Object.entries(data.bookingsByStatus).map(([status, count]) => ({ status, count }))
    : [];

  return (
    <div>
      <div className="relative isolate mb-6 overflow-hidden rounded-xl border border-border bg-card px-6 pt-5 pb-1 sm:px-8">
        <AnimatedLearningBackground variant="admin" intensity="subtle" showNodes={false} />
        <div className="relative z-10">
          <PageHeader title="Platform overview" description="A snapshot of MyT activity across all roles." />
        </div>
      </div>

      {isLoading && <LoadingState label="Loading platform overview..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && (
        <div className="space-y-6">
          {/* KPIs first — the "at a glance" numbers an admin opens this page
              for, immediately visible above the fold rather than pushed
              below a search box and the recommendations panel. */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={data.totalUsers} icon={Users} />
            <StatCard label="Total bookings" value={data.totalBookings} icon={CalendarCheck} />
            <StatCard label="Pending tutor verifications" value={data.pendingTutorVerifications} icon={ShieldCheck} />
            <StatCard label="Total revenue" value={formatCurrency(data.totalRevenue, "GBP")} icon={Wallet} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Suspended users" value={data.suspendedUsers} icon={UserX} />
            <StatCard label="Open reports" value={data.openReports} icon={Flag} />
            <StatCard label="Open support tickets" value={data.openSupportTickets} icon={LifeBuoy} />
            <StatCard label="Flagged reviews" value={data.flaggedReviews} icon={Star} />
          </div>

          <GlobalSearchBox />

          {/* Chart and "What's next?" paired together — both are
              substantial, naturally-tall content, so this row no longer
              stretches a short card to match a tall one (the previous bug:
              the search box sat next to the recommendations list, leaving a
              large blank gap under the search box whenever it had no
              results to show). */}
          <div className="grid items-start gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Bookings by status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <BarChart data={bookingsChartData}>
                    <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                    <XAxis dataKey="status" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={28} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <RecommendationList />
          </div>
        </div>
      )}
    </div>
  );
}
