import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { LessonParticipantRole } from "@myt/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lock, Users2 } from "lucide-react";
import { useLessonNotes, useSaveLessonNote } from "../hooks/useLessonNotes";

export function LessonNotesPanel({ bookingId, role }: { bookingId: string; role: LessonParticipantRole }) {
  const { data } = useLessonNotes(bookingId, role);
  const saveNote = useSaveLessonNote(bookingId, role);
  const [ownDraft, setOwnDraft] = useState("");
  const [sharedDraft, setSharedDraft] = useState("");
  const canEditShared = role === "tutor";

  useEffect(() => setOwnDraft(data?.own?.body ?? ""), [data?.own?.body]);
  useEffect(() => setSharedDraft(data?.shared?.body ?? ""), [data?.shared?.body]);

  async function handleSave(visibility: "private" | "shared", body: string) {
    try {
      await saveNote.mutateAsync({ visibility, body });
      toast.success("Note saved");
    } catch {
      toast.error("Couldn't save your note. Please try again.");
    }
  }

  return (
    <Tabs defaultValue="private" className="flex h-full flex-col">
      <div className="border-b border-border p-2">
        <TabsList>
          <TabsTrigger value="private">
            <Lock className="h-3.5 w-3.5" /> Private
          </TabsTrigger>
          <TabsTrigger value="shared">
            <Users2 className="h-3.5 w-3.5" /> Shared
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="private" className="flex-1 space-y-3 p-3">
        <p className="text-xs text-muted-foreground">Only visible to you.</p>
        <Textarea value={ownDraft} onChange={(e) => setOwnDraft(e.target.value)} rows={10} placeholder="Jot down anything for yourself…" />
        <Button size="sm" onClick={() => handleSave("private", ownDraft)} isLoading={saveNote.isPending}>
          Save
        </Button>
      </TabsContent>

      <TabsContent value="shared" className="flex-1 space-y-3 p-3">
        <p className="text-xs text-muted-foreground">{canEditShared ? "Visible to your student." : "Shared by your tutor."}</p>
        <Textarea
          value={sharedDraft}
          onChange={(e) => setSharedDraft(e.target.value)}
          rows={10}
          placeholder={canEditShared ? "Today's key points…" : "Nothing shared yet."}
          readOnly={!canEditShared}
        />
        {canEditShared && (
          <Button size="sm" onClick={() => handleSave("shared", sharedDraft)} isLoading={saveNote.isPending}>
            Save & Share
          </Button>
        )}
      </TabsContent>
    </Tabs>
  );
}
