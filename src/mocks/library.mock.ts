export type LibraryResourceType = "video" | "article" | "worksheet" | "practice" | "guide" | "revision";

export interface LibraryResourceMock {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  topic: string;
  yearGroup: string;
  type: LibraryResourceType;
  difficulty: "Foundation" | "Core" | "Higher";
  durationMinutes: number;
  thumbnailIcon: LibraryResourceType;
}

export const mockLibraryResources: LibraryResourceMock[] = [
  {
    id: "resource-1",
    title: "Factorising quadratics, step by step",
    description: "A guided video walkthrough of factorising simple and complex quadratic expressions.",
    subjectId: "subject-maths",
    topic: "Quadratic equations",
    yearGroup: "Year 11",
    type: "video",
    difficulty: "Core",
    durationMinutes: 12,
    thumbnailIcon: "video",
  },
  {
    id: "resource-2",
    title: "Newton's Second Law worked examples",
    description: "Five fully worked examples applying F = ma to real-world scenarios.",
    subjectId: "subject-physics",
    topic: "Forces",
    yearGroup: "Year 11",
    type: "worksheet",
    difficulty: "Core",
    durationMinutes: 8,
    thumbnailIcon: "worksheet",
  },
  {
    id: "resource-3",
    title: "Writing about imagery in Macbeth",
    description: "How to structure a paragraph analysing Shakespeare's imagery, with model answers.",
    subjectId: "subject-english",
    topic: "Macbeth",
    yearGroup: "Year 11",
    type: "article",
    difficulty: "Higher",
    durationMinutes: 6,
    thumbnailIcon: "article",
  },
  {
    id: "resource-4",
    title: "Quadratic equations practice pack",
    description: "20 practice questions ranging from foundation to higher difficulty, with full solutions.",
    subjectId: "subject-maths",
    topic: "Quadratic equations",
    yearGroup: "Year 11",
    type: "practice",
    difficulty: "Foundation",
    durationMinutes: 25,
    thumbnailIcon: "practice",
  },
  {
    id: "resource-5",
    title: "Simultaneous equations revision guide",
    description: "A one-page summary of every method for solving simultaneous equations.",
    subjectId: "subject-maths",
    topic: "Simultaneous equations",
    yearGroup: "Year 10",
    type: "revision",
    difficulty: "Core",
    durationMinutes: 5,
    thumbnailIcon: "revision",
  },
  {
    id: "resource-6",
    title: "Forces and motion: exam technique",
    description: "How to structure full-mark answers for 6-mark forces questions.",
    subjectId: "subject-physics",
    topic: "Forces",
    yearGroup: "Year 11",
    type: "guide",
    difficulty: "Higher",
    durationMinutes: 10,
    thumbnailIcon: "guide",
  },
];
