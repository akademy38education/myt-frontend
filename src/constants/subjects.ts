import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Globe2,
  Landmark,
  Palette,
  Code2,
  Languages,
  Music,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export interface SubjectListing {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  /** Static, illustrative count for the marketing site — not a live query. */
  tutorCount: number;
}

/**
 * Subjects shown on the public Subjects page and used as filter options on
 * Find a Tutor. `subject-history`, `subject-geography`, `subject-art` and
 * `subject-music` have no matching seeded tutors yet (see
 * backend/src/models/seedData.ts and frontend/src/mocks/tutors.mock.ts) —
 * searching any of those correctly returns the "No tutors found" empty
 * state rather than fake results.
 */
export const SUBJECTS: SubjectListing[] = [
  { id: "subject-maths", name: "Mathematics", category: "STEM", icon: Calculator, tutorCount: 128 },
  { id: "subject-physics", name: "Physics", category: "STEM", icon: Atom, tutorCount: 74 },
  { id: "subject-chemistry", name: "Chemistry", category: "STEM", icon: FlaskConical, tutorCount: 61 },
  { id: "subject-biology", name: "Biology", category: "STEM", icon: Dna, tutorCount: 58 },
  { id: "subject-computer-science", name: "Computer Science", category: "STEM", icon: Code2, tutorCount: 45 },
  { id: "subject-english", name: "English Literature", category: "Humanities", icon: BookOpen, tutorCount: 96 },
  { id: "subject-history", name: "History", category: "Humanities", icon: Landmark, tutorCount: 52 },
  { id: "subject-geography", name: "Geography", category: "Humanities", icon: Globe2, tutorCount: 38 },
  { id: "subject-economics", name: "Economics", category: "Humanities", icon: LineChart, tutorCount: 34 },
  { id: "subject-french", name: "French", category: "Languages", icon: Languages, tutorCount: 41 },
  { id: "subject-spanish", name: "Spanish", category: "Languages", icon: Languages, tutorCount: 37 },
  { id: "subject-art", name: "Art & Design", category: "Creative", icon: Palette, tutorCount: 22 },
  { id: "subject-music", name: "Music", category: "Creative", icon: Music, tutorCount: 19 },
];

export const SUBJECT_CATEGORIES = Array.from(new Set(SUBJECTS.map((s) => s.category)));
