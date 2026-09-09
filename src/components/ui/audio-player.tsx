import { cn } from "@/utils/cn";

export interface AudioPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  return (
    <audio controls preload="metadata" aria-label={title} className={cn("w-full", className)}>
      <source src={src} />
      Your browser does not support the audio tag.
    </audio>
  );
}
