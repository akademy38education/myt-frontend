import { RoleShellLayout } from "@/layouts/RoleShellLayout";
import { TUTOR_NAV } from "@/constants/navigation";

export function TutorLayout() {
  return <RoleShellLayout items={TUTOR_NAV} roleLabel="Tutor" bgVariant="tutor" />;
}
