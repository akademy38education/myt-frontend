import { Link } from "react-router-dom";
import { MessageCircleQuestion, Sparkles, Search, CalendarCheck, GraduationCap, Dumbbell, LineChart, TrendingUp } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { icon: MessageCircleQuestion, title: "Tell us what you need", description: "Subject, year group and what you're aiming for — it takes two minutes." },
  { icon: Sparkles, title: "MyT understands your goals", description: "A short diagnostic (optional) pinpoints your real strengths and gaps, not just a grade." },
  { icon: Search, title: "Find your tutor", description: "SmartMatch recommends tutors fit to your subject, goals and availability." },
  { icon: CalendarCheck, title: "Book a lesson", description: "Pick a time that works. Your tutor gets your context ahead of the first lesson." },
  { icon: GraduationCap, title: "Learn", description: "Lessons happen live in the MyT classroom, recorded and chaptered automatically." },
  { icon: Dumbbell, title: "Practise", description: "Homework tailored to exactly what came up in the lesson reinforces it." },
  { icon: LineChart, title: "Track progress", description: "Mastery is tracked topic by topic — you and your parents can see it, not just guess at it." },
  { icon: TrendingUp, title: "Improve", description: "Every next lesson is prepared around what's still to learn, so progress compounds." },
];

export function HowItWorksPage() {
  return (
    <div>
      <Hero
        eyebrow="How MyT works"
        title="A complete learning journey, not a one-off booking"
        description="Eight connected steps take you from 'I need help with Maths' to measurable, lasting progress."
        actions={
          <Button size="lg" asChild>
            <Link to="/select-role">Get started free</Link>
          </Button>
        }
      />

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="space-y-6">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delayMs={index * 40}>
              <Card>
                <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step {index + 1}</p>
                    <h3 className="mt-0.5 font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeading title="Ready to see it in action?" description="Find a tutor in your subject and start your learning journey today." />
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/find-tutor">Find my tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/subjects">Browse subjects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
