import { useState } from "react";
import { PERMISSIONS, TutorVerificationStatus, type TutorApplicationWithApplicant } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/usePermission";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  useVerificationQueue,
  ApproveTutorDialog,
  RejectTutorDialog,
  RequestInfoDialog,
} from "@/features/admin-tutor-verification";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STATUS_VARIANT: Record<TutorVerificationStatus, BadgeProps["variant"]> = {
  [TutorVerificationStatus.UNSUBMITTED]: "muted",
  [TutorVerificationStatus.PENDING]: "warning",
  [TutorVerificationStatus.IN_REVIEW]: "secondary",
  [TutorVerificationStatus.APPROVED]: "success",
  [TutorVerificationStatus.REJECTED]: "destructive",
};

export function AdminTutorVerificationPage() {
  const [statusTab, setStatusTab] = useState<"ALL" | TutorVerificationStatus>("ALL");
  const { data: applications, isLoading, isError, refetch } = useVerificationQueue(statusTab === "ALL" ? {} : { status: statusTab });

  const [detailApplication, setDetailApplication] = useState<TutorApplicationWithApplicant | null>(null);
  const [approveTarget, setApproveTarget] = useState<TutorApplicationWithApplicant | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TutorApplicationWithApplicant | null>(null);
  const [requestInfoTarget, setRequestInfoTarget] = useState<TutorApplicationWithApplicant | null>(null);

  const canVerify = usePermission(PERMISSIONS.TUTORS_VERIFY);

  const columns: DataTableColumn<TutorApplicationWithApplicant>[] = [
    {
      key: "applicantName",
      header: "Applicant",
      sortable: true,
      sortValue: (a) => a.applicantName,
      render: (a) => (
        <div>
          <p className="font-medium">{a.applicantName}</p>
          <p className="text-xs text-muted-foreground">
            {a.headline} · {a.applicantEmail}
          </p>
        </div>
      ),
    },
    { key: "subjects", header: "Subjects", render: (a) => a.subjects.join(", ") || "—" },
    {
      key: "yearsExperience",
      header: "Experience",
      sortable: true,
      sortValue: (a) => a.yearsExperience,
      render: (a) => `${a.yearsExperience} yrs`,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      sortable: true,
      sortValue: (a) => a.submittedAt ?? a.createdAt,
      render: (a) => formatDate(a.submittedAt ?? a.createdAt),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <Badge variant={STATUS_VARIANT[a.status]}>{a.status.replace("_", " ")}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (a) => (
        <Button size="sm" variant="outline" onClick={() => setDetailApplication(a)}>
          Review
        </Button>
      ),
    },
  ];

  const canDecide =
    canVerify &&
    detailApplication &&
    (detailApplication.status === TutorVerificationStatus.PENDING || detailApplication.status === TutorVerificationStatus.IN_REVIEW);

  return (
    <div>
      <PageHeader title="Tutor verification queue" description="Review submitted tutor applications before they go live on the marketplace." />

      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as "ALL" | TutorVerificationStatus)} className="mb-4">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value={TutorVerificationStatus.PENDING}>Pending</TabsTrigger>
          <TabsTrigger value={TutorVerificationStatus.IN_REVIEW}>In review</TabsTrigger>
          <TabsTrigger value={TutorVerificationStatus.APPROVED}>Approved</TabsTrigger>
          <TabsTrigger value={TutorVerificationStatus.REJECTED}>Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <LoadingState label="Loading verification queue..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {applications && (
        <DataTable
          columns={columns}
          data={applications}
          getRowId={(a) => a.id}
          emptyTitle="No applications"
          emptyDescription="There's nothing in this part of the queue right now."
        />
      )}

      <Dialog open={Boolean(detailApplication)} onOpenChange={(open) => !open && setDetailApplication(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {detailApplication && (
            <>
              <DialogHeader>
                <DialogTitle>{detailApplication.applicantName}</DialogTitle>
                <DialogDescription>
                  {detailApplication.applicantEmail} · {detailApplication.headline} — submitted{" "}
                  {formatDate(detailApplication.submittedAt ?? detailApplication.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_VARIANT[detailApplication.status]}>{detailApplication.status.replace("_", " ")}</Badge>
                  {detailApplication.location && <span className="text-muted-foreground">{detailApplication.location}</span>}
                </div>

                <div>
                  <h3 className="font-medium">Bio</h3>
                  <p className="mt-1 text-muted-foreground">{detailApplication.bio}</p>
                </div>

                {detailApplication.lessonApproach && (
                  <div>
                    <h3 className="font-medium">Lesson approach</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.lessonApproach}</p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Subjects</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.subjects.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Year levels</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.yearLevels.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Curricula</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.curricula.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Languages</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.languages.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Teaching style</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.teachingStyle}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Years of experience</h3>
                    <p className="mt-1 text-muted-foreground">{detailApplication.yearsExperience}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Hourly rate</h3>
                    <p className="mt-1 text-muted-foreground">{formatCurrency(detailApplication.hourlyRate, detailApplication.currency)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Trial lesson</h3>
                    <p className="mt-1 text-muted-foreground">
                      {detailApplication.trialLessonEnabled
                        ? detailApplication.trialLessonPrice !== undefined
                          ? formatCurrency(detailApplication.trialLessonPrice, detailApplication.currency)
                          : "Enabled"
                        : "Not offered"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Qualifications</h3>
                  {detailApplication.qualifications.length > 0 ? (
                    <ul className="mt-1 space-y-1.5">
                      {detailApplication.qualifications.map((q) => (
                        <li key={q.id} className="rounded-md border border-border p-2 text-muted-foreground">
                          <span className="font-medium text-foreground">{q.title}</span>
                          {q.institution && ` — ${q.institution}`} ({q.year}){q.subject && ` · ${q.subject}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-muted-foreground">No qualifications listed.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Availability</h3>
                  {detailApplication.availability.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {detailApplication.availability.map((slot, index) => (
                        <li key={index} className="text-muted-foreground">
                          {DAYS[slot.dayOfWeek]}, {slot.startTime}–{slot.endTime}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-muted-foreground">No availability submitted.</p>
                  )}
                </div>
              </div>

              {canDecide && (
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => setRequestInfoTarget(detailApplication)}>
                    Request info
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={() => setRejectTarget(detailApplication)}>
                      Reject
                    </Button>
                    <Button onClick={() => setApproveTarget(detailApplication)}>Approve</Button>
                  </div>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <ApproveTutorDialog
        application={approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        onApproved={() => setDetailApplication(null)}
      />
      <RejectTutorDialog
        application={rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onRejected={() => setDetailApplication(null)}
      />
      <RequestInfoDialog
        application={requestInfoTarget}
        onOpenChange={(open) => !open && setRequestInfoTarget(null)}
        onRequested={() => setDetailApplication(null)}
      />
    </div>
  );
}
