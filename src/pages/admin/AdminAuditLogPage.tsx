import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { useAuditLogs, AdminActionCategory } from "@/features/admin-audit-log";
import { formatDateTime } from "@/utils/formatters";

const PAGE_SIZE = 20;

function enumLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, " ");
}

export function AdminAuditLogPage() {
  const [category, setCategory] = useState<AdminActionCategory | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAuditLogs({
    category: category === "all" ? undefined : category,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function handleCategoryChange(value: string) {
    setCategory(value as AdminActionCategory | "all");
    setPage(1);
  }

  function handleFromChange(value: string) {
    setFrom(value);
    setPage(1);
  }

  function handleToChange(value: string) {
    setTo(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Audit log" description="Every sensitive admin action, newest first — immutable, never edited or deleted." />

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.values(AdminActionCategory).map((value) => (
                  <SelectItem key={value} value={value}>
                    {enumLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audit-from">From</Label>
            <Input id="audit-from" type="date" value={from} onChange={(e) => handleFromChange(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audit-to">To</Label>
            <Input id="audit-to" type="date" value={to} onChange={(e) => handleToChange(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {isLoading && <LoadingState label="Loading audit log..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && data.items.length === 0 && <EmptyState title="No matching entries" description="Nothing in the audit log matches these filters." />}

      {data && data.items.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{formatDateTime(log.createdAt)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{log.actorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {enumLabel(log.actorRole)}
                      {log.actorAdminRole ? ` · ${enumLabel(log.actorAdminRole)}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{enumLabel(log.category)}</Badge>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.targetLabel ?? log.targetId ?? "—"}</TableCell>
                  <TableCell className="max-w-md whitespace-normal text-sm text-muted-foreground">{log.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
