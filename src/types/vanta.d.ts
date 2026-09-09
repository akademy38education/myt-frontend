/** Vanta.js ships no TypeScript types; this is a minimal, honest declaration covering only what we actually use (the CLOUDS effect factory). */
declare module "vanta/dist/vanta.clouds.min" {
  import type * as THREE from "three";

  export interface VantaCloudsOptions {
    el: HTMLElement | string;
    THREE?: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    speed?: number;
    backgroundColor?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunColor?: number;
    sunGlareColor?: number;
    sunlightColor?: number;
  }

  export interface VantaEffectInstance {
    destroy(): void;
    resize(): void;
  }

  export default function CLOUDS(options: VantaCloudsOptions): VantaEffectInstance;
}

declare module "vanta/dist/vanta.rings.min" {
  import type * as THREE from "three";
  import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";

  export interface VantaRingsOptions {
    el: HTMLElement | string;
    THREE?: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
  }

  export default function RINGS(options: VantaRingsOptions): VantaEffectInstance;
}

declare module "vanta/dist/vanta.fog.min" {
  import type * as THREE from "three";
  import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";

  export interface VantaFogOptions {
    el: HTMLElement | string;
    THREE?: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    zoom?: number;
    speed?: number;
  }

  export default function FOG(options: VantaFogOptions): VantaEffectInstance;
}

/**
 * TOPOLOGY is built on p5.js, not three.js — it reads `window.p5` directly
 * at module-evaluation time rather than taking a `THREE`-style option, so
 * the caller must set `window.p5` before importing this module (see
 * `VantaTopologyBackground.tsx`).
 */
declare module "vanta/dist/vanta.topology.min" {
  import type { VantaEffectInstance } from "vanta/dist/vanta.clouds.min";

  export interface VantaTopologyOptions {
    el: HTMLElement | string;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
  }

  export default function TOPOLOGY(options: VantaTopologyOptions): VantaEffectInstance;
}

/** Set by `VantaTopologyBackground` before importing the effect — see that module's doc comment. This file has no top-level import/export, so it's already an ambient global script — `interface Window` merges directly without a `declare global` wrapper. */
interface Window {
  p5?: unknown;
}
