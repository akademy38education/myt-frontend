import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { Clock, CornerDownLeft, Search, X, type LucideIcon } from "lucide-react";
import { UserRole, type SearchResultItem, type SearchResultType } from "@myt/shared";
import { DialogOverlay } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { ADMIN_NAV, PARENT_NAV, STUDENT_NAV, TUTOR_NAV, type NavItem } from "@/constants/navigation";
import { useDebouncedValue } from "@/features/global-search/hooks/useDebouncedValue";
import { useGlobalSearch } from "@/features/global-search/hooks/useGlobalSearch";
import { useRecentSearches } from "@/features/global-search/hooks/useRecentSearches";
import { SEARCH_RESULT_GROUP_LABELS, SEARCH_RESULT_GROUP_ORDER, SEARCH_RESULT_TYPE_LABELS } from "@/features/global-search/types";

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  [UserRole.STUDENT]: STUDENT_NAV,
  [UserRole.PARENT]: PARENT_NAV,
  [UserRole.TUTOR]: TUTOR_NAV,
  [UserRole.ADMIN]: ADMIN_NAV,
};

type PaletteRow =
  | { kind: "command"; id: string; label: string; icon: LucideIcon; to: string }
  | { kind: "recent"; id: string; query: string }
  | { kind: "result"; id: string; item: SearchResultItem };

function sectionKeyFor(row: PaletteRow): string {
  return row.kind === "result" ? `result-${row.item.type}` : row.kind;
}

function sectionLabelFor(row: PaletteRow): string {
  if (row.kind === "command") return "Go to";
  if (row.kind === "recent") return "Recent searches";
  return SEARCH_RESULT_GROUP_LABELS[row.item.type];
}

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const SHORTCUT_LABEL = isMac ? "⌘K" : "Ctrl K";

export function CommandPalette() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rowRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const debouncedQuery = useDebouncedValue(query, 350);
  const trimmedQuery = debouncedQuery.trim();
  const isSearchMode = trimmedQuery.length >= 2;

  const { data, isFetching } = useGlobalSearch(trimmedQuery);
  const { recent, addRecent } = useRecentSearches();

  const filteredCommands = React.useMemo(() => {
    const navItems = role ? NAV_BY_ROLE[role] ?? [] : [];
    const needle = query.trim().toLowerCase();
    if (!needle) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(needle));
  }, [role, query]);

  const groupedResults = React.useMemo(() => {
    const results = data?.results ?? [];
    const byType = new Map<SearchResultType, SearchResultItem[]>();
    for (const item of results) {
      const list = byType.get(item.type) ?? [];
      list.push(item);
      byType.set(item.type, list);
    }
    return SEARCH_RESULT_GROUP_ORDER.filter((type) => byType.has(type)).flatMap((type) => byType.get(type)!);
  }, [data]);

  const rows = React.useMemo<PaletteRow[]>(() => {
    const list: PaletteRow[] = filteredCommands.map((item) => ({ kind: "command", id: `command-${item.to}`, label: item.label, icon: item.icon, to: item.to }));
    if (query.trim().length === 0) {
      recent.forEach((value) => list.push({ kind: "recent", id: `recent-${value}`, query: value }));
    }
    if (isSearchMode) {
      groupedResults.forEach((item) => list.push({ kind: "result", id: `result-${item.type}-${item.id}`, item }));
    }
    return list;
  }, [filteredCommands, query, recent, isSearchMode, groupedResults]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query, groupedResults]);

  React.useEffect(() => {
    rowRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    function handleGlobalKeydown(event: KeyboardEvent) {
      if (!isAuthenticated) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, [isAuthenticated]);

  function selectRow(row: PaletteRow) {
    if (row.kind === "command") {
      setOpen(false);
      navigate(row.to);
    } else if (row.kind === "recent") {
      setQuery(row.query);
      inputRef.current?.focus();
    } else {
      addRecent(trimmedQuery);
      setOpen(false);
      navigate(row.item.link);
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const row = rows[activeIndex];
      if (row) selectRow(row);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  if (!isAuthenticated) return null;

  let lastSectionKey: string | null = null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search and command palette"
        className="flex h-9 items-center gap-2 rounded-full border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline">{SHORTCUT_LABEL}</kbd>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogOverlay />
          <DialogPrimitive.Content
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              inputRef.current?.focus();
            }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-background shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <DialogPrimitive.Title className="sr-only">Global search and commands</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Search across the platform or jump to a page. Use the arrow keys to navigate and Enter to select.
            </DialogPrimitive.Description>

            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search students, tutors, bookings... or jump to a page"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="shrink-0 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {rows.length === 0 && isSearchMode && !isFetching ? (
                <EmptyState title="No results found. Try a different search term." className="border-0 py-10" />
              ) : rows.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">Start typing to search, or pick a shortcut below.</p>
              ) : (
                rows.map((row, index) => {
                  const sectionKey = sectionKeyFor(row);
                  const showHeader = sectionKey !== lastSectionKey;
                  lastSectionKey = sectionKey;
                  const isActive = index === activeIndex;

                  return (
                    <React.Fragment key={row.id}>
                      {showHeader && (
                        <p className="px-2 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground first:pt-1">{sectionLabelFor(row)}</p>
                      )}
                      <button
                        ref={(el) => (rowRefs.current[index] = el)}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectRow(row)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm",
                          isActive ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60"
                        )}
                      >
                        {row.kind === "command" && (
                          <>
                            <row.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <span className="truncate">{row.label}</span>
                          </>
                        )}
                        {row.kind === "recent" && (
                          <>
                            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <span className="truncate">{row.query}</span>
                          </>
                        )}
                        {row.kind === "result" && (
                          <>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{row.item.title}</span>
                              {row.item.subtitle && <span className="block truncate text-xs text-muted-foreground">{row.item.subtitle}</span>}
                            </span>
                            <Badge variant="outline" className="shrink-0">
                              {SEARCH_RESULT_TYPE_LABELS[row.item.type]}
                            </Badge>
                          </>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" /> to select
              </span>
              <span>Esc to close</span>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
