import { useEffect, useState } from "react";
import { PERMISSIONS, UserAccountStatus, UserRole, type User } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";
import { useAdminUsers, useReactivateUser, SuspendUserDialog, AssignAdminRoleDialog } from "@/features/admin-users";

const ALL_ROLES = "__all_roles__";
const ALL_STATUSES = "__all_statuses__";
const PAGE_SIZE = 100;
const SEARCH_DEBOUNCE_MS = 350;

function accountStatusVariant(status: UserAccountStatus): "success" | "warning" | "destructive" {
  if (status === UserAccountStatus.ACTIVE) return "success";
  if (status === UserAccountStatus.SUSPENDED) return "warning";
  return "destructive";
}

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const canView = usePermission(PERMISSIONS.USERS_VIEW);
  const canSuspend = usePermission(PERMISSIONS.USERS_SUSPEND);
  const canManageAdminRoles = usePermission(PERMISSIONS.ADMIN_ROLES_MANAGE);

  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [accountStatus, setAccountStatus] = useState<UserAccountStatus | undefined>(undefined);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [roleTarget, setRoleTarget] = useState<User | null>(null);

  // Small local debounce so every keystroke doesn't fire a new search request.
  useEffect(() => {
    const handle = setTimeout(() => setQ(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useAdminUsers(
    { q: q || undefined, role, accountStatus, page: 1, pageSize: PAGE_SIZE },
    { enabled: canView }
  );
  const reactivateUser = useReactivateUser();

  if (!canView) {
    return (
      <div>
        <PageHeader title="Users" />
        <ErrorState title="Access denied" description="You don't have permission to view platform users." />
      </div>
    );
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (row) => row.fullName,
      render: (row) => (
        <div>
          <p className="font-medium">{row.fullName}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      sortValue: (row) => row.role,
      render: (row) => <Badge variant="outline">{row.role}</Badge>,
    },
    {
      key: "adminRole",
      header: "Admin sub-role",
      render: (row) => (row.role === UserRole.ADMIN && row.adminRole ? <Badge variant="secondary">{row.adminRole}</Badge> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "accountStatus",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.accountStatus,
      render: (row) => <Badge variant={accountStatusVariant(row.accountStatus)}>{row.accountStatus}</Badge>,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      sortValue: (row) => row.createdAt,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <div className="flex flex-wrap gap-2">
            {canSuspend && row.accountStatus !== UserAccountStatus.SUSPENDED && row.accountStatus !== UserAccountStatus.BANNED && (
              <Button size="sm" variant="outline" disabled={isSelf} onClick={() => setSuspendTarget(row)}>
                Suspend
              </Button>
            )}
            {canSuspend && row.accountStatus === UserAccountStatus.SUSPENDED && (
              <Button
                size="sm"
                variant="outline"
                disabled={isSelf}
                isLoading={reactivateUser.isPending && reactivateUser.variables?.userId === row.id}
                onClick={() => reactivateUser.mutate({ userId: row.id })}
              >
                Reactivate
              </Button>
            )}
            {canManageAdminRoles && row.role === UserRole.ADMIN && (
              <Button size="sm" variant="outline" disabled={isSelf} onClick={() => setRoleTarget(row)}>
                Change admin role
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Users" description="Search, suspend/reactivate accounts, and manage admin sub-roles." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={searchInput} onChange={setSearchInput} placeholder="Search by name or email..." className="sm:max-w-xs" />

        <Select value={role ?? ALL_ROLES} onValueChange={(v) => setRole(v === ALL_ROLES ? undefined : (v as UserRole))}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES}>All roles</SelectItem>
            {Object.values(UserRole).map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={accountStatus ?? ALL_STATUSES} onValueChange={(v) => setAccountStatus(v === ALL_STATUSES ? undefined : (v as UserAccountStatus))}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
            {Object.values(UserAccountStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingState label="Loading users..." />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && (
        <DataTable
          columns={columns}
          data={data.items}
          getRowId={(row) => row.id}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
      )}

      <SuspendUserDialog user={suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)} />
      <AssignAdminRoleDialog user={roleTarget} onOpenChange={(open) => !open && setRoleTarget(null)} />
    </div>
  );
}
