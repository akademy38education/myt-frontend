import type { DeviceCheckResult, DeviceState } from "../types";

export interface ParticipantMediaState {
  cameraOn: boolean;
  micOn: boolean;
  speaking: boolean;
}

export type VideoProviderEvent = "media-state-changed" | "screen-share-changed" | "connection-changed";

/**
 * The seam a real WebRTC/video provider (Twilio, Daily, LiveKit, ...) would
 * implement later — see Phase 7 spec §11/§12. No such provider is
 * integrated yet, so `MockVideoProvider` below is the only implementation:
 * it uses the REAL browser camera/microphone/screen-share APIs for the
 * LOCAL participant's own preview (this is genuinely your camera, not a
 * fake), but does not establish any actual peer connection to the other
 * participant — there is no real video/audio transport between the two
 * browsers. Never present this as more connected than it is.
 */
export interface VideoProviderAdapter {
  connect(): Promise<DeviceCheckResult>;
  disconnect(): void;
  toggleCamera(): boolean;
  toggleMicrophone(): boolean;
  startScreenShare(): Promise<boolean>;
  stopScreenShare(): void;
  getLocalStream(): MediaStream | null;
  getScreenStream(): MediaStream | null;
  isCameraOn(): boolean;
  isMicrophoneOn(): boolean;
  isScreenSharing(): boolean;
  on(event: VideoProviderEvent, handler: () => void): () => void;
}

class MockVideoProvider implements VideoProviderAdapter {
  private stream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private cameraOn = true;
  private micOn = true;
  private listeners = new Map<VideoProviderEvent, Set<() => void>>();

  private emit(event: VideoProviderEvent) {
    this.listeners.get(event)?.forEach((handler) => handler());
  }

  on(event: VideoProviderEvent, handler: () => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  /**
   * Requests camera + microphone together, in ONE prompt (Phase 7 spec §3:
   * "do not request permissions repeatedly") — this single stream is then
   * reused across device check → waiting room → live classroom, so
   * accepting once is enough for the whole session.
   */
  async connect(): Promise<DeviceCheckResult> {
    const result: DeviceCheckResult = { camera: "checking", microphone: "checking", speaker: "checking", connection: "checking" };

    if (!navigator.mediaDevices?.getUserMedia) {
      result.camera = "unsupported";
      result.microphone = "unsupported";
    } else {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        result.camera = this.stream.getVideoTracks().length > 0 ? "granted" : "missing";
        result.microphone = this.stream.getAudioTracks().length > 0 ? "granted" : "missing";
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        const state: DeviceState = name === "NotFoundError" ? "missing" : name === "NotAllowedError" ? "denied" : "denied";
        result.camera = state;
        result.microphone = state;
      }
    }

    result.speaker = await this.checkSpeaker();
    result.connection = navigator.onLine ? "good" : "offline";

    return result;
  }

  private async checkSpeaker(): Promise<DeviceState> {
    if (!navigator.mediaDevices?.enumerateDevices) return "unsupported";
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((d) => d.kind === "audiooutput") ? "granted" : "missing";
    } catch {
      return "unsupported";
    }
  }

  disconnect() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.stopScreenShare();
  }

  toggleCamera(): boolean {
    this.cameraOn = !this.cameraOn;
    this.stream?.getVideoTracks().forEach((track) => (track.enabled = this.cameraOn));
    this.emit("media-state-changed");
    return this.cameraOn;
  }

  toggleMicrophone(): boolean {
    this.micOn = !this.micOn;
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = this.micOn));
    this.emit("media-state-changed");
    return this.micOn;
  }

  async startScreenShare(): Promise<boolean> {
    if (!navigator.mediaDevices?.getDisplayMedia) return false;
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.screenStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        // The browser's own "Stop sharing" control (or closing the shared window) ends the track directly — react to that the same as an explicit stop.
        this.screenStream = null;
        this.emit("screen-share-changed");
      });
      this.emit("screen-share-changed");
      return true;
    } catch {
      return false;
    }
  }

  stopScreenShare() {
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.screenStream = null;
    this.emit("screen-share-changed");
  }

  getLocalStream() {
    return this.stream;
  }

  getScreenStream() {
    return this.screenStream;
  }

  isCameraOn() {
    return this.cameraOn;
  }

  isMicrophoneOn() {
    return this.micOn;
  }

  isScreenSharing() {
    return Boolean(this.screenStream);
  }
}

/** One provider instance per mounted classroom page — created fresh by `useMediaControls`, never shared globally, so leaving a lesson always tears down its own media cleanly (Phase 7 spec §76). */
export function createVideoProvider(): VideoProviderAdapter {
  return new MockVideoProvider();
}
