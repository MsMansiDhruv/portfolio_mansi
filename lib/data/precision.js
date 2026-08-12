/** Mansi Precision — interactive world destinations & helpers */

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

/**
 * Named camera views — nav travels here through the same world.
 * No scroll progress; destinations are spatial.
 */
export const WORLD_VIEWS = {
  home: {
    id: "home",
    position: [0.2, 1.62, 15.5],
    lookAt: [0.4, 1.28, 7.5],
    fov: 38,
  },
  work: {
    id: "work",
    position: [0.15, 1.68, 7.2],
    lookAt: [0, 1.35, -1],
    fov: 36,
  },
  "ai-lab": {
    id: "ai-lab",
    position: [0.1, 1.72, -2.5],
    lookAt: [0, 1.35, -10],
    fov: 38,
  },
  experience: {
    id: "experience",
    position: [0.05, 1.75, -9],
    lookAt: [0, 1.3, -17],
    fov: 40,
  },
  contact: {
    id: "contact",
    position: [0, 1.78, -15],
    lookAt: [0, 1.28, -23],
    fov: 40,
  },
};

export const NAV_LINKS = [
  { id: "work", label: "WORK", href: null, view: "work" },
  { id: "ai-lab", label: "AI LAB", href: "/tools/ai-lab", view: "ai-lab" },
  { id: "experience", label: "EXPERIENCE", href: "/credentials", view: "experience" },
  { id: "contact", label: "CONTACT", href: "/contact", view: "contact" },
];

export const CONVERGENCE_STATES = [
  { id: "dormant", label: "01 QUIET", from: 0, to: 0.2 },
  { id: "observe", label: "02 OBSERVE", from: 0.2, to: 0.45 },
  { id: "live", label: "03 LIVE", from: 0.45, to: 0.75 },
  { id: "focus", label: "04 FOCUS", from: 0.75, to: 1 },
];

export function getConvergenceState(energy) {
  const p = Math.min(1, Math.max(0, energy));
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

export const THEME_PALETTE = {
  night: {
    background: "#0c121c",
    fog: "#101820",
    fogNear: 14,
    fogFar: 48,
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
    fogNear: 16,
    fogFar: 55,
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
