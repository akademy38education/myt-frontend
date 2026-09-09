import type { LessonParticipantRole } from "@myt/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonObjectives } from "./LessonObjectives";
import { LessonProgress } from "./LessonProgress";
import { LessonChatPanel } from "./LessonChatPanel";
import { LessonResourcesPanel } from "./LessonResourcesPanel";
import { LessonNotesPanel } from "./LessonNotesPanel";

export interface ClassroomSidePanelProps {
  bookingId: string;
  role: LessonParticipantRole;
  objectives: string[] | undefined;
  progressStage: number;
  onAdvanceProgress: (stage: number) => void;
  defaultTab?: string;
}

/** The tabbed "everything about this lesson that isn't the whiteboard" panel — a fixed right column on desktop, a bottom drawer on mobile (see `ClassroomShell` for which container renders it in). One implementation either way, per Phase 7 spec §31/§51. */
export function ClassroomSidePanel({ bookingId, role, objectives, progressStage, onAdvanceProgress, defaultTab = "chat" }: ClassroomSidePanelProps) {
  return (
    <Tabs defaultValue={defaultTab} className="flex h-full flex-col">
      <div className="space-y-3 border-b border-border p-3">
        <LessonObjectives objectives={objectives} />
        <LessonProgress stage={progressStage} onAdvance={onAdvanceProgress} editable={role === "tutor"} />
      </div>
      <TabsList className="mx-3 mt-3">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="chat" className="flex-1 overflow-hidden">
        <LessonChatPanel bookingId={bookingId} role={role} />
      </TabsContent>
      <TabsContent value="resources" className="flex-1 overflow-hidden">
        <LessonResourcesPanel bookingId={bookingId} role={role} />
      </TabsContent>
      <TabsContent value="notes" className="flex-1 overflow-hidden">
        <LessonNotesPanel bookingId={bookingId} role={role} />
      </TabsContent>
    </Tabs>
  );
}
