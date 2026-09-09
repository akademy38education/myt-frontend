import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Bookmark, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/LoadingState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { useLibraryResource, useRelatedResources, ResourceViewer, ResourceCard, useLibraryStore } from "@/features/learning-library";

export function LibraryResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading } = useLibraryResource(id ?? "");
  const { data: related } = useRelatedResources(resource);
  const isBookmarked = useLibraryStore((s) => (id ? s.bookmarkedIds.includes(id) : false));
  const isCompleted = useLibraryStore((s) => (id ? s.completedIds.includes(id) : false));
  const toggleBookmark = useLibraryStore((s) => s.toggleBookmark);
  const markComplete = useLibraryStore((s) => s.markComplete);

  if (isLoading) return <LoadingState label="Loading resource..." />;
  if (!resource) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/student/library")}>
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </Button>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{resource.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{resource.difficulty}</Badge>
            <Badge variant="outline" className="capitalize">
              {resource.type}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {resource.durationMinutes} min
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleBookmark(resource.id)}>
            <Bookmark className={isBookmarked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => {
              markComplete(resource.id);
              if (!isCompleted) toast.success("Marked as complete");
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? "Completed" : "Mark complete"}
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <ResourceViewer resource={resource} />
        </CardContent>
      </Card>

      {related && related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Related resources</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
