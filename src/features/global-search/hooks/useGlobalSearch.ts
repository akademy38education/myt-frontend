import { useQuery } from "@tanstack/react-query";
import { globalSearchService } from "../services/globalSearchService";

/** Fires `GET /search?q=` once `query` (already trimmed) is 2+ characters — callers own their own debouncing via `useDebouncedValue`. */
export function useGlobalSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["global-search", trimmed],
    queryFn: () => globalSearchService.search(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 15_000,
  });
}
