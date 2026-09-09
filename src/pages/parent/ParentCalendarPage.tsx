import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { isSameDay, isSameWeek, isToday, startOfDay } from "date-fns";
import { Calendar, ClipboardList, GraduationCap, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/features/parents";
import { calendarService, EventCalendar, type CalendarEvent, type CalendarEventType } from "@/features/calendar";
import { formatDateTime } from "@/utils/formatters";

const EVENT_ICON: Record<CalendarEventType, typeof Calendar> = {
  lesson: Calendar,
  homework: ClipboardList,
  goal: Target,
  exam: GraduationCap,
  blocked: Calendar,
};

export function ParentCalendarPage() {
  const { user } = useAuth();
  const { data: dashboard } = useParentDashboard(user?.id ?? "");
  const children = useMemo(() => dashboard?.children ?? [], [dashboard]);
  const [childId, setChildId] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  type EventWithChild = CalendarEvent & { childId: string; childName: string };

  const eventQueries = useQueries({
    queries: children.map((child) => ({ queryKey: ["calendar-events", child.id], queryFn: () => calendarService.listEvents(child.id), enabled: children.length > 0 })),
  });
  const isLoading = eventQueries.some((q) => q.isLoading);

  const eventsByChild: EventWithChild[] = useMemo(() => {
    return eventQueries
      .flatMap((q, i) => {
        const child = children[i];
        if (!child) return [];
        return (q.data ?? []).map((e) => ({ ...e, childId: child.id, childName: child.fullName ?? child.yearGroup ?? "Child" }));
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [eventQueries, children]);

  const filteredByChild = childId ? eventsByChild.filter((e) => e.childId === childId) : eventsByChild;

  const visibleEvents = useMemo(() => {
    if (view === "week") return filteredByChild.filter((e) => isSameWeek(new Date(e.date), selectedDate, { weekStartsOn: 1 }));
    return filteredByChild.filter((e) => isSameDay(new Date(e.date), selectedDate));
  }, [filteredByChild, view, selectedDate]);

  if (isLoading) return <LoadingState label="Loading your family's calendar..." />;

  return (
    <div>
      <PageHeader title="Calendar" description="Lessons, homework and exams across all your children." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={childId ?? "all"} onValueChange={(v) => setChildId(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Children" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.fullName ?? child.yearGroup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card>
          <CardContent className="p-3">
            <EventCalendar events={filteredByChild} selected={selectedDate} onSelect={(d) => d && setSelectedDate(startOfDay(d))} month={month} onMonthChange={setMonth} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="mb-3 font-semibold">{view === "week" ? "This week" : isToday(selectedDate) ? "Today" : formatDateTime(selectedDate.toISOString()).split(",")[0]}</p>
            {visibleEvents.length === 0 ? (
              <EmptyState title="Nothing scheduled" description="No events for this period." className="py-10" />
            ) : (
              <ul className="space-y-3">
                {visibleEvents.map((event) => {
                  const Icon = EVENT_ICON[event.type];
                  return (
                    <li key={event.id}>
                      <Link to={event.link ?? "#"} className="flex items-center gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted/50">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-medium">{event.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            {event.childName} · {formatDateTime(event.date)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
