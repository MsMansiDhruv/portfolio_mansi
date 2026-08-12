/**
 * Guide lines spoken by the interactive portrait companion.
 * Tied to the master scroll phases.
 */
export const GUIDE_BEATS = [
  {
    id: "hero",
    range: [0, 0.12],
    image: "/portrait.jpg",
    title: "Mansi",
    line: "Lead Data Engineer · Solution Architect. Scroll to enter the systems map — or use the chips below.",
    action: { label: "Systems map", scrollTo: 0.18 },
  },
  {
    id: "systems",
    range: [0.12, 0.28],
    image: "/character/mansi-guide.png",
    title: "Systems map",
    line: "Each icon is a pipeline stage. Click AI LAB to open the lab. Other stages move the camera into that part of the system.",
    action: { label: "Open AI Lab", href: "/tools/ai-lab" },
  },
  {
    id: "pipeline",
    range: [0.28, 0.55],
    image: "/character/mansi-guide.png",
    title: "Data in motion",
    line: "Teal particles are valid records. Amber ones fail validation and drop out. This is how production pipelines actually behave.",
    action: { label: "See architecture", scrollTo: 0.5 },
  },
  {
    id: "projects",
    range: [0.55, 0.75],
    image: "/portrait.jpg",
    title: "Selected builds",
    line: "These are real systems I shipped. Open a case study for problem → approach → architecture → result.",
    action: { label: "All projects", href: "/projects" },
  },
  {
    id: "lab",
    range: [0.75, 0.88],
    image: "/character/mansi-guide.png",
    title: "AI Engineering Lab",
    line: "Six chambers: Ask Mansi, Pipeline Review, Architecture, Interview, Cloud Cost, and more. Each mode stays in its lane.",
    action: { label: "Enter the lab", href: "/tools/ai-lab" },
  },
  {
    id: "final",
    range: [0.88, 1],
    image: "/portrait.jpg",
    title: "Next",
    line: "If you're hiring for serious data systems work — let's talk.",
    action: { label: "Contact", href: "/contact" },
  },
];

export function getGuideBeat(progress) {
  return GUIDE_BEATS.find((b) => progress >= b.range[0] && progress < b.range[1]) || GUIDE_BEATS[GUIDE_BEATS.length - 1];
}
