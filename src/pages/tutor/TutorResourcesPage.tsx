import { useState } from "react";
import { FileText, Link2, Plus, Trash2, Users2, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrentTutorProfile } from "@/features/tutors";
import { useTutorStudents } from "@/features/tutor-students";
import { useTutorResources, useCreateTutorResource, useDeleteTutorResource, useShareTutorResource, useUnshareTutorResource } from "@/features/tutor-resources";
import type { ResourceType } from "@myt/shared";

const TYPE_ICON: Record<ResourceType, typeof FileText> = {
  worksheet: FileText,
  document: FileText,
  presentation: FileText,
  article: FileText,
  video: Video,
  link: Link2,
};

const TYPE_OPTIONS: ResourceType[] = ["worksheet", "document", "presentation", "article", "video", "link"];

export function TutorResourcesPage() {
  const { tutorId } = useCurrentTutorProfile();
  const { data: resources, isLoading, isError, refetch } = useTutorResources(tutorId);
  const { data: students } = useTutorStudents(tutorId);
  const createResource = useCreateTutorResource(tutorId);
  const deleteResource = useDeleteTutorResource(tutorId);
  const shareResource = useShareTutorResource(tutorId);
  const unshareResource = useUnshareTutorResource(tutorId);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceType>("worksheet");
  const [url, setUrl] = useState("");
  const [sharingResourceId, setSharingResourceId] = useState<string | null>(null);

  function handleUpload() {
    if (!title.trim()) return;
    createResource.mutate(
      { title: title.trim(), type, url: url.trim() || undefined, tags: [] },
      { onSuccess: () => { setTitle(""); setUrl(""); } }
    );
  }

  const sharingResource = resources?.find((r) => r.id === sharingResourceId) ?? null;

  if (!tutorId || isLoading) return <LoadingState label="Loading your resources..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title="Resource Library" description="Materials you've built, ready to share with your students." />

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-5 sm:grid-cols-[1fr_10rem_1fr_auto]">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" aria-label="Resource title" />
          <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link (optional)" aria-label="Resource URL" />
          <Button onClick={handleUpload} disabled={!title.trim() || createResource.isPending}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </CardContent>
      </Card>

      {!resources || resources.length === 0 ? (
        <EmptyState title="Your teaching library is empty" description="Upload your first resource using the form above." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => {
            const Icon = TYPE_ICON[resource.type];
            return (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="font-medium">{resource.title}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {resource.type}
                    </Badge>
                  </div>
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-primary hover:underline">
                      {resource.url}
                    </a>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {resource.sharedWith.length === 0 ? "Not shared yet" : `Shared with ${resource.sharedWith.length} student${resource.sharedWith.length === 1 ? "" : "s"}`}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSharingResourceId(resource.id)}>
                      <Users2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteResource.mutate(resource.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(sharingResource)} onOpenChange={(open) => !open && setSharingResourceId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share "{sharingResource?.title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(students ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">You don't have any students yet.</p>
            ) : (
              (students ?? []).map((student) => {
                const isShared = sharingResource?.sharedWith.includes(student.studentId) ?? false;
                return (
                  <label key={student.studentId} className="flex items-center gap-2 rounded-md border border-border p-2.5 text-sm">
                    <Checkbox
                      checked={isShared}
                      onCheckedChange={(checked) => {
                        if (!sharingResource) return;
                        if (checked) shareResource.mutate({ resourceId: sharingResource.id, studentIds: [student.studentId] });
                        else unshareResource.mutate({ resourceId: sharingResource.id, studentId: student.studentId });
                      }}
                    />
                    {student.name}
                  </label>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
