import { NavLink } from "react-router-dom";
import { Home, Search, Video, ClipboardList, Menu } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/utils/cn";

const PRIMARY_TABS = [
  { label: "Home", to: "/student", icon: Home, end: true },
  { label: "Find Tutor", to: "/student/find-tutor", icon: Search, end: false },
  { label: "Lessons", to: "/student/lessons", icon: Video, end: false },
  { label: "Homework", to: "/student/homework", icon: ClipboardList, end: false },
] as const;

/**
 * Student-only mobile navigation: a fixed bottom tab bar for the four
 * highest-frequency actions, rather than a shrunk version of the desktop
 * sidebar. "More" opens the full nav drawer (shared `useUiStore` flag also
 * used by the hamburger trigger in Topbar/MobileNav) for the remaining
 * items — Progress, Goals, Messages, Calendar, Profile.
 */
export function StudentBottomNav() {
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Primary"
    >
      {PRIMARY_TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-fast",
              isActive
                ? "text-primary before:absolute before:top-0 before:h-0.5 before:w-8 before:rounded-full before:bg-primary"
                : "text-muted-foreground"
            )
          }
        >
          <tab.icon className="h-5 w-5" aria-hidden="true" />
          {tab.label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        More
      </button>
    </nav>
  );
}
