import { useState, type ReactNode } from "react";
import { SupportTicketStatus, type SupportTicket } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { formatDateTime } from "@/utils/formatters";
import { useSupportTickets, TicketDetailPanel } from "@/features/admin-support";

const TABS: Array<{ value: string; label: string; status?: SupportTicketStatus }> = [
  { value: "all", label: "All" },
  { value: SupportTicketStatus.OPEN, label: "Open", status: SupportTicketStatus.OPEN },
  { value: SupportTicketStatus.IN_PROGRESS, label: "In progress", status: SupportTicketStatus.IN_PROGRESS },
  { value: SupportTicketStatus.WAITING_ON_USER, label: "Waiting on user", status: SupportTicketStatus.WAITING_ON_USER },
  { value: SupportTicketStatus.RESOLVED, label: "Resolved", status: SupportTicketStatus.RESOLVED },
  { value: SupportTicketStatus.CLOSED, label: "Closed", status: SupportTicketStatus.CLOSED },
];

const STATUS_VARIANT: Record<SupportTicketStatus, BadgeProps["variant"]> = {
  [SupportTicketStatus.OPEN]: "secondary",
  [SupportTicketStatus.IN_PROGRESS]: "warning",
  [SupportTicketStatus.WAITING_ON_USER]: "outline",
  [SupportTicketStatus.RESOLVED]: "success",
  [SupportTicketStatus.CLOSED]: "muted",
};

const PRIORITY_VARIANT: Record<string, BadgeProps["variant"]> = {
  LOW: "muted",
  MEDIUM: "outline",
  HIGH: "warning",
  URGENT: "destructive",
};

/** Wraps a cell's rendered content so clicking anywhere in the row opens the ticket, since DataTable has no built-in row-click support. */
function rowClickCell(content: ReactNode, onSelect: () => void) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      {content}
    </div>
  );
}

export function AdminSupportPage() {
  const [tab, setTab] = useState("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const activeTab = TABS.find((t) => t.value === tab);
  const { data, isLoading, isError, refetch } = useSupportTickets(activeTab?.status ? { status: activeTab.status } : {});

  const columns: DataTableColumn<SupportTicket>[] = [
    {
      key: "subject",
      header: "Subject",
      sortable: true,
      sortValue: (row) => row.subject,
      render: (row) => rowClickCell(<span className="font-medium">{row.subject}</span>, () => setSelectedTicketId(row.id)),
    },
    {
      key: "requester",
      header: "Requester",
      render: (row) =>
        rowClickCell(
          <div>
            <p>{row.requesterName}</p>
            <p className="text-xs text-muted-foreground">{row.requesterRole.toLowerCase()}</p>
          </div>,
          () => setSelectedTicketId(row.id)
        ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => rowClickCell(row.category, () => setSelectedTicketId(row.id)),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      sortValue: (row) => row.priority,
      render: (row) => rowClickCell(<Badge variant={PRIORITY_VARIANT[row.priority]}>{row.priority}</Badge>, () => setSelectedTicketId(row.id)),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) =>
        rowClickCell(<Badge variant={STATUS_VARIANT[row.status]}>{row.status.replace(/_/g, " ")}</Badge>, () => setSelectedTicketId(row.id)),
    },
    {
      key: "lastMessageAt",
      header: "Last message",
      sortable: true,
      sortValue: (row) => row.lastMessageAt ?? row.updatedAt,
      render: (row) => rowClickCell(formatDateTime(row.lastMessageAt ?? row.updatedAt), () => setSelectedTicketId(row.id)),
    },
  ];

  return (
    <div>
      <PageHeader title="Support tickets" description="Respond to and manage platform support requests." />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && <LoadingState label="Loading tickets..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && (
        <DataTable
          columns={columns}
          data={data}
          getRowId={(row) => row.id}
          emptyTitle="No support tickets"
          emptyDescription="Tickets will show up here once users submit them."
        />
      )}

      <Drawer open={Boolean(selectedTicketId)} onOpenChange={(open) => !open && setSelectedTicketId(null)}>
        <DrawerContent>{selectedTicketId && <TicketDetailPanel ticketId={selectedTicketId} />}</DrawerContent>
      </Drawer>
    </div>
  );
}
