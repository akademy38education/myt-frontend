import { Hero } from "@/components/marketing/Hero";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What this page is",
    body: [
      "This is a plain-language summary of the terms under which MyT operates today, appropriate for the current stage of the product. It should be reviewed by qualified legal counsel before any real launch.",
    ],
  },
  {
    title: "The service",
    body: [
      "MyT connects students and parents with independent tutors for online lessons, and provides supporting tools: scheduling, a live classroom, homework and progress tracking, messaging, and payments.",
      "Tutors on MyT are independent professionals, not MyT employees. MyT verifies tutor applications before they go live on the marketplace, but a lesson itself is an agreement between the student/parent and the tutor.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "You're responsible for keeping your login credentials secure and for the activity that happens under your account. Accounts may be suspended for violations of these terms, at which point access to the platform is restricted until the matter is resolved.",
    ],
  },
  {
    title: "Bookings, cancellations and refunds",
    body: [
      "A booking is confirmed once payment is completed. Cancellation policy: cancelling with enough notice (see the cancellation window shown at booking time) gives a full refund; cancelling later than that may incur a late-cancellation fee, deducted from the refund. Cancellations initiated by your tutor, or by MyT, are always fully refunded.",
      "Refunds are processed back to the original payment method and reviewed by MyT's finance team for anything outside the standard automatic-refund cases above.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "Don't use MyT to harass, discriminate against, or share inappropriate content with another user. Don't attempt to circumvent the platform to avoid its safety, verification, or payment protections. Don't misrepresent your identity or qualifications.",
    ],
  },
  {
    title: "Changes",
    body: ["We may update these terms as the product evolves. Material changes will be reflected here with an updated date."],
  },
  {
    title: "Questions",
    body: ["If you have questions about these terms, reach us via the Help page."],
  },
];

export function TermsOfServicePage() {
  return (
    <div>
      <Hero eyebrow="Legal" title="Terms of Service" description="Last updated: this is a living placeholder document — see the note below." size="compact" />
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
