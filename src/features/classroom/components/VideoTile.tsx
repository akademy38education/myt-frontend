import { useEffect, useRef } from "react";
import { Mic, MicOff, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export interface VideoTileProps {
  name: string;
  stream?: MediaStream | null;
  cameraOn: boolean;
  micOn: boolean;
  speaking?: boolean;
  muted?: boolean;
  className?: string;
}

/** Renders a real `<video>` element bound to `stream` when one is supplied (the local participant's own camera) — a tile with no stream falls back to an avatar, which is what every remote tile shows today since no real peer connection exists (see `videoProvider.ts`'s doc comment). */
export function VideoTile({ name, stream, cameraOn, micOn, speaking, muted, className }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream ?? null;
  }, [stream]);

  return (
    <div
      className={cn(
        "relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-900 transition-shadow",
        speaking && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
    >
      {stream && cameraOn ? (
        <video ref={videoRef} autoPlay playsInline muted={muted} className="h-full w-full object-cover" />
      ) : (
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-slate-700 text-lg text-white">{initials(name)}</AvatarFallback>
        </Avatar>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
        {micOn ? <Mic className="h-3 w-3" aria-hidden="true" /> : <MicOff className="h-3 w-3 text-destructive" aria-hidden="true" />}
        <span>{name}</span>
      </div>
      {!cameraOn && (
        <div className="absolute right-2 top-2 rounded-md bg-black/50 p-1 text-white">
          <VideoOff className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
