import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/marketing/Hero";
import { SubjectCard } from "@/components/marketing/SubjectCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PricingCard } from "@/components/marketing/PricingCard";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import { SUBJECTS, SUBJECT_CATEGORIES } from "@/constants/subjects";
import { PRICING_PLANS } from "@/constants/pricingPlans";
import { FAQS } from "@/constants/faqs";

const PRICING_FAQS = FAQS.filter((f) => f.category === "Payments" || f.category === "Bookings");

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
        eyebrow="Subjects & Pricing"
        title="Find a tutor in any subject"
        description="From core GCSE and A-Level subjects to languages and creative subjects — search or browse by category, then see exactly how pricing works."
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

      {/* ---- Pricing (merged in from the standalone Pricing page/nav item) ---- */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Pricing" title="Simple, transparent pricing" description="No subscription fees for students or parents." />
          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_PLANS.map((plan, index) => (
              <Reveal key={plan.name} delayMs={index * 60}>
                <PricingCard {...plan} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Live payment processing is being configured — sign-up and search work today; checkout will be enabled ahead of launch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16">
        <SectionHeading title="Pricing questions" align="left" className="mx-0 text-left" />
        <Accordion type="single" collapsible>
          {PRICING_FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/help">See all FAQs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
