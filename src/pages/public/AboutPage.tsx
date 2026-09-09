import { Link } from "react-router-dom";
import { Target, Sparkles, LineChart, GraduationCap, Users, Eye } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { icon: Target, title: "Better tutoring", description: "Tutoring shouldn't be a one-off transaction. MyT is built around a full learning journey, from diagnosis to mastery." },
  { icon: Sparkles, title: "Better matching", description: "SmartMatch looks at goals and gaps, not just star ratings, to recommend the tutor who actually fits." },
  { icon: LineChart, title: "Better learning decisions", description: "Every recommendation — a resource, a homework question, a next topic — is grounded in real mastery data." },
  { icon: GraduationCap, title: "Student progress", description: "We measure success in topic-level mastery gained, not lessons booked." },
  { icon: Users, title: "Tutor empowerment", description: "Tutors get an AI co-pilot and real student context, so their expertise goes further in every session." },
  { icon: Eye, title: "Parent visibility", description: "Recordings, summaries and reports mean parents never have to just take it on faith." },
];

export function AboutPage() {
  return (
    <div>
      <Hero
        eyebrow="About MyT"
        title="We're building the tutoring platform we wished existed"
        description="Not a marketplace that stops at the booking — a platform that manages the whole learning journey, for every role involved in it."
        size="compact"
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="What we believe" title="The ideas behind MyT" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delayMs={index * 40}>
              <FeatureCard {...pillar} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading title="Want to be part of it?" description="Whether you're a student, parent or tutor — MyT is built for you." />
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/select-role">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/help">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
