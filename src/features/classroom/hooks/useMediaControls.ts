import { useEffect, useRef, useState } from "react";
import type { DeviceCheckResult } from "../types";
import { createVideoProvider, type VideoProviderAdapter } from "../services/videoProvider";

/**
 * Owns one `VideoProviderAdapter` instance for the lifetime of the
 * classroom page — connects once (device check), exposes toggles, and
 * guarantees `disconnect()` runs on unmount so camera/mic never keep
 * running after the user leaves (Phase 7 spec §75/§76).
 */
export function useMediaControls() {
  const providerRef = useRef<VideoProviderAdapter>();
  const [deviceResult, setDeviceResult] = useState<DeviceCheckResult | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    providerRef.current = createVideoProvider();
    return () => providerRef.current?.disconnect();
  }, []);

  async function connect(): Promise<DeviceCheckResult> {
    const provider = providerRef.current!;
    const result = await provider.connect();
    setDeviceResult(result);
    setLocalStream(provider.getLocalStream());
    setCameraOn(provider.isCameraOn());
    setMicOn(provider.isMicrophoneOn());
    return result;
  }

  function toggleCamera() {
    const next = providerRef.current?.toggleCamera() ?? false;
    setCameraOn(next);
    return next;
  }

  function toggleMicrophone() {
    const next = providerRef.current?.toggleMicrophone() ?? false;
    setMicOn(next);
    return next;
  }

  async function toggleScreenShare() {
    const provider = providerRef.current;
    if (!provider) return false;
    if (provider.isScreenSharing()) {
      provider.stopScreenShare();
      setScreenSharing(false);
      setScreenStream(null);
      return false;
    }
    const started = await provider.startScreenShare();
    setScreenSharing(started);
    setScreenStream(started ? provider.getScreenStream() : null);
    if (started) {
      const track = provider.getScreenStream()?.getVideoTracks()[0];
      track?.addEventListener("ended", () => {
        setScreenSharing(false);
        setScreenStream(null);
      });
    }
    return started;
  }

  return { deviceResult, cameraOn, micOn, screenSharing, localStream, screenStream, connect, toggleCamera, toggleMicrophone, toggleScreenShare };
}
