export interface PricingPlan {
  name: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  highlighted?: boolean;
}

/**
 * MyT doesn't charge a platform subscription today — tutors set their own
 * hourly rate and students pay per lesson. These "plans" describe how
 * pricing works for each audience rather than a subscription tier, and
 * every CTA leads into a real signup/search flow (see rule: no hardcoded
 * fake payment functionality).
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Students & Parents",
    price: "Free",
    priceSuffix: "to join",
    description: "Pay tutors directly, per lesson — no subscription or platform fee.",
    features: [
      "Free SmartMatch tutor recommendations",
      "Book lessons at your tutor's hourly rate",
      "Lesson recordings, summaries & homework included",
      "Progress tracking and reports included",
    ],
    ctaLabel: "Find my tutor",
    ctaTo: "/find-tutor",
  },
  {
    name: "Tutors",
    price: "0%",
    priceSuffix: "commission during beta",
    description: "Set your own hourly rate. Keep what you earn while MyT is in beta.",
    features: [
      "Set your own subjects & hourly rate",
      "AI Tutor Copilot for lesson prep",
      "Automatic recordings, summaries & homework generation",
      "Built-in calendar, messaging & earnings tracking",
    ],
    ctaLabel: "Apply to tutor",
    ctaTo: "/select-role",
    highlighted: true,
  },
  {
    name: "Schools & Groups",
    price: "Custom",
    description: "Bulk tutoring programs with dedicated onboarding and reporting.",
    features: [
      "Volume-based pricing",
      "Cohort-level progress reporting",
      "Dedicated account support",
      "Custom curriculum alignment",
    ],
    ctaLabel: "Contact us",
    ctaTo: "/help",
  },
];
