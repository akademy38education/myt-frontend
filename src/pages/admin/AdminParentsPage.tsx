import { useMemo, useState } from "react";
import type { ParentProfile } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { useAdminParents } from "@/features/admin-directory";
import { formatDate } from "@/utils/formatters";

const columns: DataTableColumn<ParentProfile>[] = [
  {
    key: "name",
    header: "Parent",
    sortable: true,
    sortValue: (p) => p.fullName ?? "",
    render: (p) => (
      <div>
        <p className="font-medium">{p.fullName ?? "Unnamed parent"}</p>
        <p className="text-xs text-muted-foreground">{p.id}</p>
      </div>
    ),
  },
  { key: "billingEmail", header: "Billing email", render: (p) => p.billingEmail ?? "—" },
  { key: "phone", header: "Phone", render: (p) => p.phone ?? "—" },
  { key: "children", header: "Children", sortable: true, sortValue: (p) => p.childrenIds.length, render: (p) => p.childrenIds.length },
  { key: "createdAt", header: "Created", sortable: true, sortValue: (p) => p.createdAt, render: (p) => formatDate(p.createdAt) },
];

export function AdminParentsPage() {
  const { data: parents, isLoading, isError, refetch } = useAdminParents();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!parents) return [];
    const term = search.trim().toLowerCase();
    if (!term) return parents;
    return parents.filter((p) => (p.fullName ?? "").toLowerCase().includes(term));
  }, [parents, search]);

  return (
    <div>
      <PageHeader title="Parents" description="Read-only directory of every parent account on the platform." />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name..." />
      </div>

      {isLoading && <LoadingState label="Loading parents..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {parents && (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(p) => p.id}
          emptyTitle="No parents found"
          emptyDescription={search ? "Try a different search." : undefined}
        />
      )}
    </div>
  );
}
