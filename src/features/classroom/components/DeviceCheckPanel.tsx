import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mic, Video, Volume2, Wifi, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DeviceCheckResult, DeviceState } from "../types";
import type { useMediaControls } from "../hooks/useMediaControls";
import { VideoTile } from "./VideoTile";

const RECOVERY_HINT: Partial<Record<DeviceState, string>> = {
  denied: "Please allow access in your browser's site settings, then try again.",
  missing: "We couldn't find this device — check it's plugged in and try again.",
  unsupported: "Your browser doesn't support this check — the lesson will still work without it.",
};

function StatusRow({ label, icon: Icon, state }: { label: string; icon: typeof Mic; state: DeviceState | "checking" }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <span className="flex items-center gap-2.5 text-sm font-medium">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </span>
      {state === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      {state === "granted" && (
        <span className="flex items-center gap-1.5 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> Working
        </span>
      )}
      {state !== "checking" && state !== "granted" && (
        <span className="flex items-center gap-1.5 text-sm text-destructive">
          <XCircle className="h-4 w-4" /> {state === "denied" ? "Blocked" : state === "missing" ? "Not found" : "Unavailable"}
        </span>
      )}
    </div>
  );
}

export interface DeviceCheckPanelProps {
  media: ReturnType<typeof useMediaControls>;
  onContinue: () => void;
}

/** Requests camera/mic exactly once, on mount — never re-prompts on re-render (Phase 7 spec §3/§75). */
export function DeviceCheckPanel({ media, onContinue }: DeviceCheckPanelProps) {
  const [result, setResult] = useState<DeviceCheckResult | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    media.connect().then((r) => {
      if (!cancelled) {
        setResult(r);
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const problems = result ? Object.values(result).filter((s) => s !== "granted" && s !== "good" && s !== "checking") : [];

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-center text-xl font-semibold">Ready for your lesson?</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">We'll quickly check your camera and microphone.</p>

      <Card className="mb-4 overflow-hidden">
        <VideoTile name="You" stream={media.localStream} cameraOn={media.cameraOn} micOn={media.micOn} muted className="aspect-video rounded-none" />
      </Card>

      <Card className="mb-4">
        <CardContent className="p-5">
          <StatusRow label="Camera" icon={Video} state={checking ? "checking" : (result?.camera ?? "unsupported")} />
          <StatusRow label="Microphone" icon={Mic} state={checking ? "checking" : (result?.microphone ?? "unsupported")} />
          <StatusRow label="Speaker" icon={Volume2} state={checking ? "checking" : (result?.speaker ?? "unsupported")} />
          <StatusRow label="Connection" icon={Wifi} state={checking ? "checking" : result?.connection === "good" ? "granted" : "denied"} />
        </CardContent>
      </Card>

      {problems.length > 0 && !checking && (
        <p className="mb-4 rounded-md bg-warning/10 p-3 text-xs text-warning-foreground">
          {RECOVERY_HINT[problems[0] as DeviceState] ?? "You can still continue — you can enable this later from your browser settings."}
        </p>
      )}

      <Button className="w-full" size="lg" disabled={checking} onClick={onContinue}>
        Join Lesson
      </Button>
    </div>
  );
}
