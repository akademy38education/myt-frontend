import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorHomework, useReviewHomework } from "@/features/homework";
import type { HomeworkView } from "@/features/homework";
import { formatDate } from "@/utils/formatters";

function statusLabel(status: string): string {
  return status.toLowerCase().replace(/_/g, " ");
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  ASSIGNED: "outline",
  IN_PROGRESS: "outline",
  SUBMITTED: "warning",
  REVIEWED: "success",
  OVERDUE: "destructive",
};

export function TutorHomeworkPage() {
  const { tutorId } = useCurrentTutorProfile();
  const { data: homework, isLoading } = useTutorHomework(tutorId);
  const reviewHomework = useReviewHomework();
  const [reviewing, setReviewing] = useState<HomeworkView | null>(null);
  const [feedback, setFeedback] = useState("");

  if (!tutorId || isLoading) return <LoadingState label="Loading homework..." />;

  const needsReview = (homework ?? []).filter((h) => h.status === "SUBMITTED");
  const rest = (homework ?? []).filter((h) => h.status !== "SUBMITTED");

  function openReview(hw: HomeworkView) {
    setReviewing(hw);
    setFeedback(hw.feedback ?? "");
  }

  function submitReview() {
    if (!reviewing) return;
    reviewHomework.mutate({ homeworkId: reviewing.id, feedback: feedback.trim() }, { onSuccess: () => setReviewing(null) });
  }

  return (
    <div>
      <PageHeader title="Homework" description="Review and give feedback on what your students have submitted." />

      {!homework || homework.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="No homework yet" description="Homework you assign will appear here." />
      ) : (
        <div className="space-y-6">
          {needsReview.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Needs review ({needsReview.length})</h2>
              <div className="space-y-2">
                {needsReview.map((hw) => (
                  <Card key={hw.id}>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-medium">{hw.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {hw.studentName} · Due {formatDate(hw.dueAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_VARIANT[hw.status]}>{statusLabel(hw.status)}</Badge>
                        <Button size="sm" onClick={() => openReview(hw)}>
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">All homework</h2>
            <div className="space-y-2">
              {rest.map((hw) => (
                <Card key={hw.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{hw.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {hw.studentName} · Due {formatDate(hw.dueAt)}
                      </p>
                      {hw.feedback && <p className="mt-1 text-xs text-muted-foreground">Feedback: {hw.feedback}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[hw.status]}>{statusLabel(hw.status)}</Badge>
                      {hw.status === "REVIEWED" && (
                        <Button size="sm" variant="ghost" onClick={() => openReview(hw)}>
                          Edit feedback
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={Boolean(reviewing)} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reviewing?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{reviewing?.answeredCount} of {reviewing?.questions.length} questions answered.</p>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Write feedback for this student..." rows={4} />
            <Button className="w-full" onClick={submitReview} disabled={reviewHomework.isPending}>
              Mark reviewed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
