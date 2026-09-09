import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Instagram, Linkedin } from "lucide-react";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: "Students",
    links: [
      { label: "Find a tutor", to: "/find-tutor" },
      { label: "How MyT works", to: "/how-it-works" },
      { label: "For students", to: "/for-students" },
    ],
  },
  {
    title: "Parents",
    links: [
      { label: "For parents", to: "/for-parents" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Tutors",
    links: [
      { label: "For tutors", to: "/for-tutors" },
      { label: "Apply to tutor", to: "/select-role" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Subjects", to: "/subjects" },
      { label: "Help centre", to: "/help" },
      { label: "About MyT", to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
              MyT
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">The complete tutoring platform — diagnose, match, teach, and improve.</p>
            <div className="mt-4 flex gap-3 text-muted-foreground" title="Social links coming soon" aria-label="Social links coming soon">
              <Twitter className="h-4 w-4 opacity-40" aria-hidden="true" />
              <Instagram className="h-4 w-4 opacity-40" aria-hidden="true" />
              <Linkedin className="h-4 w-4 opacity-40" aria-hidden="true" />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MyT. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-foreground">Company</Link>
            <Link to="/help" className="hover:text-foreground">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
