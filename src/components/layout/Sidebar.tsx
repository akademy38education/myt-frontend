import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import type { NavItem } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function Sidebar({ items, roleLabel }: { items: NavItem[]; roleLabel: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card text-card-foreground lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
        <div className="leading-tight">
          <p className="font-semibold text-foreground">MyT</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast",
                isActive
                  ? "bg-primary/10 text-primary before:absolute before:-left-1 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
