import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { ContentStatus, PERMISSIONS, type ContentItem } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermission } from "@/hooks/usePermission";
import { formatDate } from "@/utils/formatters";
import { useAdminContent, useSetContentStatus, ContentEditorDialog } from "@/features/admin-content";

const TABS: Array<{ value: string; label: string; status?: ContentStatus }> = [
  { value: "all", label: "All" },
  { value: ContentStatus.DRAFT, label: "Draft", status: ContentStatus.DRAFT },
  { value: ContentStatus.PENDING_REVIEW, label: "Pending review", status: ContentStatus.PENDING_REVIEW },
  { value: ContentStatus.PUBLISHED, label: "Published", status: ContentStatus.PUBLISHED },
  { value: ContentStatus.ARCHIVED, label: "Archived", status: ContentStatus.ARCHIVED },
];

const STATUS_LABELS: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: "Draft",
  [ContentStatus.PENDING_REVIEW]: "Pending review",
  [ContentStatus.PUBLISHED]: "Published",
  [ContentStatus.ARCHIVED]: "Archived",
};

const STATUS_VARIANT: Record<ContentStatus, BadgeProps["variant"]> = {
  [ContentStatus.DRAFT]: "muted",
  [ContentStatus.PENDING_REVIEW]: "outline",
  [ContentStatus.PUBLISHED]: "success",
  [ContentStatus.ARCHIVED]: "secondary",
};

export function AdminContentPage() {
  const canEdit = usePermission(PERMISSIONS.CONTENT_EDIT);
  const [tab, setTab] = useState("all");
  const [editor, setEditor] = useState<{ open: boolean; contentId: string | null }>({ open: false, contentId: null });
  const [pendingPublish, setPendingPublish] = useState<ContentItem | null>(null);

  const activeTab = TABS.find((t) => t.value === tab);
  const { data, isLoading, isError, refetch } = useAdminContent(activeTab?.status ? { status: activeTab.status } : {});
  const setStatus = useSetContentStatus();

  function handleStatusSelect(item: ContentItem, status: ContentStatus) {
    if (status === item.status) return;
    if (status === ContentStatus.PUBLISHED) {
      setPendingPublish(item);
      return;
    }
    setStatus.mutate({ id: item.id, input: { status } });
  }

  async function confirmPublish() {
    if (!pendingPublish) return;
    try {
      await setStatus.mutateAsync({ id: pendingPublish.id, input: { status: ContentStatus.PUBLISHED } });
      setPendingPublish(null);
    } catch {
      // Toast already surfaced by useSetContentStatus's onError; keep the confirm dialog open to retry.
    }
  }

  const columns: DataTableColumn<ContentItem>[] = [
    { key: "type", header: "Type", render: (row) => <Badge variant="outline">{row.type}</Badge> },
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortValue: (row) => row.title,
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    { key: "slug", header: "Slug", render: (row) => <code className="text-xs text-muted-foreground">{row.slug}</code> },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABELS[row.status]}</Badge>,
    },
    { key: "version", header: "Version", sortable: true, sortValue: (row) => row.version, render: (row) => `v${row.version}` },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      sortValue: (row) => row.updatedAt,
      render: (row) => formatDate(row.updatedAt),
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        canEdit ? (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditor({ open: true, contentId: row.id })}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Select value={row.status} onValueChange={(v) => handleStatusSelect(row, v as ContentStatus)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContentStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Content"
        description="Manage platform pages, announcements and FAQs."
        actions={
          canEdit ? (
            <Button onClick={() => setEditor({ open: true, contentId: null })}>
              <Plus className="h-4 w-4" />
              New content
            </Button>
          ) : undefined
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <LoadingState label="Loading content..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && (
        <DataTable
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          emptyTitle="No content yet"
          emptyDescription="Create the platform's first page, announcement or FAQ."
        />
      )}

      <ContentEditorDialog open={editor.open} contentId={editor.contentId} onOpenChange={(open) => setEditor((s) => ({ ...s, open }))} />

      <Dialog open={Boolean(pendingPublish)} onOpenChange={(open) => !open && setPendingPublish(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish this content?</DialogTitle>
            <DialogDescription>"{pendingPublish?.title}" will become visible to everyone on the platform immediately.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingPublish(null)}>
              Cancel
            </Button>
            <Button isLoading={setStatus.isPending} onClick={confirmPublish}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
