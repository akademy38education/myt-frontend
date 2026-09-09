import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { registerSchema, type RegisterInput, UserRole } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/features/authentication";

// New registrants go straight into their role's onboarding wizard rather
// than an empty dashboard — see docs/product/README.md's onboarding flow.
const ROLE_ONBOARDING_START: Record<UserRole, string> = {
  [UserRole.STUDENT]: "/onboarding/student",
  [UserRole.PARENT]: "/onboarding/parent",
  [UserRole.TUTOR]: "/onboarding/tutor",
  [UserRole.ADMIN]: "/admin",
};

function isUserRole(value: string | null): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: isUserRole(roleParam) ? roleParam : UserRole.STUDENT },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const session = await registerUser.mutateAsync(values);
      toast.success("Account created — welcome to MyT!");
      navigate(ROLE_ONBOARDING_START[session.user.role], { replace: true });
    } catch {
      toast.error("We couldn't create your account. Please try again.");
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted-foreground">It only takes a minute.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <input type="hidden" {...register("role")} />

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" autoComplete="name" {...register("fullName")} aria-invalid={Boolean(errors.fullName)} />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" isLoading={registerUser.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
