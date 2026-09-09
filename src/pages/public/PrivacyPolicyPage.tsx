import { Hero } from "@/components/marketing/Hero";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What this page is",
    body: [
      "This is a plain-language description of how MyT actually handles data today, written to be accurate rather than exhaustive. It is a placeholder appropriate for the current stage of the product and should be reviewed by qualified legal counsel and adapted to your jurisdiction's requirements (e.g. UK GDPR, COPPA for under-13 users) before any real launch.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "Account details you provide when you register or complete onboarding: name, email, role (student, parent, tutor), and role-specific profile information such as subjects, year group, or tutoring qualifications.",
      "Activity you generate while using MyT: bookings, lesson attendance, homework answers, messages, payments, and support requests — all tied to your account so the right people (you, a linked parent, your tutor, and authorised platform staff) can see it.",
      "Basic technical information needed to operate the service, such as your session token and timestamps of actions you take.",
    ],
  },
  {
    title: "What we don't do",
    body: [
      "We don't sell personal data. We don't run third-party advertising trackers. We don't share a student's learning data with anyone outside the people who legitimately need it to support that student's learning (the student, their linked parent/guardian, their tutor, and platform administrators with the appropriate permission level).",
    ],
  },
  {
    title: "Payments",
    body: [
      "MyT never stores full card numbers, CVV codes, or other raw payment credentials. Card details are tokenised — only a card brand and the last 4 digits are ever retained, to help you recognise a saved payment method.",
    ],
  },
  {
    title: "Your access to your own data",
    body: [
      "You can view and update your profile information from your account settings at any time. If you'd like a copy of your data or want your account deactivated, contact us via the Help page.",
    ],
  },
  {
    title: "Children's data",
    body: [
      "Where a student is a minor, their account is linked to a parent/guardian account, and that parent has visibility into their child's bookings, learning progress, and lesson reports.",
    ],
  },
  {
    title: "Questions",
    body: ["If you have questions about this policy, reach us via the Help page."],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div>
      <Hero eyebrow="Legal" title="Privacy Policy" description="Last updated: this is a living placeholder document — see the note below." size="compact" />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm leading-relaxed text-muted-foreground last:mb-0">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
