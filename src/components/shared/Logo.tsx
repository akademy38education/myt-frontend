interface LogoProps {
  className?: string;
}

/** The real MyT brand mark — replaces the generic lucide `GraduationCap` placeholder everywhere the app shows its own logo (not a contextual "education/exam" icon). */
export function Logo({ className }: LogoProps) {
  return <img src="/logo-mark.png" alt="" aria-hidden="true" className={className} />;
}
