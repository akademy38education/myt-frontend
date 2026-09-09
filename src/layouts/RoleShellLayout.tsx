import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { AnimatedLearningBackground, type LearningBackgroundVariant } from "@/components/shared/AnimatedLearningBackground";
import { cn } from "@/utils/cn";
import type { NavItem } from "@/constants/navigation";

/**
 * Shared shell for all four role layouts (Student/Parent/Tutor/Admin) — a
 * fixed sidebar on desktop, a slide-in drawer on mobile/tablet, and a
 * topbar with notifications + account menu. Role layouts only ever supply
 * `items` (see constants/navigation.ts), `roleLabel`, and `bgVariant`; page
 * content comes from nested routes rendered in <Outlet/>. `bottomNav` is an
 * optional role-specific fixed bottom bar for mobile (e.g. the student
 * app's tab bar) — when present, main content gets extra bottom padding so
 * it never hides behind it.
 *
 * The ambient `AnimatedLearningBackground` is mounted once here (`fixed`,
 * behind everything, `pointer-events-none`) so every page under every role
 * automatically gets the atmosphere (Prompt 20 §8) without each page
 * wiring its own. It shows through only in the negative space around
 * opaque UI (Sidebar/Topbar/Cards keep their own solid backgrounds) — the
 * root's own background was intentionally lightened from an opaque wash to
 * `bg-background` so the fixed layer isn't hidden behind it.
 *
 * `customBackground` swaps that default ambient layer for something else
 * entirely — used by the Student area to run `VantaRingsBackground`
 * instead across every one of its pages (a separate, later request).
 * `main` carries `text-foreground` explicitly (not just inherited from
 * `body`) so bare text with no color class of its own still resolves
 * correctly if an ancestor puts this whole tree in dark mode — see
 * `StudentLayout.tsx`, the one role that currently does.
 *
 * The root needs `isolate` (a real stacking context, not just `relative`)
 * or its own `bg-background` — painted at "positioned descendant, level 0"
 * once nothing here creates a boundary — ends up composited ABOVE the
 * `-z-10` fixed background in the browser's actual paint order, hiding it
 * completely behind a solid wash of that background color. This was a
 * real, invisible-in-practice bug: every role's background has been
 * silently hidden by this since it was introduced, only ever "working" by
 * accident where a page had its own separately-`isolate`d local decoration
 * (e.g. a dashboard's header hero card) to look at instead.
 */
export function RoleShellLayout({
  items,
  roleLabel,
  bottomNav,
  bgVariant,
  customBackground,
}: {
  items: NavItem[];
  roleLabel: string;
  bottomNav?: ReactNode;
  bgVariant: LearningBackgroundVariant;
  customBackground?: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen bg-background" data-role-accent={bgVariant}>
      <div className="fixed inset-0 -z-10 overflow-hidden">{customBackground ?? <AnimatedLearningBackground variant={bgVariant} intensity="normal" />}</div>
      <Sidebar items={items} roleLabel={roleLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar navItems={items} roleLabel={roleLabel} />
        <OfflineBanner />
        <main className={cn("relative flex-1 overflow-y-auto p-4 text-foreground lg:p-8", bottomNav && "pb-20")}>
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      {bottomNav}
    </div>
  );
}
