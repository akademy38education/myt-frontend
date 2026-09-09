import { Link } from "react-router-dom";
import { Video, FileText, PencilRuler, Dumbbell, BookOpen, ScrollText, Clock, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLibraryStore } from "../store";
import type { LibraryResourceMock, LibraryResourceType } from "@/mocks";

const TYPE_ICON: Record<LibraryResourceType, typeof Video> = {
  video: Video,
  article: FileText,
  worksheet: PencilRuler,
  practice: Dumbbell,
  guide: BookOpen,
  revision: ScrollText,
};

export function ResourceCard({ resource }: { resource: LibraryResourceMock }) {
  const Icon = TYPE_ICON[resource.type];
  const isBookmarked = useLibraryStore((s) => s.bookmarkedIds.includes(resource.id));
  const toggleBookmark = useLibraryStore((s) => s.toggleBookmark);

  return (
    <Card className="h-full transition-shadow duration-300 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
            onClick={() => toggleBookmark(resource.id)}
          >
            <Bookmark className={isBookmarked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
          </Button>
        </div>
        <div className="flex-1">
          <Link to={`/student/library/${resource.id}`} className="font-semibold hover:underline">
            {resource.title}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{resource.difficulty}</Badge>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {resource.durationMinutes} min
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
