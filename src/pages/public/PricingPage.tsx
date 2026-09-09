import { Link } from "react-router-dom";
import { Hero } from "@/components/marketing/Hero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PricingCard } from "@/components/marketing/PricingCard";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/constants/pricingPlans";
import { FAQS } from "@/constants/faqs";

const PRICING_FAQS = FAQS.filter((f) => f.category === "Payments" || f.category === "Bookings");

export function PricingPage() {
  return (
    <div>
      <Hero
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        description="No subscription fees for students or parents. Tutors set their own rate and keep 100% of it during our beta."
        size="compact"
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
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
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4">
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
        </div>
      </section>
    </div>
  );
}
