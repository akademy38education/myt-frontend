import { useMemo } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { useBookings } from "@/features/bookings";
import { useHomeworkList } from "@/features/homework";
import { useSubjectMastery } from "@/features/mastery";
import { computeLearningStatus, LEARNING_STATUS_LABEL, LEARNING_STATUS_VARIANT } from "@/features/family";
import { SUBJECTS } from "@/constants/subjects";
import { initials } from "@/utils/formatters";
import { BookingStatus, HomeworkStatus } from "@myt/shared";
import { cn } from "@/utils/cn";

const TABS = [
  { to: "", label: "Overview", end: true },
  { to: "progress", label: "Progress" },
  { to: "lessons", label: "Lessons" },
  { to: "homework", label: "Homework" },
  { to: "reports", label: "Reports" },
  { to: "tutors", label: "Tutors" },
];

export function ParentChildLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading, isError, refetch } = useChildren(parentId);
  const child = children?.find((c) => c.id === id);

  const { data: bookings } = useBookings({ studentId: id });
  const { data: homework } = useHomeworkList(id ?? "");
  const { data: mastery } = useSubjectMastery(id ?? "");

  const attendanceRate = useMemo(() => {
    if (!bookings) return null;
    const completed = bookings.filter((b) => b.status === BookingStatus.COMPLETED).length;
    const noShows = bookings.filter((b) => b.status === BookingStatus.NO_SHOW).length;
    return completed + noShows > 0 ? Math.round((completed / (completed + noShows)) * 100) : null;
  }, [bookings]);

  const avgProgress = useMemo(() => {
    if (!mastery || mastery.length === 0) return null;
    return Math.round(mastery.reduce((sum, m) => sum + m.overallPercent, 0) / mastery.length);
  }, [mastery]);

  const overdueHomeworkCount = homework?.filter((h) => h.status === HomeworkStatus.OVERDUE).length ?? 0;

  if (!parentId || isLoading) return <LoadingState label="Loading child profile..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!child) return <NotFoundState />;

  const status = computeLearningStatus({ avgProgress, overdueHomeworkCount, attendanceRate });

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/parent/children")}>
        <ArrowLeft className="h-4 w-4" />
        Back to children
      </Button>

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{initials(child.fullName ?? "Student")}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{child.fullName}</h1>
              <p className="text-sm text-muted-foreground">{child.yearGroup}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {child.subjects.map((sid) => (
                  <Badge key={sid} variant="outline">
                    {SUBJECTS.find((s) => s.id === sid)?.name ?? sid}
                  </Badge>
                ))}
                <Badge variant={LEARNING_STATUS_VARIANT[status]}>● {LEARNING_STATUS_LABEL[status]}</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/parent/messages")}>
            <MessageSquare className="h-4 w-4" />
            Message Tutor
          </Button>
        </CardContent>
      </Card>

      <nav className="mb-6 inline-flex flex-wrap items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn("rounded-sm px-3 py-1.5 text-sm font-medium transition-all", isActive ? "bg-background text-foreground shadow-sm" : "hover:text-foreground")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet context={{ child }} />
    </div>
  );
}
