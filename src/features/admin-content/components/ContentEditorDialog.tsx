import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentType, contentItemSchema, type ContentItemInput } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatDateTime } from "@/utils/formatters";
import { useContentItem } from "../hooks/useContentItem";
import { useContentVersions } from "../hooks/useContentVersions";
import { useCreateContent } from "../hooks/useCreateContent";
import { useUpdateContent } from "../hooks/useUpdateContent";

const TYPE_LABELS: Record<ContentType, string> = {
  [ContentType.PAGE]: "Page",
  [ContentType.ANNOUNCEMENT]: "Announcement",
  [ContentType.FAQ]: "FAQ",
};

const EMPTY_VALUES: ContentItemInput = { type: ContentType.PAGE, title: "", slug: "", body: "" };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ContentEditorDialogProps {
  open: boolean;
  /** null means "create new"; a content id opens that item in edit mode. */
  contentId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ContentEditorDialog({ open, contentId, onOpenChange }: ContentEditorDialogProps) {
  const isEditMode = Boolean(contentId);
  const { data: existing, isLoading } = useContentItem(open ? contentId : null);
  const { data: versions } = useContentVersions(open && isEditMode ? contentId : null);
  const createContent = useCreateContent();
  const updateContent = useUpdateContent(contentId ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentItemInput>({ resolver: zodResolver(contentItemSchema), defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (!open) return;
    setSlugTouched(isEditMode);
    if (isEditMode && existing) {
      reset({ type: existing.type, title: existing.title, slug: existing.slug, body: existing.body });
    } else if (!isEditMode) {
      reset(EMPTY_VALUES);
    }
    // Only re-sync when the dialog (re)opens or its target item changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEditMode, existing?.id]);

  const titleValue = watch("title");
  useEffect(() => {
    if (!isEditMode && !slugTouched) {
      setValue("slug", slugify(titleValue || ""), { shouldValidate: true });
    }
  }, [titleValue, isEditMode, slugTouched, setValue]);

  const isPending = createContent.isPending || updateContent.isPending;
  const isLoadingExisting = isEditMode && isLoading;

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEditMode && contentId) {
        await updateContent.mutateAsync(values);
      } else {
        await createContent.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      // Toast already surfaced by the mutation hook's onError.
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit content" : "New content"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Saving will snapshot the current version (v${existing?.version ?? 1}) and bump it to the next.`
              : "New content is created as a draft — publish it separately once it's ready."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingExisting ? (
          <LoadingState label="Loading content..." />
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ContentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-title">Title</Label>
              <Input id="content-title" {...register("title")} aria-invalid={Boolean(errors.title)} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-slug">Slug</Label>
              <Input id="content-slug" {...register("slug", { onChange: () => setSlugTouched(true) })} aria-invalid={Boolean(errors.slug)} />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-body">Body</Label>
              <Textarea id="content-body" rows={8} {...register("body")} aria-invalid={Boolean(errors.body)} />
              {errors.body && <p className="text-sm text-destructive">{errors.body.message}</p>}
            </div>

            {isEditMode && versions && versions.length > 0 && (
              <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Previous versions</p>
                <ul className="space-y-1">
                  {versions.map((version) => (
                    <li key={version.id}>
                      v{version.version} — {version.title} · {formatDateTime(version.createdAt)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                {isEditMode ? "Save changes" : "Create draft"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
