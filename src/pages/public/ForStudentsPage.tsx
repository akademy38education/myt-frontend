import { Link } from "react-router-dom";
import { Sparkles, Map, ClipboardList, Library, Target, Trophy, PenSquare, LineChart } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Sparkles, title: "Smart tutor matching", description: "SmartMatch recommends tutors fit to your subject, goals and the way you learn best." },
  { icon: Map, title: "Personal learning journey", description: "Every lesson builds on the last — nothing gets re-taught, nothing gets missed." },
  { icon: PenSquare, title: "Homework", description: "Practice questions generated from exactly what came up in your lesson." },
  { icon: Library, title: "Learning library", description: "Bite-sized articles, videos and worked examples matched to your gaps." },
  { icon: Trophy, title: "Mastery", description: "See your real mastery level per topic, not just a grade prediction." },
  { icon: Target, title: "Goals", description: "Set a target grade or exam date and track progress toward it." },
  { icon: ClipboardList, title: "Exam preparation", description: "Timed, exam-condition practice drawn from a real question bank." },
  { icon: LineChart, title: "Progress tracking", description: "A dashboard that actually shows what's improving, lesson by lesson." },
];

export function ForStudentsPage() {
  return (
    <div>
      <Hero
        eyebrow="For students"
        title="Learn with a tutor who already knows what you need"
        description="MyT understands your gaps before your first lesson, and keeps every lesson after it focused on what's next."
        actions={
          <>
            <Button size="lg" asChild>
              <Link to="/find-tutor">Find my tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">How MyT works</Link>
            </Button>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Built for how you learn" title="Everything you need, in one place" />
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
          <SectionHeading title="Ready to start?" description="Tell us your subject and goals — SmartMatch does the rest." />
          <Button size="lg" asChild>
            <Link to="/select-role">Get started free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
