import { Link } from "react-router-dom";
import { LineChart, Users, CalendarCheck, FileBarChart, ClipboardList, CreditCard, MessageSquare } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: LineChart, title: "Child progress", description: "See real mastery per topic and subject, not just a grade at the end of term." },
  { icon: Users, title: "Tutor management", description: "Compare tutors, see verification status, and manage every child from one account." },
  { icon: CalendarCheck, title: "Lesson tracking", description: "Every past and upcoming lesson, with recordings and summaries, in one calendar." },
  { icon: FileBarChart, title: "Reports", description: "Regular progress reports that explain what improved and what's next." },
  { icon: ClipboardList, title: "Homework visibility", description: "See what's been assigned, what's overdue, and what's been submitted." },
  { icon: CreditCard, title: "Payments", description: "Pay tutors per lesson with a clear, itemised payment history." },
  { icon: MessageSquare, title: "Communication", description: "Message tutors directly when you have a question about your child's learning." },
];

export function ForParentsPage() {
  return (
    <div>
      <Hero
        eyebrow="For parents"
        title="Finally see what's actually happening in the lesson"
        description="Recordings, AI summaries and topic-level mastery mean you don't have to just take your child's word for it."
        actions={
          <>
            <Button size="lg" asChild>
              <Link to="/select-role">Create a parent account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/find-tutor">Find a tutor</Link>
            </Button>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Visibility, not guesswork" title="Everything you need to support their learning" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delayMs={index * 40}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading title="Ready to get started?" description="Link your child's account and find their first tutor." />
          <Button size="lg" asChild>
            <Link to="/select-role">Get started free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
