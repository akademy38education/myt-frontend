import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

/**
 * Placeholder for routes whose navigation entry and layout already exist
 * (proving the route architecture) but whose feature has not been built
 * yet in this phase — see the matching feature's README under
 * src/features/<name>/ for its intended scope.
 */
export function ComingSoonPage({ title }: { title?: string }) {
  const location = useLocation();
  const resolvedTitle = title ?? location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "This page";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title={capitalize(resolvedTitle)} />
      <EmptyState
        icon={Construction}
        title="Coming soon"
        description="This part of MyT is scaffolded and on the roadmap, but hasn't been built yet."
      />
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
