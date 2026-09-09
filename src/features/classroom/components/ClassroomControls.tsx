import { LogOut, Mic, MicOff, MonitorUp, PencilRuler, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";

export interface ClassroomControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  whiteboardActive: boolean;
  isTutor: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleWhiteboard: () => void;
  onExit: () => void;
}

function ControlButton({ active, danger, label, onClick, children }: { active?: boolean; danger?: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={danger ? "destructive" : active ? "secondary" : "outline"}
          size="icon"
          className={cn("h-11 w-11 rounded-full", !active && !danger && "text-muted-foreground")}
          onClick={onClick}
          aria-label={label}
          aria-pressed={active}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ClassroomControls({ micOn, cameraOn, screenSharing, whiteboardActive, isTutor, onToggleMic, onToggleCamera, onToggleScreenShare, onToggleWhiteboard, onExit }: ClassroomControlsProps) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t border-border bg-card px-4 py-3 sm:gap-3">
      <ControlButton label={micOn ? "Mute microphone" : "Unmute microphone"} active={!micOn} onClick={onToggleMic}>
        {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-destructive" />}
      </ControlButton>
      <ControlButton label={cameraOn ? "Turn camera off" : "Turn camera on"} active={!cameraOn} onClick={onToggleCamera}>
        {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-destructive" />}
      </ControlButton>
      <ControlButton label={screenSharing ? "Stop sharing" : "Share screen"} active={screenSharing} onClick={onToggleScreenShare}>
        <MonitorUp className="h-4 w-4" />
      </ControlButton>
      <ControlButton label="Whiteboard" active={whiteboardActive} onClick={onToggleWhiteboard}>
        <PencilRuler className="h-4 w-4" />
      </ControlButton>
      <ControlButton label={isTutor ? "End lesson" : "Leave lesson"} danger onClick={onExit}>
        {isTutor ? <PhoneOff className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
      </ControlButton>
    </div>
  );
}
