import type { ComposedResponse, KnowledgeHit, RetrievalContext, ResponseSection, KnowledgeSection, Intent } from "./types";

type SectionBlueprint = {
  heading: string;
  hitIndex: number;
  sectionNames: string[];
  kind: "body" | "bullets";
};

function normalize(value = "") {
  return String(value).trim();
}

function findSection(hit: KnowledgeHit, names: string[]): KnowledgeSection | undefined {
  const lookup = new Map(hit.sections.map((section) => [normalize(section.heading).toLowerCase(), section]));
  for (const name of names) {
    const section = lookup.get(normalize(name).toLowerCase());
    if (section) return section;
  }
  return undefined;
}

function flattenSection(section?: KnowledgeSection) {
  if (!section) return [];
  return [...section.paragraphs, ...section.bullets].map((item) => normalize(item)).filter(Boolean);
}

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => normalize(item)).filter(Boolean)));
}

function summarizeHit(hit: KnowledgeHit, intent: Intent, supportHit?: KnowledgeHit) {
  if (intent === "comparison" && supportHit) {
    return `I would compare ${hit.title} with ${supportHit.title} by looking at the operating model, the governance surface, and the downstream reuse path.`;
  }

  if (hit.category === "project") {
    return `One of the largest initiatives I've worked on was ${hit.title}. I would explain it through the business problem, the architecture I chose, and the trade-offs I accepted.`;
  }

  if (hit.category === "technology") {
    return `I use ${hit.title} when the workload and operating model justify it, not just because it is familiar.`;
  }

  if (hit.category === "philosophy") {
    return `My default is to describe the principle first, then show how it changes the system design or the way I lead the team.`;
  }

  if (hit.category === "story") {
    return `I would answer this through the specific incident or decision, then explain what I learned and how I would handle it today.`;
  }

  if (hit.category === "resume") {
    return `I would frame my background through the decisions I made, the teams I worked with, and the business outcomes I was accountable for.`;
  }

  if (hit.category === "interview") {
    return `I would answer this the way I would in an interview: outcome first, then context, then the trade-offs and operational details.`;
  }

  return hit.summary || `I would answer this by grounding it in ${hit.title}.`;
}

function blueprintForHit(hit: KnowledgeHit, intent: Intent, index: number, supportHit?: KnowledgeHit): SectionBlueprint[] {
  if (index > 0 && intent !== "comparison") {
    return [];
  }

  if (intent === "comparison" && supportHit && index === 0) {
    return [
      { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary", "overview"], kind: "body" },
      { heading: `${hit.title} - Why I Use It`, hitIndex: 0, sectionNames: ["why i use it", "why i choose it", "when i choose it"], kind: "bullets" },
      { heading: `${supportHit.title} - Why I Use It`, hitIndex: 1, sectionNames: ["why i use it", "why i choose it", "when i choose it"], kind: "bullets" },
      { heading: "Trade-offs", hitIndex: 0, sectionNames: ["trade-offs", "disadvantages", "risks"], kind: "bullets" },
      { heading: "When I Would Use It", hitIndex: 0, sectionNames: ["when i choose it", "when i use it", "enterprise considerations"], kind: "bullets" },
      { heading: "When I Would Avoid It", hitIndex: 0, sectionNames: ["when i avoid it", "disadvantages", "common mistakes"], kind: "bullets" },
    ];
  }

  switch (hit.category) {
    case "project":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary", "business context"], kind: "body" },
        { heading: "Business Context", hitIndex: 0, sectionNames: ["business context"], kind: "body" },
        { heading: "Problem Statement", hitIndex: 0, sectionNames: ["problem statement"], kind: "body" },
        { heading: "My Responsibilities", hitIndex: 0, sectionNames: ["my responsibilities", "my role"], kind: "bullets" },
        { heading: "Architecture", hitIndex: 0, sectionNames: ["architecture"], kind: "bullets" },
        { heading: "Technologies", hitIndex: 0, sectionNames: ["technologies"], kind: "bullets" },
        { heading: "Engineering Decisions", hitIndex: 0, sectionNames: ["engineering decisions", "decisions i made"], kind: "bullets" },
        { heading: "Alternatives Considered", hitIndex: 0, sectionNames: ["alternatives considered"], kind: "bullets" },
        { heading: "Trade-offs", hitIndex: 0, sectionNames: ["trade-offs"], kind: "bullets" },
        { heading: "Challenges", hitIndex: 0, sectionNames: ["challenges"], kind: "bullets" },
        { heading: "Business Impact", hitIndex: 0, sectionNames: ["business impact", "outcomes"], kind: "bullets" },
        { heading: "Scale", hitIndex: 0, sectionNames: ["scale"], kind: "body" },
        { heading: "Performance", hitIndex: 0, sectionNames: ["performance"], kind: "body" },
        { heading: "Lessons Learned", hitIndex: 0, sectionNames: ["lessons learned"], kind: "bullets" },
        { heading: "What I Would Improve Today", hitIndex: 0, sectionNames: ["what i would improve today"], kind: "bullets" },
        { heading: "Related Technologies", hitIndex: 0, sectionNames: ["related technologies"], kind: "bullets" },
        { heading: "Related Projects", hitIndex: 0, sectionNames: ["related projects"], kind: "bullets" },
      ];
    case "technology":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["overview", "summary"], kind: "body" },
        { heading: "Why I Use It", hitIndex: 0, sectionNames: ["why i use it", "why i choose it"], kind: "bullets" },
        { heading: "When I Choose It", hitIndex: 0, sectionNames: ["when i choose it", "when i use it"], kind: "bullets" },
        { heading: "When I Avoid It", hitIndex: 0, sectionNames: ["when i avoid it"], kind: "bullets" },
        { heading: "Advantages", hitIndex: 0, sectionNames: ["advantages", "pros"], kind: "bullets" },
        { heading: "Disadvantages", hitIndex: 0, sectionNames: ["disadvantages", "cons"], kind: "bullets" },
        { heading: "Alternatives", hitIndex: 0, sectionNames: ["alternatives", "alternatives considered"], kind: "bullets" },
        { heading: "Enterprise Considerations", hitIndex: 0, sectionNames: ["enterprise considerations"], kind: "bullets" },
        { heading: "Scaling Considerations", hitIndex: 0, sectionNames: ["scaling considerations", "scalability"], kind: "bullets" },
        { heading: "Common Mistakes", hitIndex: 0, sectionNames: ["common mistakes", "risks"], kind: "bullets" },
        { heading: "Best Practices", hitIndex: 0, sectionNames: ["best practices", "operational considerations"], kind: "bullets" },
        { heading: "Related Technologies", hitIndex: 0, sectionNames: ["related technologies"], kind: "bullets" },
      ];
    case "philosophy":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary", "overview"], kind: "body" },
        { heading: "How I Design Systems", hitIndex: 0, sectionNames: ["how i design systems", "principles", "architecture"], kind: "bullets" },
        { heading: "How I Mentor Engineers", hitIndex: 0, sectionNames: ["how i mentor engineers", "mentoring", "style", "examples"], kind: "bullets" },
        { heading: "How I Make Architecture Decisions", hitIndex: 0, sectionNames: ["how i make architecture decisions", "trade-offs", "decision making"], kind: "bullets" },
        { heading: "How I Balance Delivery With Quality", hitIndex: 0, sectionNames: ["how i balance delivery with quality", "delivery", "lessons learned"], kind: "bullets" },
        { heading: "How I Think About Scalability", hitIndex: 0, sectionNames: ["how i think about scalability", "scalability"], kind: "bullets" },
        { heading: "How I Think About Observability", hitIndex: 0, sectionNames: ["how i think about observability", "monitoring", "observability"], kind: "bullets" },
        { heading: "How I Approach Automation", hitIndex: 0, sectionNames: ["how i approach automation", "automation"], kind: "bullets" },
        { heading: "How I Approach Governance", hitIndex: 0, sectionNames: ["how i approach governance", "governance", "security"], kind: "bullets" },
      ];
    case "story":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary", "overview"], kind: "body" },
        { heading: "What Happened", hitIndex: 0, sectionNames: ["what happened", "incident", "challenge", "failure", "optimization"], kind: "bullets" },
        { heading: "Why It Mattered", hitIndex: 0, sectionNames: ["business impact", "impact"], kind: "body" },
        { heading: "What I Did", hitIndex: 0, sectionNames: ["what i did", "actions", "response", "decision"], kind: "bullets" },
        { heading: "What I Learned", hitIndex: 0, sectionNames: ["what i learned", "lessons learned", "lesson"], kind: "bullets" },
        { heading: "What I Would Do Differently Today", hitIndex: 0, sectionNames: ["what i would do differently today", "what i would improve today"], kind: "bullets" },
      ];
    case "interview":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary"], kind: "body" },
        { heading: "How I Would Answer", hitIndex: 0, sectionNames: ["guidance", "rubric"], kind: "bullets" },
        { heading: "Trade-offs", hitIndex: 0, sectionNames: ["improvements", "trade-offs"], kind: "bullets" },
        { heading: "Related Experience", hitIndex: 0, sectionNames: ["related projects", "related experience", "examples"], kind: "bullets" },
      ];
    case "resume":
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary"], kind: "body" },
        { heading: "Career Timeline", hitIndex: 0, sectionNames: ["career timeline"], kind: "bullets" },
        { heading: "Responsibilities", hitIndex: 0, sectionNames: ["responsibilities"], kind: "bullets" },
        { heading: "Achievements", hitIndex: 0, sectionNames: ["achievements"], kind: "bullets" },
        { heading: "Leadership", hitIndex: 0, sectionNames: ["leadership"], kind: "bullets" },
        { heading: "Technologies", hitIndex: 0, sectionNames: ["technologies"], kind: "bullets" },
        { heading: "Business Impact", hitIndex: 0, sectionNames: ["business impact"], kind: "bullets" },
      ];
    default:
      return [
        { heading: "Executive Summary", hitIndex: 0, sectionNames: ["summary", "overview"], kind: "body" },
        { heading: "Technical Explanation", hitIndex: 0, sectionNames: ["architecture", "principles", "why i use it"], kind: "bullets" },
        { heading: "Related Experience", hitIndex: 0, sectionNames: ["related projects", "related technologies"], kind: "bullets" },
      ];
  }
}

function buildSections(context: RetrievalContext): ResponseSection[] {
  const { hits, intent } = context;
  const sections: ResponseSection[] = [];
  const primary = hits[0];
  const supportHit = hits[1];

  if (!primary) {
    return [
      {
        heading: "Executive Summary",
        body: "I do not have enough grounded knowledge for that yet, so I would rather add the missing document than fake an answer.",
      },
    ];
  }

  const blueprints = blueprintForHit(primary, intent, 0, supportHit);
  if (intent === "comparison" && supportHit) {
    for (const blueprint of blueprints) {
      const targetHit = blueprint.hitIndex === 0 ? primary : supportHit;
      const matchedSection = findSection(targetHit, blueprint.sectionNames);
      if (!matchedSection) continue;
      const values = blueprint.kind === "bullets" ? unique(flattenSection(matchedSection)) : unique(flattenSection(matchedSection));
      if (!values.length) continue;
      sections.push(blueprint.kind === "bullets" ? { heading: blueprint.heading, bullets: values } : { heading: blueprint.heading, body: values.join(" ") });
    }
    return sections;
  }

  for (const blueprint of blueprints) {
    const targetHit = hits[blueprint.hitIndex] || primary;
    const matchedSection = findSection(targetHit, blueprint.sectionNames);
    if (!matchedSection) continue;
    const values = unique(flattenSection(matchedSection));
    if (!values.length) continue;
    if (blueprint.kind === "bullets") {
      sections.push({ heading: blueprint.heading, bullets: values });
    } else {
      sections.push({ heading: blueprint.heading, body: values.join(" ") });
    }
  }

  const relatedHits = hits.slice(1, 5);
  if (relatedHits.length) {
    sections.push({
      heading: "Related Experience",
      bullets: unique(
        relatedHits.flatMap((hit) => [hit.title, ...hit.tags.slice(0, 2), ...hit.technologies.slice(0, 2)]).filter(Boolean)
      ),
    });
  }

  return sections;
}

function followUpsFor(context: RetrievalContext): string[] {
  const { hits, intent } = context;
  const primary = hits[0];
  const secondary = hits[1];
  const followUps = new Set<string>();

  if (intent === "comparison" && primary && secondary) {
    followUps.add(`Compare ${primary.title} with ${secondary.title} on cost and operating model`);
    followUps.add(`Show me when I would avoid ${primary.title}`);
    followUps.add(`Explain the trade-offs between the two options`);
  } else if (primary) {
    followUps.add(`Go deeper on ${primary.title}`);
    followUps.add(`Show the related project context`);
    followUps.add(`Explain the trade-offs I would call out`);
  }

  for (const hit of hits.slice(0, 4)) {
    if (followUps.size >= 6) break;
    if (hit.category === "project") followUps.add(`Explain the business impact of ${hit.title}`);
    if (hit.category === "technology") followUps.add(`Explain when I would choose ${hit.title}`);
    if (hit.category === "philosophy") followUps.add(`Show how this changes my architecture decisions`);
    if (hit.category === "story") followUps.add(`Turn this into a story I would tell in an interview`);
    if (hit.category === "resume") followUps.add(`Walk through the part of my timeline tied to ${hit.title}`);
  }

  while (followUps.size < 4) {
    followUps.add("Show a real-world example");
    followUps.add("Explain the trade-offs");
    followUps.add("Call out the operational considerations");
  }

  return Array.from(followUps).slice(0, 6);
}

export function composeResponse(context: RetrievalContext): ComposedResponse {
  const primary = context.hits[0];
  if (!primary) {
    return {
      title: "Knowledge response",
      summary: "I do not have enough grounded knowledge for that yet, so I would rather add the missing document than fake an answer.",
      sections: [
        {
          heading: "Executive Summary",
          body: "I do not have enough grounded knowledge for that yet, so I would rather add the missing document than fake an answer.",
        },
      ],
      followUps: [
        "Add the missing knowledge document",
        "Clarify the business problem",
        "Provide the relevant project or technology context",
        "Add related architecture or decision context",
      ],
      citations: [],
      persona: "first-person",
      intent: context.intent,
      sourceCount: 0,
    };
  }

  const summary = summarizeHit(primary, context.intent, context.hits[1]);
  return {
    title: primary.title,
    summary,
    sections: buildSections(context),
    followUps: followUpsFor(context),
    citations: context.hits.map((hit) => hit.id),
    persona: "first-person",
    intent: context.intent,
    sourceCount: context.hits.length,
  };
}

