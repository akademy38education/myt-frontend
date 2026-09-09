import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { GridCardSkeleton } from "@/components/shared/CardListSkeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLibrarySearch, ResourceCard } from "@/features/learning-library";
import { SUBJECTS } from "@/constants/subjects";
import type { LibraryResourceType } from "@/mocks";

const TYPES: LibraryResourceType[] = ["video", "article", "worksheet", "practice", "guide", "revision"];

export function StudentLibraryPage() {
  const [query, setQuery] = useState("");
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<LibraryResourceType | undefined>(undefined);

  const { data: resources, isLoading, isError, refetch } = useLibrarySearch({ query: query || undefined, subjectId, type });

  return (
    <div>
      <PageHeader title="Learning Library" description="Videos, articles, worksheets and revision guides matched to your subjects." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={query} onChange={setQuery} placeholder="Search resources..." className="sm:flex-1" />
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => setType(v as LibraryResourceType)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <GridCardSkeleton />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && resources && resources.length === 0 && <EmptyState title="No resources found" description="Try a different search or filter." />}

      {resources && resources.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
