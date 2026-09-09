import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList, ExternalLink, FileText, Link2, Plus, Video } from "lucide-react";
import type { LessonParticipantRole, LessonResourceType } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { homeworkService } from "@/features/homework";
import { useLessonResources, useAddLessonResource } from "../hooks/useLessonResources";

const TYPE_ICON: Record<LessonResourceType, typeof FileText> = {
  worksheet: FileText,
  video: Video,
  article: FileText,
  link: Link2,
  document: FileText,
};

export function LessonResourcesPanel({ bookingId, role }: { bookingId: string; role: LessonParticipantRole }) {
  const { data: resources } = useLessonResources(bookingId);
  const addResource = useAddLessonResource(bookingId, role);
  const { data: homework } = useQuery({ queryKey: ["lesson-homework", bookingId], queryFn: () => homeworkService.listForLesson(bookingId) });

  const [title, setTitle] = useState("");
  const [type, setType] = useState<LessonResourceType>("worksheet");
  const [url, setUrl] = useState("");

  async function handleAdd() {
    if (!title.trim()) return;
    try {
      await addResource.mutateAsync({ title: title.trim(), type, url: url.trim() || undefined });
      setTitle("");
      setUrl("");
      toast.success("Resource shared with your student");
    } catch {
      toast.error("Couldn't share that resource. Please try again.");
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      {role === "tutor" && (
        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          <p className="text-xs font-medium text-muted-foreground">Share a resource</p>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2">
            <Select value={type} onValueChange={(v) => setType(v as LessonResourceType)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
          </div>
          <Button size="sm" className="w-full" onClick={handleAdd} isLoading={addResource.isPending} disabled={!title.trim()}>
            <Plus className="h-3.5 w-3.5" />
            Share with student
          </Button>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lesson resources</p>
        {!resources || resources.length === 0 ? (
          <EmptyState title="No resources yet" description={role === "tutor" ? "Share a worksheet or link above." : "Your tutor hasn't shared anything yet."} className="py-6" />
        ) : (
          <ul className="space-y-2">
            {resources.map((resource) => {
              const Icon = TYPE_ICON[resource.type];
              return (
                <li key={resource.id} className="flex items-center gap-2.5 rounded-md border border-border p-2.5 text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="flex-1 truncate">{resource.title}</span>
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.title}`}>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {homework && homework.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Related homework</p>
          <ul className="space-y-2">
            {homework.map((hw) => (
              <li key={hw.id}>
                <Link to={`/student/homework/${hw.id}`} className="flex items-center gap-2.5 rounded-md border border-border p-2.5 text-sm hover:bg-muted/50">
                  <ClipboardList className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="flex-1 truncate">{hw.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
