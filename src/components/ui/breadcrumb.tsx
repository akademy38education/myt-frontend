import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li>
                {item.to && !isLast ? (
                  <Link to={item.to} className="hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "font-medium text-foreground")} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
