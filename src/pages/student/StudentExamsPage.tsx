import { Link } from "react-router-dom";
import { CalendarDays, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardListSkeleton } from "@/components/shared/CardListSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useExams } from "@/features/exam-mode";
import { SUBJECTS } from "@/constants/subjects";
import { formatDateTime } from "@/utils/formatters";

export function StudentExamsPage() {
  const { data: exams, isLoading } = useExams();

  return (
    <div>
      <PageHeader title="Exam Preparation" description="Your upcoming exams and revision progress." />

      {isLoading && <CardListSkeleton withAvatar={false} />}

      {exams && exams.length === 0 && <EmptyState icon={GraduationCap} title="No exams scheduled" description="Once your tutor logs an exam date, it'll show up here." />}

      {exams && exams.length > 0 && (
        <div className="space-y-4">
          {exams.map((exam) => {
            const subjectName = SUBJECTS.find((s) => s.id === exam.subjectId)?.name ?? exam.subjectId;
            return (
              <Card key={exam.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{exam.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {subjectName} · {exam.examBoard}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {formatDateTime(exam.date)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revision progress</span>
                      <span className="font-medium">{exam.revisionProgress}%</span>
                    </div>
                    <Progress value={exam.revisionProgress} />
                  </div>

                  {exam.topicsToRevise.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-sm font-medium">Topics to revise</p>
                      <p className="text-sm text-muted-foreground">{exam.topicsToRevise.join(", ")}</p>
                    </div>
                  )}

                  <Button size="sm" variant="outline" asChild>
                    <Link to="/student/library">Start revising</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
