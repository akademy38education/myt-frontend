import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSameDay, isSameWeek, isToday, startOfDay } from "date-fns";
import { Calendar, ClipboardList, GraduationCap, ListTree, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentStudentProfile } from "@/features/students";
import { useCalendarEvents, EventCalendar, CalendarEventDetailsDialog, type CalendarEvent, type CalendarEventType } from "@/features/calendar";
import { CancelBookingModal, RescheduleBookingModal } from "@/features/bookings";
import { formatDate, formatDateTime } from "@/utils/formatters";

const EVENT_ICON: Record<CalendarEventType, typeof Calendar> = {
  lesson: Calendar,
  homework: ClipboardList,
  goal: Target,
  exam: GraduationCap,
  blocked: Calendar,
};

export function StudentCalendarPage() {
  const { studentId } = useCurrentStudentProfile();
  const { data: events, isLoading } = useCalendarEvents(studentId);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);
  const [reschedulingEvent, setReschedulingEvent] = useState<CalendarEvent | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState<CalendarEvent | null>(null);

  const visibleEvents = useMemo(() => {
    if (!events) return [];
    if (view === "agenda") return events.filter((e) => new Date(e.date).getTime() >= startOfDay(new Date()).getTime());
    if (view === "week") return events.filter((e) => isSameWeek(new Date(e.date), selectedDate, { weekStartsOn: 1 }));
    return events.filter((e) => isSameDay(new Date(e.date), selectedDate));
  }, [events, view, selectedDate]);

  if (isLoading || !events) return <LoadingState label="Loading your calendar..." />;

  function openEvent(event: CalendarEvent) {
    if (event.type === "lesson") setViewingEvent(event);
  }

  return (
    <div>
      <PageHeader title="Calendar" description="Lessons, homework deadlines, goals and exams — all in one place." />

      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="mb-4">
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className={view === "agenda" ? "" : "grid gap-6 lg:grid-cols-[auto_1fr]"}>
        {view !== "agenda" && (
          <Card>
            <CardContent className="p-3">
              <EventCalendar events={events} selected={selectedDate} onSelect={(d) => d && setSelectedDate(startOfDay(d))} month={month} onMonthChange={setMonth} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            {view !== "agenda" && (
              <p className="mb-3 font-semibold">
                {view === "week" ? "This week" : isToday(selectedDate) ? "Today" : formatDateTime(selectedDate.toISOString()).split(",")[0]}
              </p>
            )}
            {visibleEvents.length === 0 ? (
              <EmptyState
                icon={ListTree}
                title="Nothing scheduled"
                description={view === "agenda" ? "No upcoming lessons, homework, goals or exams." : "No lessons, homework or goals due on this day."}
                className="py-10"
              />
            ) : view === "agenda" ? (
              <AgendaGroupedList events={visibleEvents} onEventClick={openEvent} />
            ) : (
              <EventList events={visibleEvents} onEventClick={openEvent} />
            )}
          </CardContent>
        </Card>
      </div>

      <CalendarEventDetailsDialog
        event={viewingEvent}
        onOpenChange={(open) => !open && setViewingEvent(null)}
        onReschedule={(event) => {
          setViewingEvent(null);
          setReschedulingEvent(event);
        }}
        onCancel={(event) => {
          setViewingEvent(null);
          setCancellingEvent(event);
        }}
      />
      <RescheduleBookingModal
        booking={reschedulingEvent?.booking ?? null}
        tutorName={reschedulingEvent?.tutorName ?? ""}
        subjectName={reschedulingEvent?.subjectName ?? ""}
        onOpenChange={(open) => !open && setReschedulingEvent(null)}
      />
      <CancelBookingModal
        booking={cancellingEvent?.booking ?? null}
        tutorName={cancellingEvent?.tutorName ?? ""}
        subjectName={cancellingEvent?.subjectName ?? ""}
        onOpenChange={(open) => !open && setCancellingEvent(null)}
      />
    </div>
  );
}

function EventList({ events, onEventClick }: { events: CalendarEvent[]; onEventClick: (event: CalendarEvent) => void }) {
  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <EventRow key={event.id} event={event} onEventClick={onEventClick} />
      ))}
    </ul>
  );
}

function AgendaGroupedList({ events, onEventClick }: { events: CalendarEvent[]; onEventClick: (event: CalendarEvent) => void }) {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = formatDate(event.date);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  return (
    <div className="space-y-5">
      {Array.from(groups.entries()).map(([dateLabel, group]) => (
        <div key={dateLabel}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{dateLabel}</p>
          <EventList events={group} onEventClick={onEventClick} />
        </div>
      ))}
    </div>
  );
}

function EventRow({ event, onEventClick }: { event: CalendarEvent; onEventClick: (event: CalendarEvent) => void }) {
  const Icon = EVENT_ICON[event.type];
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block font-medium">{event.title}</span>
        <span className="block text-xs text-muted-foreground">{formatDateTime(event.date)}</span>
      </span>
    </>
  );

  if (event.type === "lesson") {
    return (
      <li>
        <button type="button" onClick={() => onEventClick(event)} className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left text-sm hover:bg-muted/50">
          {content}
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link to={event.link ?? "#"} className="flex items-center gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted/50">
        {content}
      </Link>
    </li>
  );
}
