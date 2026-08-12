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
  enter: { start: 0, end: 0.16 },
  approach: { start: 0.14, end: 0.36 },
  convergence: { start: 0.34, end: 0.58 },
  clarity: { start: 0.56, end: 0.7 },
  output: { start: 0.68, end: 0.84 },
  work: { start: 0.82, end: 1 },
};

export const CONVERGENCE_STATES = [
  { id: "dormant", label: "01 DORMANT", from: 0, to: 0.2 },
  { id: "observe", label: "02 OBSERVE", from: 0.2, to: 0.4 },
  { id: "converging", label: "03 CONVERGING", from: 0.4, to: 0.65 },
  { id: "clarified", label: "04 CLARIFIED", from: 0.65, to: 0.82 },
  { id: "output", label: "05 OUTPUT", from: 0.82, to: 1 },
];

export const NAV_LINKS = [
  { href: "/projects", label: "WORK" },
  { href: "/tools/ai-lab", label: "AI LAB" },
  { href: "/credentials", label: "EXPERIENCE" },
  { href: "/contact", label: "CONTACT" },
];

export const PROJECT_01 = {
  id: "project-01",
  code: "PROJECT 01",
  name: "Platform Clarity",
  problem: "Fragmented pipelines obscured the signal.",
  system: "Converging rails · shared contracts · singular output.",
  decisions: "Reduce surface area. Keep the decision point visible.",
  result: "One pathway. Measurable clarity.",
};

/**
 * Camera keyframes through ONE hall.
 * +Z is entrance; origin is Convergence; −Z is Work.
 */
export const CAMERA_PATH = [
  { t: 0.0, position: [0.35, 1.55, 22.5], lookAt: [0, 1.2, 8], fov: 40 },
  { t: 0.16, position: [0.2, 1.5, 16.5], lookAt: [0, 1.15, 4], fov: 38 },
  { t: 0.34, position: [-0.15, 1.45, 9.2], lookAt: [0, 1.35, 0.5], fov: 36 },
  { t: 0.5, position: [0.05, 1.4, 4.4], lookAt: [0, 1.45, 0], fov: 34 },
  { t: 0.62, position: [0.0, 1.42, 3.1], lookAt: [0, 1.48, 0], fov: 32 },
  { t: 0.72, position: [0.0, 1.4, 2.4], lookAt: [0, 1.35, -4], fov: 34 },
  { t: 0.84, position: [0.15, 1.45, -4.5], lookAt: [0.4, 1.35, -12], fov: 36 },
  { t: 1.0, position: [0.6, 1.5, -12.5], lookAt: [1.2, 1.4, -18], fov: 38 },
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
    background: "#0b0d11",
    fog: "#0d1016",
    fogNear: 28,
    fogFar: 65,
    floor: "#1a1e26",
    metal: "#3a414c",
    metalDark: "#222830",
    glass: "#2a323e",
    aluminium: "#9aa3ae",
    amber: "#c8922a",
    ambient: 0.42,
    key: 1.15,
    rim: 0.45,
  },
  day: {
    background: "#d9d2c4",
    fog: "#cfc6b6",
    fogNear: 26,
    fogFar: 75,
    floor: "#c4bbac",
    metal: "#9aa1aa",
    metalDark: "#7a828c",
    glass: "#b9b3a8",
    aluminium: "#b8bec6",
    amber: "#b88420",
    ambient: 0.68,
    key: 1.15,
    rim: 0.45,
  },
};
