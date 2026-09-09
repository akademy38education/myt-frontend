import { Link, Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-accent/50 to-muted/30 p-4">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md space-y-6">
        <Link to="/" className="flex items-center justify-center gap-2 font-semibold">
          <GraduationCap className="h-7 w-7 text-primary" aria-hidden="true" />
          <span className="text-lg">MyT</span>
        </Link>
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
