import type { ComposedResponse } from "../types";
import type { GeneratedSection } from "./section-generator";
import { containsBlockedPhrase, generateSection } from "./section-generator";
import type { PlannedSection, ReasoningContext } from "./reasoning-types";

function normalize(value = "") {
  return String(value).trim().toLowerCase();
}

function sectionFingerprint(section: GeneratedSection) {
  const parts = [section.body || "", ...(section.bullets || [])].join(" ").toLowerCase();
  return parts.replace(/\s+/g, " ").trim();
}

function jaccardSimilarity(a: string, b: string) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  let inter = 0;
  for (const t of setA) if (setB.has(t)) inter++;
  const union = setA.size + setB.size - inter;
  return union ? inter / union : 0;
}

function sanitizeSection(section: GeneratedSection): GeneratedSection {
  const filterBullet = (b: string) => !containsBlockedPhrase(b);
  if (section.body && containsBlockedPhrase(section.body)) {
    return { ...section, body: undefined };
  }
  if (section.bullets) {
    return { ...section, bullets: section.bullets.filter(filterBullet) };
  }
  return section;
}

import type { UsageTracker } from "./usage-tracker";

export function validateAndRepairSections(
  sections: GeneratedSection[],
  context: ReasoningContext,
  plans: PlannedSection[],
  tracker?: UsageTracker
): ComposedResponse["sections"] {
  const output: ComposedResponse["sections"] = [];
  const fingerprints: string[] = [];

  for (let i = 0; i < sections.length; i++) {
    let section = sanitizeSection(sections[i]);
    const plan = plans[i];
    let fp = sectionFingerprint(section);

    for (const prev of fingerprints) {
      if (jaccardSimilarity(fp, prev) > 0.72) {
        const regenerated = plan ? sanitizeSection(generateSection(plan, context, tracker) || section) : section;
        section = regenerated;
        fp = sectionFingerprint(section);
      }
    }

    if (!section.body && (!section.bullets || !section.bullets.length)) continue;

    fingerprints.push(fp);
    output.push({
      heading: section.heading,
      body: section.body,
      bullets: section.bullets,
      tier: plan?.tier,
    });
  }

  return output;
}

export function sectionsAreDistinct(sections: ComposedResponse["sections"]) {
  const fps = sections.map((s) => sectionFingerprint({ heading: s.heading || "", body: s.body, bullets: s.bullets }));
  for (let i = 0; i < fps.length; i++) {
    for (let j = i + 1; j < fps.length; j++) {
      if (jaccardSimilarity(fps[i], fps[j]) > 0.65) return false;
    }
  }
  return true;
}
