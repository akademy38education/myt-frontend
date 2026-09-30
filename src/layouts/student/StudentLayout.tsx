import { RoleShellLayout } from "@/layouts/RoleShellLayout";
import { StudentBottomNav } from "@/components/layout/StudentBottomNav";
import { STUDENT_NAV } from "@/constants/navigation";

/**
 * The Student area previously ran `VantaRingsBackground` across every page —
 * feedback called the spinning ring animation distracting/messy, so it's
 * been removed in favour of `RoleShellLayout`'s default ambient background
 * (the same clean, subtle system the Parent/Tutor/Admin areas already use).
 */
export function StudentLayout() {
  return <RoleShellLayout items={STUDENT_NAV} roleLabel="Student" bottomNav={<StudentBottomNav />} bgVariant="student" />;
}
