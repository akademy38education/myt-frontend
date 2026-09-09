import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { StudentProfile } from "@myt/shared";
import { HomeworkStatus } from "@myt/shared";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHomeworkList } from "@/features/homework";
import { formatDate } from "@/utils/formatters";

const TABS = [
  { value: "upcoming", label: "Upcoming", statuses: [HomeworkStatus.ASSIGNED, HomeworkStatus.IN_PROGRESS] },
  { value: "submitted", label: "Submitted", statuses: [HomeworkStatus.SUBMITTED] },
  { value: "overdue", label: "Overdue", statuses: [HomeworkStatus.OVERDUE] },
  { value: "completed", label: "Completed", statuses: [HomeworkStatus.REVIEWED] },
] as const;

const STATUS_VARIANT: Record<HomeworkStatus, "success" | "warning" | "destructive" | "outline"> = {
  [HomeworkStatus.ASSIGNED]: "outline",
  [HomeworkStatus.IN_PROGRESS]: "outline",
  [HomeworkStatus.SUBMITTED]: "warning",
  [HomeworkStatus.REVIEWED]: "success",
  [HomeworkStatus.OVERDUE]: "destructive",
};

export function ParentChildHomeworkPage() {
  const { child } = useOutletContext<{ child: StudentProfile }>();
  const { data: homework, isLoading } = useHomeworkList(child.id);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("upcoming");

  const filtered = useMemo(() => {
    if (!homework) return [];
    const activeTab = TABS.find((t) => t.value === tab);
    return homework.filter((h) => (activeTab as (typeof TABS)[number]).statuses.includes(h.status as never));
  }, [homework, tab]);

  if (isLoading) return <LoadingState label="Loading homework..." />;

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList className="flex-wrap">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title={`No ${tab} homework`} description="Nothing here yet." />
      ) : (
        <div className="space-y-2">
          {filtered.map((hw) => (
            <Card key={hw.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {hw.subjectName} · Due {formatDate(hw.dueAt)}
                  </p>
                  {hw.feedback && <p className="mt-1 text-xs text-muted-foreground">Tutor feedback: {hw.feedback}</p>}
                </div>
                <Badge variant={STATUS_VARIANT[hw.status]}>{hw.status.toLowerCase().replace(/_/g, " ")}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
