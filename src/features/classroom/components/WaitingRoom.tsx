import { useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LessonParticipantRole } from "@myt/shared";
import type { useMediaControls } from "../hooks/useMediaControls";
import { VideoTile } from "./VideoTile";
import { firstName } from "@/utils/formatters";

function useCountdown(targetIso: string) {
  const [msRemaining, setMsRemaining] = useState(() => new Date(targetIso).getTime() - Date.now());
  useEffect(() => {
    const interval = setInterval(() => setMsRemaining(new Date(targetIso).getTime() - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetIso]);
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

export interface WaitingRoomProps {
  role: LessonParticipantRole;
  tutorName: string;
  subjectName: string;
  scheduledStart: string;
  media: ReturnType<typeof useMediaControls>;
  participantOnline: boolean;
  onStart?: () => void;
  isStarting?: boolean;
}

export function WaitingRoom({ role, tutorName, subjectName, scheduledStart, media, participantOnline, onStart, isStarting }: WaitingRoomProps) {
  const isEarly = new Date(scheduledStart).getTime() > Date.now();
  const countdown = useCountdown(scheduledStart);

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-semibold">{tutorName}</p>
      <p className="mb-6 text-sm text-muted-foreground">{subjectName}</p>

      <Card className="mb-6 overflow-hidden">
        <VideoTile name="You" stream={media.localStream} cameraOn={media.cameraOn} micOn={media.micOn} muted className="aspect-video rounded-none" />
      </Card>

      <div className="mb-6 flex justify-center gap-3">
        <Button variant={media.cameraOn ? "outline" : "secondary"} size="icon" onClick={media.toggleCamera} aria-label={media.cameraOn ? "Turn camera off" : "Turn camera on"}>
          {media.cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
        <Button variant={media.micOn ? "outline" : "secondary"} size="icon" onClick={media.toggleMicrophone} aria-label={media.micOn ? "Mute microphone" : "Unmute microphone"}>
          {media.micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
      </div>

      {role === "student" ? (
        isEarly ? (
          <div>
            <p className="text-sm text-muted-foreground">Your lesson starts in</p>
            <p className="my-2 text-3xl font-bold tabular-nums">{countdown}</p>
            <p className="text-sm text-muted-foreground">You're early — feel free to wait here.</p>
          </div>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">Waiting for {firstName(tutorName)}…</p>
        )
      ) : participantOnline ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-success">Your student is ready.</p>
          <Button size="lg" className="w-full" onClick={onStart} isLoading={isStarting}>
            Start Lesson
          </Button>
        </div>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">Waiting for your student to join…</p>
      )}
    </div>
  );
}
