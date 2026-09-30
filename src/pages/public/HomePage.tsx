import { Link } from "react-router-dom";
import { Target, Library, ArrowRight, CheckCircle2, ClipboardCheck, UserCheck, LineChart, Video, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/marketing/Hero";
import { LearningOrbIllustration } from "@/components/marketing/LearningOrbIllustration";
import { LearningJourneyPath } from "@/components/marketing/LearningJourneyPath";
import { CloudSkyBackground } from "@/components/background/CloudSkyBackground";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { SubjectCard } from "@/components/marketing/SubjectCard";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/utils/cn";
import { SUBJECTS } from "@/constants/subjects";
import { TESTIMONIALS } from "@/constants/testimonials";
import { FAQS } from "@/constants/faqs";

const TRUST_INDICATORS = ["Expert, verified tutors", "Personalized to real gaps", "Progress you can actually see"];

const WHY_MYT = [
  { icon: ClipboardCheck, title: "Every gap identified", description: "A short diagnostic shows exactly what a student needs, before the first lesson is even booked." },
  { icon: UserCheck, title: "Matched, not just searched", description: "SmartMatch recommends tutors fit to goals and gaps, not just star ratings." },
  { icon: Video, title: "Live lessons, always captured", description: "Every lesson runs in the MyT classroom and is recorded and summarised automatically." },
  { icon: LineChart, title: "Progress you can see", description: "Mastery is tracked topic by topic, so growth is visible, not assumed." },
];

const ROLES = [
  { title: "Students", to: "/for-students", description: "Understand your gaps, learn with the right tutor, and see real progress." },
  { title: "Parents", to: "/for-parents", description: "Stay informed with reports, recordings and progress you can actually see." },
  { title: "Tutors", to: "/for-tutors", description: "Walk into every lesson prepared, backed by an AI co-pilot and clear student context." },
];

const TOP_SUBJECTS = SUBJECTS.slice(0, 6);
const HOME_FAQS = FAQS.slice(0, 4);
const TOTAL_TUTORS = SUBJECTS.reduce((sum, s) => sum + s.tutorCount, 0);
const STATS = [
  { value: `${Math.round(TOTAL_TUTORS / 10) * 10}+`, label: "Verified tutors" },
  { value: `${SUBJECTS.length}`, label: "Subjects covered" },
  { value: "0%", label: "Platform fees for students" },
  { value: "24/7", label: "Book a lesson anytime" },
];

export function HomePage() {
  return (
    <div>
      <Hero
        eyebrow="MyT — The complete tutoring platform"
        title={
          <>
            Find the right tutor.
            <br />
            <span className="text-primary">Build real progress.</span>
          </>
        }
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
        backgroundSlot={<CloudSkyBackground />}
      >
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_INDICATORS.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
        <LearningOrbIllustration className="hidden sm:block" />
      </Hero>

      {/* ---- Why MyT ---- */}
      <section className="bg-warm py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Why MyT" title="A learning journey built around one student, not a generic class" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_MYT.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 60}>
                <FeatureCard icon={item.icon} title={item.title} description={item.description} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Stat band ---- */}
      <section className="bg-foreground py-14 text-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delayMs={index * 60} className="text-center lg:text-left">
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

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
              <Target className="h-6 w-6" aria-hidden="true" />
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
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Subject and exam board fit", dot: "bg-primary" },
                { label: "Learning goals alignment", dot: "bg-secondary" },
                { label: "Availability match", dot: "bg-achievement" },
                { label: "Teaching style fit", dot: "bg-info" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", item.dot)} aria-hidden="true" />
                  {item.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Learning journey ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="How MyT works" title="One connected learning journey" description="Not a one-off booking — every step builds on the last." />
        <LearningJourneyPath />
        <div className="mt-10 text-center">
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

      {/* ---- Learning Library + Mastery + Achievements ---- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading eyebrow="Beyond the lesson" title="Progress that stays visible between lessons" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Reveal>
            <FeatureCard
              icon={Library}
              title="Learning library"
              description="Bite-sized articles, videos and worked examples, matched automatically to the gaps a student's lessons reveal."
              className="h-full"
            />
          </Reveal>
          <Reveal delayMs={60}>
            <FeatureCard
              icon={LineChart}
              title="Mastery and progress"
              description="Topic-level mastery tracking means progress is measured by what's actually understood, not just grades."
              className="h-full"
            />
          </Reveal>
          <Reveal delayMs={120}>
            <Card className="h-full">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-achievement/15 text-achievement-foreground">
                  <Medal className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">Achievements that mean something</h3>
                <p className="text-sm text-muted-foreground">
                  Streaks, mastered topics and completed goals unlock real badges — a record of progress, not a participation trophy.
                </p>
              </CardContent>
            </Card>
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
