import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { EndLessonInput, LessonParticipantRole, WhiteboardTool } from "@myt/shared";
import { LessonStatus } from "@myt/shared";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { trackEvent } from "@/utils/analytics";
import { useBookingDetail } from "@/features/bookings";
import { SUBJECTS } from "@/constants/subjects";
import { useLessonSession, useLessonParticipants, useStartLesson, useEndLesson } from "../hooks/useLessonSession";
import { useLessonRealtime } from "../hooks/useLessonRealtime";
import { useMediaControls } from "../hooks/useMediaControls";
import { useWhiteboard } from "../hooks/useWhiteboard";
import type { JoinFlowStep } from "../types";
import { DeviceCheckPanel } from "./DeviceCheckPanel";
import { WaitingRoom } from "./WaitingRoom";
import { ClassroomHeader } from "./ClassroomHeader";
import { VideoTile } from "./VideoTile";
import { WhiteboardCanvas } from "./WhiteboardCanvas";
import { WhiteboardToolbar } from "./WhiteboardToolbar";
import { ClassroomSidePanel } from "./ClassroomSidePanel";
import { ClassroomControls } from "./ClassroomControls";
import { EndLessonDialog, LeaveLessonDialog } from "./ExitDialogs";

export function ClassroomShell({ bookingId, role }: { bookingId: string; role: LessonParticipantRole }) {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { data: booking, isLoading: isBookingLoading, isError: isBookingError, refetch } = useBookingDetail(bookingId);
  const { data: lesson, isLoading: isLessonLoading } = useLessonSession(bookingId);
  const { data: participants } = useLessonParticipants(bookingId, booking);
  const startLesson = useStartLesson(bookingId);
  const endLesson = useEndLesson(bookingId);

  const media = useMediaControls();
  const realtime = useLessonRealtime(bookingId);
  const whiteboard = useWhiteboard(bookingId, realtime.broadcastStroke);

  const [step, setStep] = useState<JoinFlowStep>("device-check");
  const [tool, setTool] = useState<WhiteboardTool>("pen");
  const [color, setColor] = useState("#0f172a");
  const [strokeSize, setStrokeSize] = useState(4);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  useEffect(() => {
    if (realtime.remoteStroke) whiteboard.addRemoteStroke(realtime.remoteStroke);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime.remoteStroke]);

  useEffect(() => {
    setStep((current) => {
      if (current === "device-check") return current; // device check always runs first, regardless of the lesson's current status
      if (lesson?.status === LessonStatus.COMPLETED) return "ended";
      if (lesson?.status === LessonStatus.IN_PROGRESS) return "live";
      return current;
    });
  }, [lesson?.status]);

  useEffect(() => {
    if (step !== "ended") return;
    const summaryPath = role === "tutor" ? `/tutor/lessons/${bookingId}/summary` : `/student/lessons/${bookingId}/summary`;
    navigate(summaryPath, { replace: true });
  }, [step, role, bookingId, navigate]);

  if (isBookingLoading || isLessonLoading) return <LoadingState label="Loading your classroom..." />;
  if (isBookingError || !booking) return <ErrorState title="We couldn't load this lesson" onRetry={() => refetch()} />;

  const subjectName = SUBJECTS.find((s) => s.id === booking.subjectId)?.name ?? "Lesson";
  const other = role === "tutor" ? participants?.student : participants?.tutor;
  const me = role === "tutor" ? participants?.tutor : participants?.student;

  function handleToggleCamera() {
    const next = media.toggleCamera();
    realtime.broadcastMediaState({ cameraOn: next, micOn: media.micOn });
  }

  function handleToggleMicrophone() {
    const next = media.toggleMicrophone();
    realtime.broadcastMediaState({ cameraOn: media.cameraOn, micOn: next });
  }

  async function handleStart() {
    try {
      await startLesson.mutateAsync({});
      trackEvent("lesson_started");
      setStep("live");
    } catch {
      toast.error("Couldn't start the lesson. Please try again.");
    }
  }

  async function handleConfirmEnd(input: EndLessonInput) {
    try {
      await endLesson.mutateAsync({ ...input, objectives: lesson?.objectives });
      trackEvent("lesson_completed");
      setShowEndDialog(false);
      navigate(`/tutor/lessons/${bookingId}/summary`);
    } catch {
      toast.error("Couldn't end the lesson. Please try again.");
    }
  }

  function handleConfirmLeave() {
    setShowLeaveDialog(false);
    navigate(role === "student" ? `/student/bookings/${bookingId}` : `/tutor/bookings/${bookingId}`);
  }

  function handleExitClick() {
    if (role === "tutor") setShowEndDialog(true);
    else setShowLeaveDialog(true);
  }

  function handleExportWhiteboard() {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas[aria-label="Lesson whiteboard"]');
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `myt-whiteboard-${bookingId}.png`;
    link.click();
  }

  if (step === "device-check") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <DeviceCheckPanel media={media} onContinue={() => setStep(lesson?.status === LessonStatus.IN_PROGRESS ? "live" : "waiting-room")} />
      </div>
    );
  }

  if (step === "waiting-room") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <WaitingRoom
          role={role}
          tutorName={role === "tutor" ? "your student" : (other?.name ?? "your tutor")}
          subjectName={subjectName}
          scheduledStart={booking.scheduledStart}
          media={media}
          participantOnline={realtime.participantOnline}
          onStart={handleStart}
          isStarting={startLesson.isPending}
        />
      </div>
    );
  }

  if (step === "ended") {
    return <LoadingState label="Wrapping up your lesson..." />;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ClassroomHeader subjectName={subjectName} startedAt={lesson?.startedAt} isLive={lesson?.status === LessonStatus.IN_PROGRESS} connectionQuality={realtime.participantOnline ? "good" : "unstable"} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col gap-3 p-3">
          <div className="relative min-h-0 flex-1">
            <WhiteboardCanvas strokes={whiteboard.strokes} tool={tool} color={color} size={strokeSize} authorRole={role} canEdit onStrokeComplete={whiteboard.addStroke} />
            <div className="absolute right-3 top-3 flex gap-2">
              <VideoTile name={me?.name ?? "You"} stream={media.localStream} cameraOn={media.cameraOn} micOn={media.micOn} muted className="h-20 w-32 sm:h-24 sm:w-40" />
              <VideoTile
                name={other?.name ?? "Participant"}
                cameraOn={realtime.remoteMediaState?.cameraOn ?? true}
                micOn={realtime.remoteMediaState?.micOn ?? true}
                className="h-20 w-32 sm:h-24 sm:w-40"
              />
            </div>
          </div>
          <WhiteboardToolbar
            tool={tool}
            onToolChange={setTool}
            color={color}
            onColorChange={setColor}
            size={strokeSize}
            onSizeChange={setStrokeSize}
            canUndo={whiteboard.canUndo}
            canRedo={whiteboard.canRedo}
            onUndo={whiteboard.undo}
            onRedo={whiteboard.redo}
            onClear={whiteboard.clear}
            onExport={handleExportWhiteboard}
            canEdit
          />
        </div>

        {isDesktop && (
          <aside className="w-80 shrink-0 border-l border-border">
            <ClassroomSidePanel bookingId={bookingId} role={role} objectives={lesson?.objectives} progressStage={realtime.progressStage} onAdvanceProgress={realtime.broadcastProgress} />
          </aside>
        )}
      </div>

      <ClassroomControls
        micOn={media.micOn}
        cameraOn={media.cameraOn}
        screenSharing={media.screenSharing}
        whiteboardActive={sidePanelOpen}
        isTutor={role === "tutor"}
        onToggleMic={handleToggleMicrophone}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={media.toggleScreenShare}
        onToggleWhiteboard={() => setSidePanelOpen((open) => !open)}
        onExit={handleExitClick}
      />

      {!isDesktop && (
        <Drawer open={sidePanelOpen} onOpenChange={setSidePanelOpen}>
          <DrawerContent side="bottom" className="h-[70vh]">
            <DrawerTitle className="sr-only">Lesson panel</DrawerTitle>
            <ClassroomSidePanel bookingId={bookingId} role={role} objectives={lesson?.objectives} progressStage={realtime.progressStage} onAdvanceProgress={realtime.broadcastProgress} />
          </DrawerContent>
        </Drawer>
      )}

      <EndLessonDialog open={showEndDialog} onOpenChange={setShowEndDialog} onConfirm={handleConfirmEnd} isEnding={endLesson.isPending} />
      <LeaveLessonDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog} onConfirm={handleConfirmLeave} />
    </div>
  );
}
