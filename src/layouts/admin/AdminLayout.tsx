import { RoleShellLayout } from "@/layouts/RoleShellLayout";
import { ADMIN_NAV } from "@/constants/navigation";

export function AdminLayout() {
  return <RoleShellLayout items={ADMIN_NAV} roleLabel="Administrator" bgVariant="admin" />;
}
