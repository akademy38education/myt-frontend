import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/utils/cn";
import { Footer } from "@/components/marketing/Footer";
import { AnimatedLearningBackground } from "@/components/shared/AnimatedLearningBackground";

const PUBLIC_NAV = [
  { label: "How it works", to: "/how-it-works" },
  { label: "For students", to: "/for-students" },
  { label: "For parents", to: "/for-parents" },
  { label: "For tutors", to: "/for-tutors" },
  { label: "Subjects", to: "/subjects" },
  { label: "Pricing", to: "/pricing" },
];

const ROLE_HOME: Record<UserRole, string> = {
  [UserRole.STUDENT]: "/student",
  [UserRole.PARENT]: "/parent",
  [UserRole.TUTOR]: "/tutor",
  [UserRole.ADMIN]: "/admin",
};

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardPath = user ? ROLE_HOME[user.role] : "/";
  // The Home Page has its own dedicated Vanta Clouds background (Prompt 21)
  // instead of this shared CSS ambient system — every other public page
  // keeps it unchanged.
  const isHomePage = location.pathname === "/";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isHomePage && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <AnimatedLearningBackground variant="public" intensity="subtle" />
        </div>
      )}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
            MyT
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {PUBLIC_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn("text-sm font-medium text-muted-foreground hover:text-foreground", isActive && "text-foreground")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated && user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to={dashboardPath}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="truncate font-medium">{user.fullName}</p>
                      <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/select-role">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
            {PUBLIC_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted">
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && user ? (
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full" onClick={() => setMenuOpen(false)}>
                  <Link to={dashboardPath}>Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/select-role">Get started</Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
