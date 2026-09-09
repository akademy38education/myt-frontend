import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, CHART_COLORS } from "@/components/ui/chart";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorPerformance } from "@/features/tutor-performance";

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function TutorPerformancePage() {
  const { tutorId } = useCurrentTutorProfile();
  const { data, isLoading, isError, refetch } = useTutorPerformance(tutorId);

  if (!tutorId || isLoading) return <LoadingState label="Loading your performance..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const lessonsChartData = data.lessonsOverTime.map((w) => ({ week: w.weekStart.slice(5), count: w.count }));
  const ratingChartData = data.ratingTrend.map((r) => ({ date: r.date.slice(5), rating: r.rating }));

  return (
    <div className="space-y-6">
      <PageHeader title="Performance" description="How your teaching is trending over time." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Average rating" value={data.averageRating.toFixed(1)} hint={`${data.totalReviews} reviews`} />
        <MetricCard label="Lesson completion" value={`${data.completionRate}%`} />
        <MetricCard label="Attendance" value={`${data.attendanceRate}%`} />
        <MetricCard label="Response time" value={data.responseTimeMinutes ? `${data.responseTimeMinutes} min` : "—"} />
        <MetricCard label="Student retention" value={`${data.repeatBookingRate}%`} hint={`${data.returningStudents} returning students`} />
        <MetricCard label="Repeat bookings" value={`${data.returningStudents}`} hint="Students with more than one lesson" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lessons over time</CardTitle>
        </CardHeader>
        <CardContent>
          {lessonsChartData.every((d) => d.count === 0) ? (
            <EmptyState title="No completed lessons yet" className="py-10" />
          ) : (
            <ChartContainer height={220}>
              <BarChart data={lessonsChartData}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={28} />
                <ChartTooltip />
                <Bar dataKey="count" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rating trend</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingChartData.length === 0 ? (
            <EmptyState title="No reviews yet" className="py-10" />
          ) : (
            <ChartContainer height={220}>
              <LineChart data={ratingChartData}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} />
                <YAxis domain={[1, 5]} tickLine={false} axisLine={false} stroke="var(--chart-axis)" fontSize={12} width={24} />
                <ChartTooltip />
                <Line type="monotone" dataKey="rating" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
