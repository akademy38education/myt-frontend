import * as React from "react";
import { cn } from "@/utils/cn";

/**
 * MyT's typography scale, as reusable components rather than scattered
 * Tailwind classes — so every heading/body size in the app comes from one
 * place. `as` lets you change the rendered tag without changing the visual
 * style (e.g. a Display-styled `h1` inside a card that should stay an
 * `h3` for outline correctness).
 */
type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function makeText<TDefault extends React.ElementType>(defaultTag: TDefault, defaultClassName: string, displayName: string) {
  const Component = React.forwardRef<HTMLElement, PolymorphicProps<React.ElementType>>(
    ({ as, className, children, ...props }, ref) => {
      const Tag = as ?? defaultTag;
      return (
        <Tag ref={ref} className={cn(defaultClassName, className)} {...props}>
          {children}
        </Tag>
      );
    }
  );
  Component.displayName = displayName;
  return Component as (props: PolymorphicProps<TDefault>) => React.ReactElement;
}

export const Display = makeText("h1", "text-5xl font-bold tracking-tight sm:text-6xl", "Display");
export const H1 = makeText("h1", "text-4xl font-bold tracking-tight sm:text-5xl", "H1");
export const H2 = makeText("h2", "text-3xl font-semibold tracking-tight sm:text-4xl", "H2");
export const H3 = makeText("h3", "text-2xl font-semibold tracking-tight sm:text-3xl", "H3");
export const H4 = makeText("h4", "text-xl font-semibold sm:text-2xl", "H4");
export const BodyLarge = makeText("p", "text-lg leading-relaxed text-muted-foreground", "BodyLarge");
export const Body = makeText("p", "text-base leading-relaxed", "Body");
export const BodySmall = makeText("p", "text-sm leading-relaxed text-muted-foreground", "BodySmall");
export const Caption = makeText("span", "text-xs font-medium uppercase tracking-wide text-muted-foreground", "Caption");
