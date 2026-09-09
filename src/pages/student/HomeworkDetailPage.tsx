import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Clock, MessageSquare, Check, X } from "lucide-react";
import { HomeworkStatus } from "@myt/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { ProgressRing } from "@/components/shared/decor";
import { useHomeworkDetail, useSaveAnswer, useSubmitHomework, QuestionRenderer, homeworkService } from "@/features/homework";
import { formatRelativeToNow } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export function HomeworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: homework, isLoading, isError, refetch } = useHomeworkDetail(id ?? "");
  const saveAnswer = useSaveAnswer(id ?? "");
  const submitHomework = useSubmitHomework();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) return <LoadingState label="Loading homework..." />;
  if (isError) return <ErrorState title="We couldn't load this homework" description="Your answers are safe." onRetry={() => refetch()} />;
  if (!homework) return <NotFoundState />;

  const isDone = homework.status === HomeworkStatus.SUBMITTED || homework.status === HomeworkStatus.REVIEWED;
  const isReviewed = homework.status === HomeworkStatus.REVIEWED;
  const question = homework.questions[activeIndex];
  const currentAnswer = question ? homeworkService.getAnswer(question.id) ?? "" : "";
  const allAnswered = homework.questions.every((q) => homeworkService.getAnswer(q.id));

  async function handleSubmit() {
    await submitHomework.mutateAsync(homework!.id);
    toast.success("Homework submitted — your tutor will review it soon.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/student/homework")}>
        <ArrowLeft className="h-4 w-4" />
        Back to homework
      </Button>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">{homework.title}</h1>
              <p className="text-sm text-muted-foreground">
                {homework.subjectName} · Set by {homework.tutorName}
              </p>
            </div>
            <Badge variant={isDone ? "success" : "outline"}>
              {isReviewed ? "Reviewed" : isDone ? "Submitted" : `Due ${formatRelativeToNow(homework.dueAt)}`}
            </Badge>
          </div>
          {!isDone && (
            <div className="mt-4 space-y-1.5">
              <Progress value={(homework.answeredCount / homework.questions.length) * 100} />
              <p className="text-xs text-muted-foreground">
                {homework.answeredCount} / {homework.questions.length} answered
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isDone ? (
        <div className="space-y-6">
          <Card className="animate-in fade-in-0 zoom-in-95 duration-500">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              {typeof homework.score === "number" ? (
                <ProgressRing percent={homework.score} size={88} strokeWidth={7} color={isReviewed ? "success" : "primary"}>
                  <span className="text-xl font-semibold tabular-nums">{homework.score}%</span>
                </ProgressRing>
              ) : isReviewed ? (
                <CheckCircle2 className="h-10 w-10 text-success" />
              ) : (
                <Clock className="h-10 w-10 text-muted-foreground" />
              )}
              <p className="font-semibold">{isReviewed ? "Your tutor has reviewed this homework" : "This homework has been submitted"}</p>
              {!isReviewed && <p className="text-sm text-muted-foreground">Your tutor will mark it and share feedback soon.</p>}
              {typeof homework.score === "number" && <p className="text-xs text-muted-foreground">Auto-graded questions</p>}
            </CardContent>
          </Card>

          {homework.tutorFeedback && (
            <Card>
              <CardContent className="flex items-start gap-3 p-6">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="mb-1 text-sm font-semibold">Feedback from {homework.tutorName}</p>
                  <p className="text-sm text-muted-foreground">{homework.tutorFeedback}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {homework.questions.map((q, index) => {
              const answer = homework.answers?.find((a) => a.questionId === q.id);
              return (
                <Card key={q.id}>
                  <CardContent className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">Question {index + 1}</p>
                      {answer?.isCorrect === true && (
                        <Badge variant="success" className="gap-1">
                          <Check className="h-3 w-3" /> Correct
                        </Badge>
                      )}
                      {answer?.isCorrect === false && (
                        <Badge variant="destructive" className="gap-1">
                          <X className="h-3 w-3" /> Incorrect
                        </Badge>
                      )}
                      {answer?.isCorrect === undefined && <Badge variant="outline">Manually reviewed</Badge>}
                    </div>
                    <p className="text-sm">{q.prompt}</p>
                    <p className="text-sm text-muted-foreground">Your answer: {answer?.response ?? "—"}</p>
                    {answer?.isCorrect === false && (
                      <p className="text-sm text-success">Correct answer: {Array.isArray(q.answer) ? q.answer[0] : q.answer}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {homework.questions.map((q, index) => {
              const answered = Boolean(homeworkService.getAnswer(q.id));
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                    index === activeIndex ? "border-primary bg-primary text-primary-foreground" : answered ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground"
                  )}
                  aria-label={`Question ${index + 1}${answered ? " (answered)" : ""}`}
                  aria-current={index === activeIndex}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <Card>
            <CardContent className="space-y-4 p-6">
              {question && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Question {activeIndex + 1} of {homework.questions.length}
                    </p>
                    <Badge variant="outline">{question.topic}</Badge>
                  </div>
                  <p className="font-medium">{question.prompt}</p>
                  <QuestionRenderer
                    question={question}
                    value={currentAnswer}
                    onChange={(value) => saveAnswer.mutate({ questionId: question.id, answer: value })}
                  />
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <Button variant="ghost" disabled={activeIndex === 0} onClick={() => setActiveIndex((i) => i - 1)}>
                      Previous
                    </Button>
                    {activeIndex < homework.questions.length - 1 ? (
                      <Button onClick={() => setActiveIndex((i) => i + 1)}>Next</Button>
                    ) : (
                      <Button onClick={handleSubmit} isLoading={submitHomework.isPending} disabled={!allAnswered}>
                        Submit homework
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
