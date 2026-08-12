/** Mansi Precision — continuous world choreography */

const enc = (name) => `/projects/${encodeURIComponent(name)}`;

export const PRECISION_ASSETS = {
  hero: enc("01 The Hero.png"),
  observing: enc("02 Observing.png"),
  nightFocus: enc("02A Night Focus.png"),
  dayClarity: enc("02B Day Clarity.png"),
  signature: enc("02C Signature Environment.png"),
  building: enc("03 Building.png"),
  moving: enc("04 Moving.png"),
  clarifying: enc("05 Clarifying.png"),
  lookingBack: enc("06 Looking back.png"),
  exhibition: enc("Project Exhibition.png"),
  transformation: enc("Transformation.png"),
  visual: enc("Visual.png"),
  characterMaster: enc("Mansi Character Master.png"),
  convergenceVideo: enc("Create_the_next_installation_i.mp4"),
  referenceVideo: enc("Use_the_supplied_reference_ima.mp4"),
};

/** Scroll beats for one continuous camera journey */
export const PRECISION_BEATS = {
  enter: { start: 0, end: 0.12 },
  approach: { start: 0.1, end: 0.28 },
  streams: { start: 0.2, end: 0.4 },
  convergence: { start: 0.38, end: 0.52 },
  clarity: { start: 0.5, end: 0.62 },
  output: { start: 0.58, end: 0.72 },
  exhibition: { start: 0.7, end: 1 },
};

/** In-world destinations — nav travels here, never teleports */
export const WORLD_DESTINATIONS = {
  world: 0.0,
  clarity: 0.55,
  work: 0.74,
  "ai-lab": 0.88,
  experience: 0.92,
  contact: 0.96,
};

export const NAV_LINKS = [
  { id: "world", label: "WORLD", href: null, progress: 0.0 },
  { id: "work", label: "WORK", href: null, progress: 0.74 },
  { id: "ai-lab", label: "AI LAB", href: "/tools/ai-lab", progress: 0.88 },
  { id: "experience", label: "EXPERIENCE", href: "/credentials", progress: 0.92 },
  { id: "contact", label: "CONTACT", href: "/contact", progress: 0.96 },
];

export const CONVERGENCE_STATES = [
  { id: "dormant", label: "01 DORMANT", from: 0, to: 0.2 },
  { id: "observe", label: "02 OBSERVE", from: 0.2, to: 0.4 },
  { id: "converging", label: "03 CONVERGING", from: 0.4, to: 0.65 },
  { id: "clarified", label: "04 CLARIFIED", from: 0.65, to: 0.82 },
  { id: "output", label: "05 OUTPUT", from: 0.82, to: 1 },
];

/**
 * Camera keyframes — quiet enter → data awakens → clarity hold → work.
 */
export const CAMERA_PATH = [
  { t: 0.0, position: [0.2, 1.65, 22], lookAt: [0.8, 1.2, 14], fov: 38 },
  { t: 0.12, position: [0.15, 1.55, 18.5], lookAt: [0, 1.25, 10], fov: 36 },
  { t: 0.28, position: [0.05, 1.5, 12], lookAt: [0, 1.35, 4], fov: 34 },
  { t: 0.42, position: [0.0, 1.48, 6.5], lookAt: [0, 1.4, 0.5], fov: 32 },
  // Clarity hold — nearly still
  { t: 0.52, position: [0.0, 1.45, 3.6], lookAt: [0, 1.42, 0], fov: 30 },
  { t: 0.6, position: [0.0, 1.45, 3.4], lookAt: [0, 1.4, -1], fov: 30 },
  { t: 0.7, position: [0.1, 1.55, -2], lookAt: [-2.5, 1.4, -6], fov: 36 },
  { t: 0.82, position: [0.2, 1.6, -8], lookAt: [2.5, 1.4, -12], fov: 38 },
  { t: 0.92, position: [0.1, 1.7, -14], lookAt: [0, 1.35, -20], fov: 40 },
  { t: 1.0, position: [0.0, 1.75, -18], lookAt: [0, 1.3, -24], fov: 40 },
];

export function getConvergenceState(localProgress) {
  const p = Math.min(1, Math.max(0, localProgress));
  for (let i = CONVERGENCE_STATES.length - 1; i >= 0; i--) {
    if (p >= CONVERGENCE_STATES[i].from) return CONVERGENCE_STATES[i];
  }
  return CONVERGENCE_STATES[0];
}

export function remap(progress, start, end) {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpVec3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function sampleCameraPath(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const path = CAMERA_PATH;
  let i = 0;
  while (i < path.length - 1 && path[i + 1].t < p) i += 1;
  const a = path[i];
  const b = path[Math.min(i + 1, path.length - 1)];
  const span = Math.max(0.0001, b.t - a.t);
  const t = smoothstep(0, 1, (p - a.t) / span);
  return {
    position: lerpVec3(a.position, b.position, t),
    lookAt: lerpVec3(a.lookAt, b.lookAt, t),
    fov: lerp(a.fov, b.fov, t),
  };
}

export const THEME_PALETTE = {
  night: {
    background: "#0c121c",
    fog: "#101820",
    fogNear: 18,
    fogFar: 62,
    floor: "#1c2634",
    metal: "#5a6778",
    metalDark: "#151e2a",
    glass: "#243446",
    aluminium: "#c0cad6",
    amber: "#e0a83a",
    cyan: "#5ec8d8",
    ambient: 0.55,
    key: 1.35,
    rim: 0.55,
  },
  day: {
    background: "#d2dae4",
    fog: "#c0cad6",
    fogNear: 22,
    fogFar: 70,
    floor: "#a8b4c4",
    metal: "#7a8696",
    metalDark: "#5a6676",
    glass: "#b4c0ce",
    aluminium: "#d4dae4",
    amber: "#c48e22",
    cyan: "#2a8fa0",
    ambient: 0.85,
    key: 1.25,
    rim: 0.45,
  },
};
