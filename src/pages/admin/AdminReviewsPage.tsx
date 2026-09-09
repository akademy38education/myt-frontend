import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { PERMISSIONS, ReviewModerationStatus, type Review } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";
import { formatDate } from "@/utils/formatters";
import { useAdminReviews, ModerateReviewDialog, type AdminReviewFilter } from "@/features/admin-reviews";

type TabValue = "ALL" | ReviewModerationStatus;

const TABS: { value: TabValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: ReviewModerationStatus.PUBLISHED, label: "Published" },
  { value: ReviewModerationStatus.FLAGGED, label: "Flagged" },
  { value: ReviewModerationStatus.HIDDEN, label: "Hidden" },
  { value: ReviewModerationStatus.REMOVED, label: "Removed" },
];

const STATUS_BADGE_VARIANT: Record<ReviewModerationStatus, "success" | "warning" | "muted" | "destructive"> = {
  [ReviewModerationStatus.PUBLISHED]: "success",
  [ReviewModerationStatus.FLAGGED]: "warning",
  [ReviewModerationStatus.HIDDEN]: "muted",
  [ReviewModerationStatus.REMOVED]: "destructive",
};

function truncate(text: string, max = 80): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export function AdminReviewsPage() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [reviewToModerate, setReviewToModerate] = useState<Review | null>(null);
  const canModerate = usePermission(PERMISSIONS.REVIEWS_MODERATE);

  const filter: AdminReviewFilter = useMemo(() => (tab === "ALL" ? {} : { moderationStatus: tab }), [tab]);
  const { data: reviews, isLoading, isError, refetch } = useAdminReviews(filter);

  const columns: DataTableColumn<Review>[] = [
    { key: "tutorId", header: "Tutor", sortable: true, sortValue: (r) => r.tutorId, render: (r) => <span className="font-mono text-xs">{r.tutorId}</span> },
    {
      key: "studentId",
      header: "Student",
      sortable: true,
      sortValue: (r) => r.studentId,
      render: (r) => <span className="font-mono text-xs">{r.studentId}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      sortValue: (r) => r.rating,
      render: (r) => (
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-current text-warning" aria-hidden="true" />
          {r.rating}
        </span>
      ),
    },
    {
      key: "comment",
      header: "Comment",
      render: (r) =>
        r.comment ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">{truncate(r.comment)}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-wrap">{r.comment}</TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-muted-foreground">No comment</span>
        ),
    },
    {
      key: "moderationStatus",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.moderationStatus,
      render: (r) => <Badge variant={STATUS_BADGE_VARIANT[r.moderationStatus]}>{r.moderationStatus}</Badge>,
    },
    { key: "createdAt", header: "Submitted", sortable: true, sortValue: (r) => r.createdAt, render: (r) => formatDate(r.createdAt) },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canModerate ? (
          <Button size="sm" variant="outline" onClick={() => setReviewToModerate(r)}>
            Moderate
          </Button>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader title="Review moderation" description="Approve, flag, hide or remove tutor reviews." />

      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <LoadingState label="Loading reviews..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {reviews && (
        <DataTable
          columns={columns}
          data={reviews}
          getRowId={(r) => r.id}
          emptyTitle="No reviews found"
          emptyDescription="There are no reviews matching this filter."
        />
      )}

      <ModerateReviewDialog review={reviewToModerate} onOpenChange={(open) => !open && setReviewToModerate(null)} />
    </div>
  );
}
