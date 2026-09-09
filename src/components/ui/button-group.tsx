import * as React from "react";
import { cn } from "@/utils/cn";

/**
 * Groups related Buttons into one visually joined control (e.g. a
 * Monthly/Yearly pricing toggle, a view-mode switcher). Children should be
 * plain `<Button variant="outline">` elements — ButtonGroup only handles
 * the shared border/radius joinery, not button state.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex items-center rounded-md border border-input p-1",
        "[&>button]:rounded-sm [&>button]:border-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ButtonGroup.displayName = "ButtonGroup";
