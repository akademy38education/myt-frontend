import { useMemo, useState } from "react";
import { Hero } from "@/components/marketing/Hero";
import { SubjectCard } from "@/components/marketing/SubjectCard";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import { SUBJECTS, SUBJECT_CATEGORIES } from "@/constants/subjects";

export function SubjectsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return SUBJECTS.filter((subject) => {
      const matchesCategory = category === "All" || subject.category === category;
      const matchesQuery = subject.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <Hero
        eyebrow="Subjects"
        title="Find a tutor in any subject"
        description="From core GCSE and A-Level subjects to languages and creative subjects — search or browse by category."
        size="compact"
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Search subjects..." className="sm:max-w-xs" />
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="All">All</TabsTrigger>
              {SUBJECT_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No subjects found" description="Try a different search term or category." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((subject, index) => (
              <Reveal key={subject.id} delayMs={index * 30}>
                <SubjectCard
                  icon={subject.icon}
                  name={subject.name}
                  tutorCount={subject.tutorCount}
                  to={`/find-tutor?subject=${subject.id}`}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
