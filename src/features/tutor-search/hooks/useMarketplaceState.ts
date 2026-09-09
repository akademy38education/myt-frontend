import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { TutorSearchFilter, TutorSortOrder } from "../types";

const STRING_KEYS = ["query", "subjectId", "yearLevel", "curriculum", "teachingStyle", "availability", "language"] as const;
const NUMBER_KEYS = ["minRating", "minPrice", "maxPrice"] as const;
const BOOLEAN_KEYS = ["verifiedOnly", "trialAvailable"] as const;

/**
 * Keeps the marketplace's search/filter/sort/page state synchronized with
 * the URL (`?subject=...&sort=...&page=...`), per the Phase 5 spec's
 * "URL-synchronized filters" requirement — refresh, back/forward and
 * sharing a search link all just work because the URL *is* the state.
 */
export function useMarketplaceState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo<TutorSearchFilter>(() => {
    const result: TutorSearchFilter = {};
    for (const key of STRING_KEYS) {
      const value = searchParams.get(key);
      if (value) result[key] = value;
    }
    for (const key of NUMBER_KEYS) {
      const value = searchParams.get(key);
      if (value) result[key] = Number(value);
    }
    for (const key of BOOLEAN_KEYS) {
      const value = searchParams.get(key);
      if (value === "true") result[key] = true;
    }
    const sort = searchParams.get("sort");
    if (sort) result.sort = sort as TutorSortOrder;
    const page = searchParams.get("page");
    result.page = page ? Number(page) : 1;
    return result;
  }, [searchParams]);

  const setFilter = useCallback(
    (patch: Partial<TutorSearchFilter>, options: { resetPage?: boolean } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === "" || value === false) next.delete(key);
            else next.set(key, String(value));
          }
          if (options.resetPage !== false) next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (page <= 1) next.delete("page");
          else next.set("page", String(page));
          return next;
        },
        { replace: false } // pushes a history entry so Back steps through pages, matching browser expectations
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const activeFilterCount = STRING_KEYS.filter((k) => filter[k]).length + NUMBER_KEYS.filter((k) => filter[k] !== undefined).length + BOOLEAN_KEYS.filter((k) => filter[k]).length;

  return { filter, setFilter, setPage, clearFilters, activeFilterCount };
}
