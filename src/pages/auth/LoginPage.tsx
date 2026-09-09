import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema, type LoginInput, UserRole } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiError } from "@/api/client";
import { useLogin } from "@/features/authentication";
import { setRememberSession } from "@/stores/authStore";
import { firstName } from "@/utils/formatters";
import { env } from "@/config/env";

const ROLE_HOME: Record<UserRole, string> = {
  [UserRole.STUDENT]: "/student",
  [UserRole.PARENT]: "/parent",
  [UserRole.TUTOR]: "/tutor",
  [UserRole.ADMIN]: "/admin",
};

const DEMO_PASSWORD = "Password123!";
const DEMO_ACCOUNTS = [
  { label: "Student", email: "amelia.student@myt.dev", name: "Amelia Carter" },
  { label: "Tutor", email: "sofia.tutor@myt.dev", name: "Dr. Sofia Reyes" },
  { label: "Parent", email: "james.parent@myt.dev", name: "James Carter" },
  { label: "Admin", email: "priya.admin@myt.dev", name: "Priya Nair" },
] as const;

/**
 * `login.mutateAsync` only ever throws `ApiError` (an HTTP-level failure —
 * see `api/client.ts`) or a raw fetch exception (a real network failure,
 * since `client.ts` catches JSON-parse failures itself). Branch on that
 * distinction, and within `ApiError` on `status`, rather than collapsing
 * every failure into "wrong password" — a rate-limit 429 or a 500 is not
 * the same problem as bad credentials, and telling the user the wrong one
 * sends them down the wrong recovery path (e.g. resetting a password that
 * was never wrong).
 */
function describeLoginError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return "Too many login attempts. Please wait a few minutes and try again.";
    if (error.status === 401) return "That email and password don't match. Try again or reset your password.";
    if (error.status === 403) return error.message || "Your account can't sign in right now. Contact support if this seems wrong.";
    return "Something went wrong on our end. Please try again in a moment.";
  }
  return "We couldn't reach MyT. Check your connection and try again.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const performLogin = async (values: LoginInput) => {
    setRememberSession(rememberMe);
    try {
      const session = await login.mutateAsync(values);
      toast.success(`Welcome back, ${firstName(session.user.fullName)}`);
      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from ?? ROLE_HOME[session.user.role], { replace: true });
    } catch (error) {
      toast.error(describeLoginError(error));
    }
  };

  const onSubmit = handleSubmit(performLogin);

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Welcome back to MyT</h1>
        <p className="text-sm text-muted-foreground">
          Try <span className="font-medium text-foreground">amelia.student@myt.dev</span> / Password123!
        </p>
      </div>

      {env.VITE_USE_MOCK_API && (
        <div className="rounded-lg border border-dashed border-border p-3">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Demo accounts — one click, no password needed</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                className="h-auto flex-col gap-0.5 py-2"
                disabled={login.isPending}
                onClick={() => performLogin({ email: account.email, password: DEMO_PASSWORD })}
              >
                <span>Login as {account.label}</span>
                <span className="text-[10px] font-normal text-muted-foreground">{account.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
          Remember me
        </label>

        <Button type="submit" className="w-full" isLoading={login.isPending}>
          {login.isPending ? "Signing you in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => toast.info("Google sign-in isn't configured yet — this button is integration-ready.")}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to MyT?{" "}
        <Link to="/select-role" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
