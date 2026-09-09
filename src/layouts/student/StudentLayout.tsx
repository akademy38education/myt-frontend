import { RoleShellLayout } from "@/layouts/RoleShellLayout";
import { StudentBottomNav } from "@/components/layout/StudentBottomNav";
import { VantaRingsBackground } from "@/components/background/VantaRingsBackground";
import { STUDENT_NAV } from "@/constants/navigation";

/**
 * The Student area runs `VantaRingsBackground` across every page (sidebar,
 * navbar, bottom nav, all routes) — a separate, later request from the
 * rest of the app.
 *
 * Stays on the normal light theme (an earlier version of this also forced
 * a dark theme here, but the ring canvas is deliberately translucent
 * (`backgroundAlpha: 0.6` — see `VantaRingsBackground.tsx`), so it blends
 * with whatever's behind it: over a light page it reads as the bright
 * teal-with-vivid-rings look from the reference image; over a dark navy
 * page the same colors turn muddy and the rings nearly disappear, which is
 * exactly what happened and why the dark theme was reverted).
 */
export function StudentLayout() {
  return (
    <RoleShellLayout
      items={STUDENT_NAV}
      roleLabel="Student"
      bottomNav={<StudentBottomNav />}
      bgVariant="student"
      customBackground={<VantaRingsBackground />}
    />
  );
}
