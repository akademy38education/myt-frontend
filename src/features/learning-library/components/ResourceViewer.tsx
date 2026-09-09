import { Video, FileText, PencilRuler, Dumbbell, BookOpen, ScrollText } from "lucide-react";
import type { LibraryResourceMock, LibraryResourceType } from "@/mocks";

const TYPE_ICON: Record<LibraryResourceType, typeof Video> = {
  video: Video,
  article: FileText,
  worksheet: PencilRuler,
  practice: Dumbbell,
  guide: BookOpen,
  revision: ScrollText,
};

/**
 * A reusable viewer surface for any resource type. There's no real content
 * host wired up yet (see backend's scaffolded `learning-library` module),
 * so this shows the resource's real title/description honestly rather than
 * faking a video player or PDF — swapping in real content later means
 * extending the `video`/`worksheet` branches here only.
 */
export function ResourceViewer({ resource }: { resource: LibraryResourceMock }) {
  const Icon = TYPE_ICON[resource.type];

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="max-w-md text-sm text-muted-foreground">{resource.description}</p>
      <p className="text-xs text-muted-foreground">Full {resource.type} content is coming in a future update.</p>
    </div>
  );
}
