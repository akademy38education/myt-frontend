import { Link } from "react-router-dom";
import { Users, BrainCircuit, Sparkles, ClipboardList, Video, CalendarDays, Wallet, Star } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Users, title: "Find students", description: "SmartMatch brings students who fit your subjects and teaching style to you." },
  { icon: BrainCircuit, title: "Smart student insights", description: "Walk into every lesson already knowing a student's mastery gaps and history." },
  { icon: Sparkles, title: "Tutor Copilot", description: "An AI assistant that suggests lesson prep and in-session prompts as you teach." },
  { icon: ClipboardList, title: "Homework", description: "Generate tailored homework in seconds from what you covered in the lesson." },
  { icon: Video, title: "Session management", description: "Recordings, AI summaries and chapters are created automatically after every lesson." },
  { icon: CalendarDays, title: "Calendar", description: "Set your availability once — bookings, reschedules and reminders handle themselves." },
  { icon: Wallet, title: "Earnings", description: "A clear ledger of every completed, paid lesson and your payout history." },
  { icon: Star, title: "Reviews", description: "Build a public track record as students and parents leave reviews." },
];

export function ForTutorsPage() {
  return (
    <div>
      <Hero
        eyebrow="For tutors"
        title="Spend your time teaching, not preparing paperwork"
        description="MyT handles matching, scheduling, recordings, summaries and homework generation — so every hour goes into the lesson itself."
        actions={
          <>
            <Button size="lg" asChild>
              <Link to="/select-role">Apply to tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">How MyT works</Link>
            </Button>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Built for tutors" title="Everything you need to teach and grow" />
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
          <SectionHeading title="Ready to start tutoring?" description="Set your subjects and hourly rate — SmartMatch brings students to you." />
          <Button size="lg" asChild>
            <Link to="/select-role">Apply to tutor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
