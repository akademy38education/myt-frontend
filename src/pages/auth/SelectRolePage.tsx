import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen, ArrowRight } from "lucide-react";
import { UserRole } from "@myt/shared";
import { SelectableCard } from "@/components/shared/SelectableCard";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  {
    role: UserRole.STUDENT,
    icon: BookOpen,
    title: "Student",
    tagline: "Learn smarter. Build confidence. Reach your goals.",
    cta: "I'm a Student",
  },
  {
    role: UserRole.PARENT,
    icon: Users,
    title: "Parent / Guardian",
    tagline: "Support your child's learning journey.",
    cta: "I'm a Parent",
  },
  {
    role: UserRole.TUTOR,
    icon: GraduationCap,
    title: "Tutor",
    tagline: "Teach better. Understand your students. Grow your tutoring practice.",
    cta: "I'm a Tutor",
  },
];

export function SelectRolePage() {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm to-background">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-12">
        <Link to="/" className="mx-auto flex items-center gap-2 font-semibold">
          <Logo className="h-9 w-9" />
          <span className="text-lg">MyT</span>
        </Link>

        <div className="mt-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">How will you use MyT?</h1>
          <p className="mt-3 text-muted-foreground">Choose the option that best describes you — you can always add more people later.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {ROLE_OPTIONS.map((option, index) => (
            <SelectableCard
              key={option.role}
              icon={option.icon}
              title={option.title}
              description={option.tagline}
              selected={selected === option.role}
              onSelect={() => setSelected(option.role)}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{ animationDelay: `${index * 80}ms`, animationDuration: "450ms" }}
            />
          ))}
        </div>

        <div className="mx-auto mt-10 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full"
            disabled={!selected}
            onClick={() => selected && navigate(`/register?role=${selected}`)}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
