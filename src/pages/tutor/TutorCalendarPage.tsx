import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSameDay, isSameWeek, isToday, startOfDay } from "date-fns";
import { Ban, Calendar, ListTree } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorCalendarEvents, EventCalendar, CalendarEventDetailsDialog, type CalendarEvent, type CalendarEventType } from "@/features/calendar";
import { CancelBookingModal, RescheduleBookingModal } from "@/features/bookings";
import { formatDateTime } from "@/utils/formatters";

const EVENT_ICON: Record<CalendarEventType, typeof Calendar> = {
  lesson: Calendar,
  homework: Calendar,
  goal: Calendar,
  exam: Calendar,
  blocked: Ban,
};

export function TutorCalendarPage() {
  const { tutorId } = useCurrentTutorProfile();
  const { data: events, isLoading } = useTutorCalendarEvents(tutorId);
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

  return (
    <div>
      <PageHeader title="Calendar" description="Lessons you're teaching and time you've blocked off." />

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
              <EmptyState icon={ListTree} title="Nothing scheduled" description="No lessons or blocked time in this period." className="py-10" />
            ) : (
              <ul className="space-y-3">
                {visibleEvents.map((event) => {
                  const Icon = EVENT_ICON[event.type];
                  const isClickableLesson = event.type === "lesson";
                  const inner = (
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
                  return (
                    <li key={event.id}>
                      {isClickableLesson ? (
                        <button type="button" onClick={() => setViewingEvent(event)} className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left text-sm hover:bg-muted/50">
                          {inner}
                        </button>
                      ) : (
                        <Link to={event.link ?? "#"} className="flex items-center gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted/50">
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
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
