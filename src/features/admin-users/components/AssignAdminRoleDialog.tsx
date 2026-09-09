import { useEffect, useState } from "react";
import { PERMISSIONS } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermission } from "@/hooks/usePermission";
import { useAssignAdminRole } from "../hooks/useAssignAdminRole";
import { AdminRole, UserRole, type User } from "../types";

const NONE_VALUE = "__none__";

export interface AssignAdminRoleDialogProps {
  user: User | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Only meaningful for users whose UserRole is already ADMIN, and only usable
 * by a viewer holding ADMIN_ROLES_MANAGE (Super Admin only, per
 * ADMIN_ROLE_PERMISSIONS) — the backend enforces both, this just keeps the
 * UI from ever offering an action it would reject.
 */
export function AssignAdminRoleDialog({ user, onOpenChange }: AssignAdminRoleDialogProps) {
  const canManageAdminRoles = usePermission(PERMISSIONS.ADMIN_ROLES_MANAGE);
  const [selected, setSelected] = useState<string>(NONE_VALUE);
  const assignAdminRole = useAssignAdminRole();

  useEffect(() => {
    if (user) setSelected(user.adminRole ?? NONE_VALUE);
  }, [user]);

  if (!user || !canManageAdminRoles || user.role !== UserRole.ADMIN) return null;

  async function handleConfirm() {
    if (!user) return;
    const adminRole = selected === NONE_VALUE ? null : (selected as AdminRole);
    try {
      await assignAdminRole.mutateAsync({ userId: user.id, input: { adminRole } });
      onOpenChange(false);
      setSelected(NONE_VALUE);
    } catch {
      // Toast already surfaced by useAssignAdminRole's onError.
    }
  }

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setSelected(NONE_VALUE);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change admin role</DialogTitle>
          <DialogDescription>
            {user.fullName} ({user.email}) — currently {user.adminRole ?? "no admin sub-role"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Admin sub-role</Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Select an admin role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>None / remove admin role</SelectItem>
              {Object.values(AdminRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button isLoading={assignAdminRole.isPending} onClick={handleConfirm}>
            Save role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
