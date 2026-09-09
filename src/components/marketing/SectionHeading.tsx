import { cn } from "@/utils/cn";
import { Caption, H2 } from "@/components/ui/typography";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent "eyebrow + title + description" header used above every marketing section. */
export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && <Caption className="mb-2 block text-primary">{eyebrow}</Caption>}
      <H2>{title}</H2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}
