import { useMemo, useState } from "react";
import { TutorVerificationStatus, type TutorProfile } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useAdminTutors } from "@/features/admin-directory";
import { formatCurrency, formatDate } from "@/utils/formatters";

const STATUS_VARIANT: Record<TutorVerificationStatus, BadgeProps["variant"]> = {
  [TutorVerificationStatus.UNSUBMITTED]: "muted",
  [TutorVerificationStatus.PENDING]: "warning",
  [TutorVerificationStatus.IN_REVIEW]: "secondary",
  [TutorVerificationStatus.APPROVED]: "success",
  [TutorVerificationStatus.REJECTED]: "destructive",
};

const columns: DataTableColumn<TutorProfile>[] = [
  {
    key: "headline",
    header: "Tutor",
    sortable: true,
    sortValue: (t) => t.headline,
    render: (t) => (
      <div>
        <p className="font-medium">{t.headline}</p>
        <p className="text-xs text-muted-foreground">{t.id}</p>
      </div>
    ),
  },
  {
    key: "verificationStatus",
    header: "Status",
    render: (t) => <Badge variant={STATUS_VARIANT[t.verificationStatus]}>{t.verificationStatus.replace("_", " ")}</Badge>,
  },
  { key: "subjects", header: "Subjects", render: (t) => t.subjects.join(", ") || "—" },
  {
    key: "hourlyRate",
    header: "Rate",
    sortable: true,
    sortValue: (t) => t.hourlyRate,
    render: (t) => formatCurrency(t.hourlyRate, t.currency),
  },
  { key: "rating", header: "Rating", sortable: true, sortValue: (t) => t.rating, render: (t) => `${t.rating.toFixed(1)} (${t.reviewCount})` },
  { key: "createdAt", header: "Created", sortable: true, sortValue: (t) => t.createdAt, render: (t) => formatDate(t.createdAt) },
];

export function AdminTutorsPage() {
  const { data: tutors, isLoading, isError, refetch } = useAdminTutors();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!tutors) return [];
    const term = search.trim().toLowerCase();
    if (!term) return tutors;
    return tutors.filter((t) => t.headline.toLowerCase().includes(term));
  }, [tutors, search]);

  return (
    <div>
      <PageHeader title="Tutors" description="Read-only directory of every tutor on the platform, including unverified applicants." />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name..." />
      </div>

      {isLoading && <LoadingState label="Loading tutors..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {tutors && (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(t) => t.id}
          emptyTitle="No tutors found"
          emptyDescription={search ? "Try a different search." : undefined}
        />
      )}
    </div>
  );
}
