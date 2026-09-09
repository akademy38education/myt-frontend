import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Search, X } from "lucide-react";
import type { TutorProfile } from "@myt/shared";
import { SearchInput } from "@/components/ui/search-input";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { useAuth } from "@/hooks/useAuth";
import {
  useTutorSearch,
  useMarketplaceState,
  TutorCard,
  MarketplaceFilters,
  ResultsHeader,
  NoResultsSuggestions,
  MarketplaceError,
  MarketplaceSkeleton,
  computeMatchScore,
  getMarketplaceContext,
  tutorProfilePath,
} from "@/features/tutor-search";
import { BookingDialog } from "@/features/bookings";
import { useSavedTutors, useToggleSavedTutor } from "@/features/saved-tutors";
import { useTutorCompareStore, MAX_COMPARE_TUTORS, CompareBar } from "@/features/tutor-compare";
import { SUBJECTS } from "@/constants/subjects";

export function FindTutorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const context = getMarketplaceContext(location.pathname);
  const isPersonalised = context !== "public" && isAuthenticated;

  const { filter, setFilter, setPage, clearFilters, activeFilterCount } = useMarketplaceState();
  const { data, isLoading, isError, refetch } = useTutorSearch(filter);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookingTutor, setBookingTutor] = useState<TutorProfile | null>(null);

  const savedTutors = useSavedTutors();
  const toggleSaved = useToggleSavedTutor();
  const { tutorIds: compareIds, toggle: toggleCompare } = useTutorCompareStore();

  const subjectName = filter.subjectId ? SUBJECTS.find((s) => s.id === filter.subjectId)?.name : undefined;

  function handleViewProfile(tutor: TutorProfile) {
    navigate(tutorProfilePath(context, tutor.id));
  }

  function handleFindMatch() {
    if (context === "public") {
      navigate("/login", { state: { from: "/smart-match" } });
    } else {
      navigate(`/${context}/smart-match`);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10">
        <AnimatedBackground className="opacity-40" />
        <div className="relative">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find the right tutor for you.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Whether you need help with homework, exam preparation or mastering a difficult topic, MyT can help you find someone who fits.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:max-w-xl">
            <SearchInput value={filter.query ?? ""} onChange={(v) => setFilter({ query: v || undefined })} placeholder="Search subjects, topics or goals..." className="sm:flex-1" />
            <Button onClick={handleFindMatch}>
              <Sparkles className="h-4 w-4" />
              Find My Match
            </Button>
          </div>
        </div>
      </section>

      {context !== "public" && (
        <button
          type="button"
          onClick={handleFindMatch}
          className="mb-8 flex w-full flex-col gap-3 rounded-2xl border border-primary/20 bg-gradient-brand p-6 text-left text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-lg font-semibold">Not sure where to start?</p>
            <p className="mt-1 text-sm text-white/85">Tell MyT what you're looking for — we'll recommend tutors based on your subject, goals, level, preferences, availability and budget.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold sm:self-auto">
            <Search className="h-4 w-4" />
            Find My Match
          </span>
        </button>
      )}

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-8">
        <aside className="sticky top-20 hidden self-start lg:block">
          <MarketplaceFilters filter={filter} onChange={(patch) => setFilter(patch)} onClearAll={clearFilters} activeFilterCount={activeFilterCount} />
        </aside>

        <div>
          <ResultsHeader
            title={subjectName ? `${subjectName} tutors` : isPersonalised ? "Recommended for you" : "All tutors"}
            count={data?.total ?? 0}
            sort={filter.sort}
            onSortChange={(sort) => setFilter({ sort }, { resetPage: false })}
            onOpenFilters={() => setFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {isLoading && <MarketplaceSkeleton />}
          {isError && <MarketplaceError onRetry={() => refetch()} />}

          {data && data.items.length === 0 && (
            <NoResultsSuggestions
              filter={filter}
              onWidenBudget={() => setFilter({ maxPrice: undefined })}
              onClearOneFilter={(key) => setFilter({ [key]: undefined })}
              onClearAll={clearFilters}
            />
          )}

          {data && data.items.length > 0 && (
            <>
              <div className="space-y-4">
                {data.items.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    matchScore={computeMatchScore(tutor, filter)}
                    onViewProfile={handleViewProfile}
                    onBook={setBookingTutor}
                    isSaved={savedTutors.data?.some((t) => t.id === tutor.id)}
                    onToggleSave={
                      context !== "public"
                        ? (t) => toggleSaved.mutate({ tutorId: t.id, isSaved: Boolean(savedTutors.data?.some((s) => s.id === t.id)) })
                        : undefined
                    }
                    isComparing={compareIds.includes(tutor.id)}
                    onToggleCompare={context !== "public" ? (t) => toggleCompare(t.id) : undefined}
                    compareDisabled={compareIds.length >= MAX_COMPARE_TUTORS}
                  />
                ))}
              </div>
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} className="mt-6" />
            </>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DrawerContent side="right" className="overflow-y-auto">
          <div className="mb-2 flex items-center justify-between">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close filters">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <MarketplaceFilters filter={filter} onChange={(patch) => setFilter(patch)} onClearAll={clearFilters} activeFilterCount={activeFilterCount} />
          <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
            Show {data?.total ?? 0} results
          </Button>
        </DrawerContent>
      </Drawer>

      <BookingDialog tutor={bookingTutor} onOpenChange={(open) => !open && setBookingTutor(null)} />
      {context !== "public" && <CompareBar />}
    </div>
  );
}
