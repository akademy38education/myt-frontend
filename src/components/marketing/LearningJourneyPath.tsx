import { ClipboardCheck, Search, Presentation, Dumbbell, LineChart, Trophy, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";

interface JourneyStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: JourneyStep[] = [
  { icon: ClipboardCheck, title: "Discover", description: "A short diagnostic identifies exactly where a student stands." },
  { icon: Search, title: "Match", description: "SmartMatch recommends a tutor fit to their goals and gaps." },
  { icon: Presentation, title: "Learn", description: "Lessons happen live in the MyT classroom, recorded automatically." },
  { icon: Dumbbell, title: "Practice", description: "Homework tailored to the lesson reinforces what was covered." },
  { icon: LineChart, title: "Track", description: "Mastery is tracked topic by topic, not just grade by grade." },
  { icon: Trophy, title: "Achieve", description: "Recommendations adapt to close the next real gap." },
];

/**
 * The homepage's condensed "how MyT works" path — six stops distilled from
 * the full eight-step journey (see `/how-it-works` for the complete
 * breakdown, still linked from here). Connected visually: a single line
 * running through every node, horizontal on desktop, a vertical timeline on
 * mobile — a flowing path rather than a grid of unrelated cards.
 */
export function LearningJourneyPath() {
  return (
    <div className="relative">
      {/* Desktop/tablet: horizontal path with a connecting line behind the nodes */}
      <div className="hidden sm:grid sm:grid-cols-6 sm:gap-2">
        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-border sm:block" aria-hidden="true" />
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delayMs={index * 70}>
            <div className="relative flex flex-col items-center px-2 text-center">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-brand text-white shadow-md">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold tracking-tight">{step.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="relative space-y-8 sm:hidden">
        <div className="pointer-events-none absolute bottom-4 left-7 top-4 w-px bg-border" aria-hidden="true" />
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delayMs={index * 70}>
            <div className="relative flex gap-4">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-brand text-white shadow-md">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="pt-2.5">
                <p className="font-semibold tracking-tight">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
