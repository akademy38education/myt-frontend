import { useQuery } from "@tanstack/react-query";
import { libraryService, type LibraryFilter } from "../services/libraryService";
import type { LibraryResourceMock } from "@/mocks";

export function useLibrarySearch(filter: LibraryFilter) {
  return useQuery({ queryKey: ["library", filter], queryFn: () => libraryService.search(filter) });
}

export function useLibraryResource(id: string) {
  return useQuery({ queryKey: ["library", "resource", id], queryFn: () => libraryService.getById(id), enabled: Boolean(id) });
}

export function useRelatedResources(resource: LibraryResourceMock | undefined) {
  return useQuery({
    queryKey: ["library", "related", resource?.id],
    queryFn: () => libraryService.getRelated(resource!),
    enabled: Boolean(resource),
  });
}
