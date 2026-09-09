import { Link } from "react-router-dom";
import {
  Search,
  ClipboardCheck,
  CalendarCheck,
  BookOpenCheck,
  Presentation,
  Video,
  FileText,
  Dumbbell,
  LineChart,
  Sparkles,
  RotateCcw,
  Brain,
  Library,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/marketing/Hero";
import { LearningOrbIllustration } from "@/components/marketing/LearningOrbIllustration";
import { VantaCloudsBackground } from "@/components/background/VantaCloudsBackground";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { SubjectCard } from "@/components/marketing/SubjectCard";
import { PricingCard } from "@/components/marketing/PricingCard";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SUBJECTS } from "@/constants/subjects";
import { TESTIMONIALS } from "@/constants/testimonials";
import { PRICING_PLANS } from "@/constants/pricingPlans";
import { FAQS } from "@/constants/faqs";

const JOURNEY = [
  { label: "Diagnose", icon: ClipboardCheck, description: "A short diagnostic identifies exactly where a student stands." },
  { label: "Match", icon: Search, description: "MyT Intelligence recommends tutors fit to the student's goals and gaps." },
  { label: "Book", icon: CalendarCheck, description: "Book a lesson in the subject and time that works." },
  { label: "Prepare", icon: BookOpenCheck, description: "The tutor receives context and a suggested lesson plan beforehand." },
  { label: "Teach", icon: Presentation, description: "Lessons happen live in the MyT classroom." },
  { label: "Record", icon: Video, description: "Every lesson is recorded and chaptered automatically." },
  { label: "Summarise", icon: FileText, description: "An AI-generated summary and key points are ready right after." },
  { label: "Practise", icon: Dumbbell, description: "Homework tailored to what came up in the lesson reinforces it." },
  { label: "Track", icon: LineChart, description: "Mastery is tracked topic by topic, not just grade by grade." },
  { label: "Improve", icon: Sparkles, description: "Recommendations adapt to focus on the next real gap." },
  { label: "Rebook", icon: RotateCcw, description: "The next lesson is prepared around what's still to learn." },
];

const ROLES = [
  { title: "Students", to: "/for-students", description: "Understand your gaps, learn with the right tutor, and see real progress." },
  { title: "Parents", to: "/for-parents", description: "Stay informed with reports, recordings and progress you can actually see." },
  { title: "Tutors", to: "/for-tutors", description: "Walk into every lesson prepared, backed by an AI co-pilot and clear student context." },
];

const TOP_SUBJECTS = SUBJECTS.slice(0, 6);
const HOME_FAQS = FAQS.slice(0, 4);

export function HomePage() {
  return (
    <div>
      <Hero
        eyebrow="MyT — The complete tutoring platform"
        title="Find the right tutor. Build the right learning journey. Improve with every lesson."
        description="MyT manages the whole learning journey: diagnosing what a student needs, matching them with the right tutor, and turning every lesson into measurable, lasting progress."
        actions={
          <>
            <Button size="lg" asChild>
              <Link to="/find-tutor">Find My Tutor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">How MyT Works</Link>
            </Button>
          </>
        }
        backgroundSlot={<VantaCloudsBackground />}
      >
        <LearningOrbIllustration className="hidden sm:block" />
      </Hero>

      {/* ---- Find Your Tutor ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Find your tutor" title="Search by subject, start learning today" description="A few of the subjects students book most on MyT." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_SUBJECTS.map((subject, index) => (
            <Reveal key={subject.id} delayMs={index * 40}>
              <SubjectCard icon={subject.icon} name={subject.name} tutorCount={subject.tutorCount} to={`/find-tutor?subject=${subject.id}`} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link to="/subjects">
              Browse all subjects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ---- SmartMatch ---- */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <Brain className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">SmartMatch finds the right tutor, not just a top-rated one</h2>
            <p className="mt-4 text-muted-foreground">
              MyT Intelligence looks at your subject, year group, learning goals and diagnostic results to recommend tutors who
              fit your specific gaps — so your very first lesson is already targeted at what matters.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/find-tutor">Try SmartMatch</Link>
            </Button>
          </Reveal>
          <Reveal delayMs={100}>
            <Card>
              <CardContent className="space-y-3 p-6">
                {["Subject & exam board fit", "Learning goals alignment", "Availability match", "Teaching style fit"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ---- Learning journey ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="How MyT works" title="The MyT learning journey" description="Eleven connected steps, not a one-off booking." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {JOURNEY.map((step, index) => (
            <Reveal key={step.label} delayMs={index * 30}>
              <Card className="relative h-full transition-shadow duration-300 hover:shadow-md">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <step.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <p className="font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link to="/how-it-works">
              See the full journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ---- For Students / Parents / Tutors ---- */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title="Built for every role in the learning journey" />
          <div className="grid gap-6 sm:grid-cols-3">
            {ROLES.map((role, index) => (
              <Reveal key={role.title} delayMs={index * 60}>
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="flex-1 text-sm text-muted-foreground">{role.description}</p>
                    <Button variant="outline" asChild className="self-start">
                      <Link to={role.to}>Learn more</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Learning Library + Mastery ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          <Reveal>
            <FeatureCard
              icon={Library}
              title="Learning library"
              description="Bite-sized articles, videos and worked examples, matched automatically to the gaps a student's lessons reveal."
            />
          </Reveal>
          <Reveal delayMs={60}>
            <FeatureCard
              icon={Trophy}
              title="Mastery & progress"
              description="Topic-level mastery tracking means progress is measured by what's actually understood, not just grades."
            />
          </Reveal>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="What people say" title="Real progress, from real students, parents and tutors" />
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.name} delayMs={index * 60}>
                <TestimonialCard {...testimonial} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Pricing teaser ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Pricing" title="Simple, transparent pricing" description="No subscription fees for students or parents." />
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, index) => (
            <Reveal key={plan.name} delayMs={index * 60}>
              <PricingCard {...plan} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link to="/pricing">
              See full pricing details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <Accordion type="single" collapsible>
            {HOME_FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link to="/help">See all FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-brand opacity-95" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to start your learning journey?</h2>
          <p className="mt-3 text-white/90">Join MyT free and find the right tutor today.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/select-role">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10" asChild>
              <Link to="/find-tutor">Find My Tutor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
