import { cn } from "@/utils/cn";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}

/**
 * Thin wrapper around the native <video> element. Swap this implementation
 * for a richer player (chapters, playback speed, captions) once the
 * `recordings` module is implemented — callers only ever import this
 * component, not a specific player library.
 */
export function VideoPlayer({ src, poster, title, className }: VideoPlayerProps) {
  return (
    <video
      controls
      preload="metadata"
      poster={poster}
      aria-label={title}
      className={cn("w-full rounded-lg border border-border bg-black", className)}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
}
