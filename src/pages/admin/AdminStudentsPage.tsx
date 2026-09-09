import { useMemo, useState } from "react";
import type { StudentProfile } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { useAdminStudents } from "@/features/admin-directory";
import { formatDate } from "@/utils/formatters";

const columns: DataTableColumn<StudentProfile>[] = [
  {
    key: "name",
    header: "Student",
    sortable: true,
    sortValue: (s) => s.fullName ?? "",
    render: (s) => (
      <div>
        <p className="font-medium">{s.fullName ?? "Unnamed student"}</p>
        <p className="text-xs text-muted-foreground">{s.id}</p>
      </div>
    ),
  },
  { key: "parentId", header: "Parent", render: (s) => s.parentId ?? "—" },
  { key: "yearGroup", header: "Year group", sortable: true, sortValue: (s) => s.yearGroup, render: (s) => s.yearGroup },
  { key: "subjects", header: "Subjects", render: (s) => s.subjects.join(", ") || "—" },
  { key: "timezone", header: "Timezone", render: (s) => s.timezone },
  { key: "createdAt", header: "Created", sortable: true, sortValue: (s) => s.createdAt, render: (s) => formatDate(s.createdAt) },
];

export function AdminStudentsPage() {
  const { data: students, isLoading, isError, refetch } = useAdminStudents();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!students) return [];
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((s) => (s.fullName ?? "").toLowerCase().includes(term));
  }, [students, search]);

  return (
    <div>
      <PageHeader title="Students" description="Read-only directory of every student profile on the platform." />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name..." />
      </div>

      {isLoading && <LoadingState label="Loading students..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {students && (
        <DataTable
          columns={columns}
          data={filtered}
          getRowId={(s) => s.id}
          emptyTitle="No students found"
          emptyDescription={search ? "Try a different search." : undefined}
        />
      )}
    </div>
  );
}
