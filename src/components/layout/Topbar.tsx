import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NavItem } from "@/constants/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommandPalette } from "@/features/command-palette";
import { NotificationBell } from "@/features/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/utils/formatters";

export function Topbar({ navItems, roleLabel }: { navItems: NavItem[]; roleLabel: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 text-foreground lg:px-6">
      <div className="flex items-center gap-2">
        <MobileNav items={navItems} roleLabel={roleLabel} />
        <p className="font-semibold text-foreground lg:hidden">MyT</p>
      </div>

      <div className="flex items-center gap-2">
        <CommandPalette />
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{user ? initials(user.fullName) : "?"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="truncate font-medium">{user?.fullName}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("profile")}>
              <UserIcon className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("settings")}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
