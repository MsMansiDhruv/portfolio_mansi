/** Mansi Precision — vertical-slice asset map & scroll choreography */

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

/** Scroll progress ranges (0–1) for cinematic acts */
export const PRECISION_BEATS = {
  actI: { start: 0, end: 0.28 },
  transit: { start: 0.22, end: 0.4 },
  actII: { start: 0.36, end: 0.82 },
  actIII: { start: 0.78, end: 1 },
};

/** Convergence installation states driven by Act II local progress */
export const CONVERGENCE_STATES = [
  { id: "dormant", label: "01 DORMANT", from: 0, to: 0.18 },
  { id: "observe", label: "02 OBSERVE", from: 0.18, to: 0.36 },
  { id: "converging", label: "03 CONVERGING", from: 0.36, to: 0.62 },
  { id: "clarified", label: "04 CLARIFIED", from: 0.62, to: 0.8 },
  { id: "output", label: "05 OUTPUT", from: 0.8, to: 1 },
];

export const DESTINATIONS = [
  { id: "work", label: "WORK", x: 18, y: 42 },
  { id: "ai-lab", label: "AI LAB", x: 72, y: 28 },
  { id: "experience", label: "EXPERIENCE", x: 58, y: 62 },
  { id: "about", label: "ABOUT", x: 32, y: 72 },
  { id: "contact", label: "CONTACT", x: 78, y: 78 },
];

export const NAV_LINKS = [
  { href: "/projects", label: "WORK" },
  { href: "/tools/ai-lab", label: "AI LAB" },
  { href: "/credentials", label: "EXPERIENCE" },
  { href: "/contact", label: "CONTACT" },
];

export function getConvergenceState(actIIProgress) {
  const p = Math.min(1, Math.max(0, actIIProgress));
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

export function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
