import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-warm to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center justify-center gap-2 font-semibold">
          <Logo className="h-9 w-9" />
          <span className="text-lg">MyT</span>
        </Link>
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
