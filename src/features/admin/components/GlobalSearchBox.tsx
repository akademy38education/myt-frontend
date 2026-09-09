import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/ui/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminSearch } from "../hooks/useAdminSearch";

/**
 * Platform-wide admin search — users, tutors, bookings, support tickets and
 * reports in one box (Phase 10 spec's admin global search). Deliberately
 * lives on the dashboard rather than in the shared `Topbar` component, which
 * is reused by all four role shells and shouldn't grow an admin-only slot.
 */
export function GlobalSearchBox() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useAdminSearch(query);

  const hasResults = data && (data.users.length || data.tutors.length || data.bookings.length || data.supportTickets.length || data.reports.length);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <SearchInput value={query} onChange={setQuery} placeholder="Search users, tutors, bookings, tickets, reports..." />
        {query.trim().length > 1 && (
          <div className="space-y-4 text-sm">
            {isFetching && <p className="text-muted-foreground">Searching...</p>}
            {!isFetching && !hasResults && <p className="text-muted-foreground">No matches for "{query}".</p>}
            {data && data.users.length > 0 && (
              <SearchSection title="Users">
                {data.users.map((u) => (
                  <SearchRow key={u.id} to={`/admin/users`} label={`${u.fullName} (${u.email})`} tag={u.role} />
                ))}
              </SearchSection>
            )}
            {data && data.tutors.length > 0 && (
              <SearchSection title="Tutors">
                {data.tutors.map((t) => (
                  <SearchRow key={t.id} to="/admin/tutors" label={t.headline} />
                ))}
              </SearchSection>
            )}
            {data && data.bookings.length > 0 && (
              <SearchSection title="Bookings">
                {data.bookings.map((b) => (
                  <SearchRow key={b.id} to="/admin/bookings" label={b.id} tag={b.status} />
                ))}
              </SearchSection>
            )}
            {data && data.supportTickets.length > 0 && (
              <SearchSection title="Support tickets">
                {data.supportTickets.map((t) => (
                  <SearchRow key={t.id} to="/admin/support" label={t.subject} tag={t.status} />
                ))}
              </SearchSection>
            )}
            {data && data.reports.length > 0 && (
              <SearchSection title="Reports">
                {data.reports.map((r) => (
                  <SearchRow key={r.id} to="/admin/reports" label={r.reason} tag={r.status} />
                ))}
              </SearchSection>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SearchSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SearchRow({ to, label, tag }: { to: string; label: string; tag?: string }) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/50">
      <span className="truncate">{label}</span>
      {tag && (
        <Badge variant="outline" className="ml-2 shrink-0">
          {tag}
        </Badge>
      )}
    </Link>
  );
}
