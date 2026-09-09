import { RoleShellLayout } from "@/layouts/RoleShellLayout";
import { PARENT_NAV } from "@/constants/navigation";

export function ParentLayout() {
  return <RoleShellLayout items={PARENT_NAV} roleLabel="Parent" bgVariant="parent" />;
}
