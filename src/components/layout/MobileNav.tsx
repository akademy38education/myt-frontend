import { NavLink } from "react-router-dom";
import { Menu, GraduationCap } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/constants/navigation";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/utils/cn";

export function MobileNav({ items, roleLabel }: { items: NavItem[]; roleLabel: string }) {
  const isOpen = useUiStore((s) => s.isMobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent side="left" className="w-72">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
          <div className="leading-tight">
            <DrawerTitle className="text-base font-semibold">MyT</DrawerTitle>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
