import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { randomUUID } from "@/utils/uuid";
import { Plus, Trash2, FileCheck2, Loader2, Upload } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { tutorStepPath } from "./steps";

interface QualificationDraft {
  id: string;
  title: string;
  institution: string;
  year: string;
  subject: string;
  documentName?: string;
  uploadStatus: "idle" | "uploading" | "uploaded";
}

function fromStoreDraft(qualifications: { id: string; title: string; institution?: string; year: number; subject?: string; documentName?: string }[]): QualificationDraft[] {
  if (qualifications.length === 0) {
    return [{ id: randomUUID(), title: "", institution: "", year: "", subject: "", uploadStatus: "idle" }];
  }
  return qualifications.map((q) => ({
    ...q,
    institution: q.institution ?? "",
    subject: q.subject ?? "",
    year: String(q.year),
    uploadStatus: q.documentName ? "uploaded" : "idle",
  }));
}

export function TutorQualificationsStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [items, setItems] = useState<QualificationDraft[]>(() => fromStoreDraft(draft.qualifications ?? []));

  function updateItem(id: string, patch: Partial<QualificationDraft>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleFileSelect(id: string, file: File | undefined) {
    if (!file) {
      updateItem(id, { documentName: undefined, uploadStatus: "idle" });
      return;
    }
    updateItem(id, { uploadStatus: "uploading" });
    // No file-upload endpoint is wired up yet (see backend storage.service.ts —
    // local provider only, no HTTP route uses it). This simulates the
    // uploading -> uploaded transition so the UI/UX is real and complete;
    // swapping in a real upload call means changing this handler only.
    setTimeout(() => updateItem(id, { documentName: file.name, uploadStatus: "uploaded" }), 900);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateDraft({
      qualifications: items
        .filter((item) => item.title.trim())
        .map((item) => ({ id: item.id, title: item.title, institution: item.institution, year: Number(item.year) || new Date().getFullYear(), subject: item.subject, documentName: item.documentName })),
    });
    navigate(tutorStepPath("verification"));
  }

  return (
    <OnboardingStepCard title="Your qualifications" description="Add your relevant qualifications — you can attach evidence now or later.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {items.map((item, index) => (
          <Card key={item.id} className="border-dashed">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">Qualification {index + 1}</p>
                {items.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove qualification">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`title-${item.id}`}>Qualification</Label>
                  <Input id={`title-${item.id}`} placeholder="e.g. BSc Mathematics" value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`institution-${item.id}`}>Institution</Label>
                  <Input id={`institution-${item.id}`} value={item.institution} onChange={(e) => updateItem(item.id, { institution: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`year-${item.id}`}>Year</Label>
                  <Input id={`year-${item.id}`} type="number" value={item.year} onChange={(e) => updateItem(item.id, { year: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`subject-${item.id}`}>Subject</Label>
                  <Input id={`subject-${item.id}`} value={item.subject} onChange={(e) => updateItem(item.id, { subject: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Evidence / document</Label>
                {item.uploadStatus === "uploaded" && item.documentName ? (
                  <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-success" />
                      {item.documentName}
                    </span>
                    <div className="flex gap-2">
                      <label className="cursor-pointer text-primary hover:underline">
                        Replace
                        <input type="file" className="sr-only" onChange={(e) => handleFileSelect(item.id, e.target.files?.[0])} />
                      </label>
                      <button type="button" className="text-destructive hover:underline" onClick={() => handleFileSelect(item.id, undefined)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : item.uploadStatus === "uploading" ? (
                  <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">
                    <Upload className="h-4 w-4" />
                    Upload evidence (optional)
                    <input type="file" className="sr-only" onChange={(e) => handleFileSelect(item.id, e.target.files?.[0])} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => setItems((current) => [...current, { id: randomUUID(), title: "", institution: "", year: "", subject: "", uploadStatus: "idle" }])}
        >
          <Plus className="h-4 w-4" />
          Add another qualification
        </Button>

        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("experience"))} onSkip={() => navigate(tutorStepPath("verification"))} />
      </form>
    </OnboardingStepCard>
  );
}
