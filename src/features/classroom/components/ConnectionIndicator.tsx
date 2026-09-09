import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import type { ConnectionQuality } from "../types";
import { cn } from "@/utils/cn";

const META: Record<ConnectionQuality, { label: string; icon: typeof Wifi; className: string }> = {
  excellent: { label: "Excellent connection", icon: Wifi, className: "text-success" },
  good: { label: "Good connection", icon: Wifi, className: "text-success" },
  unstable: { label: "Connection unstable", icon: AlertTriangle, className: "text-warning" },
  disconnected: { label: "Disconnected", icon: WifiOff, className: "text-destructive" },
  reconnecting: { label: "Reconnecting…", icon: RefreshCw, className: "text-warning animate-spin" },
};

export function ConnectionIndicator({ quality }: { quality: ConnectionQuality }) {
  const meta = META[quality];
  const Icon = meta.icon;
  return (
    <span className={cn("flex items-center gap-1.5 text-xs font-medium", meta.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{meta.label}</span>
    </span>
  );
}
