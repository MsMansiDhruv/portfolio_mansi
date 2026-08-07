import type { ReasoningContext, ReasoningStrategy, SectionTemplate, ReasoningIntent } from "./reasoning-types";
import type { QuestionType } from "./input-analyzer";

function architectureSections(): SectionTemplate[] {
  return [
    { heading: "Architecture Overview", kind: "body", from: "primary", sourceSections: ["architecture", "overview", "summary"] },
    { heading: "Strengths", kind: "bullets", from: "any", sourceSections: ["strengths", "advantages", "best practices", "engineering decisions"] },
    { heading: "Potential Bottlenecks", kind: "bullets", from: "any", sourceSections: ["challenges", "performance", "limitations", "risks"] },
    { heading: "Reliability Risks", kind: "bullets", from: "any", sourceSections: ["risks", "failure modes", "lessons learned", "incident"] },
    { heading: "Scalability Analysis", kind: "bullets", from: "any", sourceSections: ["scaling considerations", "scale", "scalability"] },
    { heading: "Cost Considerations", kind: "bullets", from: "any", sourceSections: ["cost", "business impact", "operational considerations"] },
    { heading: "Missing Components", kind: "bullets", from: "any", sourceSections: ["gaps", "missing", "operational considerations"] },
    { heading: "Operational Concerns", kind: "bullets", from: "any", sourceSections: ["operational considerations", "governance", "observability"] },
    { heading: "Monitoring", kind: "bullets", from: "any", sourceSections: ["observability", "monitoring"] },
    { heading: "Governance", kind: "bullets", from: "any", sourceSections: ["governance", "security"] },
    { heading: "Security", kind: "bullets", from: "any", sourceSections: ["security", "governance"] },
    { heading: "Suggested Improvements", kind: "bullets", from: "any", sourceSections: ["trade-offs", "recommendations", "what i would improve today", "improvements"] },
    { heading: "Improved Architecture", kind: "body", from: "any", sourceSections: ["architecture", "recommendations", "what i would improve today"] },
    { heading: "Questions I'd Ask", kind: "bullets", from: "any", sourceSections: ["questions", "clarifications"], optional: true },
  ];
}

function technologySections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["overview", "summary"] },
    { heading: "Why I Choose It", kind: "bullets", from: "primary", sourceSections: ["why i use it", "why i choose it", "advantages"] },
    { heading: "When I Choose It", kind: "bullets", from: "primary", sourceSections: ["when i choose it", "when i use it", "enterprise considerations"] },
    { heading: "When I Avoid It", kind: "bullets", from: "primary", sourceSections: ["when i avoid it", "disadvantages", "common mistakes"] },
    { heading: "Alternatives", kind: "bullets", from: "supporting", sourceSections: ["alternatives", "alternatives considered"] },
    { heading: "Trade-offs", kind: "bullets", from: "any", sourceSections: ["trade-offs", "pros", "cons"] },
    { heading: "Real Project Example", kind: "bullets", from: "supporting", sourceSections: ["related projects", "business impact", "architecture"] },
    { heading: "Enterprise Considerations", kind: "bullets", from: "primary", sourceSections: ["enterprise considerations", "operational considerations"] },
    { heading: "Lessons Learned", kind: "bullets", from: "any", sourceSections: ["lessons learned", "what i would improve today"] },
    { heading: "Related Technologies", kind: "bullets", from: "supporting", sourceSections: ["related technologies"] },
  ];
}

function comparisonSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["overview", "summary"] },
    { heading: "Comparison", kind: "bullets", from: "any", sourceSections: ["why i use it", "why i choose it", "when i choose it", "alternatives"] },
    { heading: "Strengths", kind: "bullets", from: "any", sourceSections: ["advantages", "pros"] },
    { heading: "Weaknesses", kind: "bullets", from: "any", sourceSections: ["disadvantages", "cons", "common mistakes"] },
    { heading: "Trade-offs", kind: "bullets", from: "any", sourceSections: ["trade-offs", "alternatives"] },
    { heading: "When I Would Use It", kind: "bullets", from: "any", sourceSections: ["when i choose it", "when i use it", "enterprise considerations"] },
    { heading: "When I Would Avoid It", kind: "bullets", from: "any", sourceSections: ["when i avoid it", "disadvantages"] },
    { heading: "Recommended Use Cases", kind: "bullets", from: "supporting", sourceSections: ["related projects", "business impact"] },
    { heading: "Related Experience", kind: "bullets", from: "supporting", sourceSections: ["related technologies", "related projects"] },
  ];
}

function projectSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "business context"] },
    { heading: "Business Context", kind: "body", from: "primary", sourceSections: ["business context"] },
    { heading: "Problem Statement", kind: "body", from: "primary", sourceSections: ["problem statement"] },
    { heading: "My Responsibilities", kind: "bullets", from: "primary", sourceSections: ["my responsibilities", "my role"] },
    { heading: "Architecture", kind: "bullets", from: "primary", sourceSections: ["architecture"] },
    { heading: "Technologies", kind: "bullets", from: "primary", sourceSections: ["technologies"] },
    { heading: "Engineering Decisions", kind: "bullets", from: "primary", sourceSections: ["engineering decisions", "decisions i made"] },
    { heading: "Alternatives Considered", kind: "bullets", from: "primary", sourceSections: ["alternatives considered"] },
    { heading: "Trade-offs", kind: "bullets", from: "primary", sourceSections: ["trade-offs"] },
    { heading: "Challenges", kind: "bullets", from: "primary", sourceSections: ["challenges"] },
    { heading: "Business Impact", kind: "bullets", from: "primary", sourceSections: ["business impact", "outcomes"] },
    { heading: "Scale", kind: "body", from: "primary", sourceSections: ["scale"] },
    { heading: "Performance", kind: "body", from: "primary", sourceSections: ["performance"] },
    { heading: "Lessons Learned", kind: "bullets", from: "primary", sourceSections: ["lessons learned"] },
    { heading: "What I Would Improve Today", kind: "bullets", from: "primary", sourceSections: ["what i would improve today"] },
    { heading: "Related Technologies", kind: "bullets", from: "supporting", sourceSections: ["related technologies"] },
    { heading: "Related Projects", kind: "bullets", from: "supporting", sourceSections: ["related projects"] },
  ];
}

function leadershipSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "Decision Making", kind: "bullets", from: "primary", sourceSections: ["how i make architecture decisions", "decision making", "trade-offs"] },
    { heading: "Stakeholder Communication", kind: "bullets", from: "primary", sourceSections: ["communication", "stakeholders", "leadership"] },
    { heading: "Conflict Resolution", kind: "bullets", from: "supporting", sourceSections: ["conflict", "lessons learned", "stories"] },
    { heading: "Mentoring", kind: "bullets", from: "primary", sourceSections: ["how i mentor engineers", "mentoring", "style"] },
    { heading: "Business Impact", kind: "bullets", from: "supporting", sourceSections: ["business impact", "outcomes"] },
    { heading: "Lessons Learned", kind: "bullets", from: "supporting", sourceSections: ["lessons learned"] },
  ];
}

function interviewSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "How I Would Answer", kind: "bullets", from: "primary", sourceSections: ["guidance", "rubric"] },
    { heading: "What I’d Emphasize", kind: "bullets", from: "supporting", sourceSections: ["related experience", "examples", "improvements"] },
    { heading: "Follow-up Probes", kind: "bullets", from: "any", sourceSections: ["questions", "guidance"] },
    { heading: "Depth Increases", kind: "bullets", from: "any", sourceSections: ["improvements", "trade-offs"] },
  ];
}

function philosophySections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "How I Design Systems", kind: "bullets", from: "primary", sourceSections: ["how i design systems", "principles", "architecture"] },
    { heading: "How I Mentor Engineers", kind: "bullets", from: "primary", sourceSections: ["how i mentor engineers", "mentoring"] },
    { heading: "How I Make Architecture Decisions", kind: "bullets", from: "primary", sourceSections: ["how i make architecture decisions", "decision making", "trade-offs"] },
    { heading: "How I Balance Delivery With Quality", kind: "bullets", from: "primary", sourceSections: ["how i balance delivery with quality", "delivery", "lessons learned"] },
    { heading: "How I Think About Scalability", kind: "bullets", from: "primary", sourceSections: ["how i think about scalability", "scalability"] },
    { heading: "How I Think About Observability", kind: "bullets", from: "primary", sourceSections: ["how i think about observability", "observability", "monitoring"] },
    { heading: "How I Approach Automation", kind: "bullets", from: "primary", sourceSections: ["how i approach automation", "automation"] },
    { heading: "How I Approach Governance", kind: "bullets", from: "primary", sourceSections: ["how i approach governance", "governance", "security"] },
  ];
}

function debuggingSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "what happened"] },
    { heading: "Likely Failure Points", kind: "bullets", from: "any", sourceSections: ["incident", "challenges", "risks", "lessons learned"] },
    { heading: "Debugging Approach", kind: "bullets", from: "any", sourceSections: ["what i did", "actions", "response"] },
    { heading: "Root Cause", kind: "bullets", from: "any", sourceSections: ["root cause", "what happened"] },
    { heading: "Fixes", kind: "bullets", from: "any", sourceSections: ["what i did", "recommendations"] },
    { heading: "Prevention", kind: "bullets", from: "any", sourceSections: ["lessons learned", "observability", "monitoring"] },
  ];
}

function performanceSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "performance"] },
    { heading: "Bottlenecks", kind: "bullets", from: "any", sourceSections: ["performance", "challenges", "risks"] },
    { heading: "Optimization Levers", kind: "bullets", from: "any", sourceSections: ["engineering decisions", "trade-offs", "recommendations"] },
    { heading: "Expected Impact", kind: "bullets", from: "any", sourceSections: ["business impact", "outcomes", "performance"] },
    { heading: "Operational Considerations", kind: "bullets", from: "any", sourceSections: ["operational considerations", "monitoring"] },
  ];
}

function cloudCostSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "business impact"] },
    { heading: "Major Cost Drivers", kind: "bullets", from: "any", sourceSections: ["cost", "business impact", "performance"] },
    { heading: "Idle Compute", kind: "bullets", from: "any", sourceSections: ["operational considerations", "scale"] },
    { heading: "Storage", kind: "bullets", from: "any", sourceSections: ["architecture", "scale", "cost"] },
    { heading: "Networking", kind: "bullets", from: "any", sourceSections: ["architecture", "operational considerations"] },
    { heading: "Optimization Ideas", kind: "bullets", from: "any", sourceSections: ["trade-offs", "recommendations", "best practices"] },
    { heading: "Expected Savings", kind: "bullets", from: "any", sourceSections: ["business impact", "outcomes"] },
  ];
}

function sqlSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "Query Shape", kind: "bullets", from: "primary", sourceSections: ["guidance", "rubric"] },
    { heading: "Performance", kind: "bullets", from: "any", sourceSections: ["performance", "execution plan", "optimizations"] },
    { heading: "Trade-offs", kind: "bullets", from: "any", sourceSections: ["trade-offs", "alternatives"] },
    { heading: "Best Practices", kind: "bullets", from: "any", sourceSections: ["best practices", "common mistakes"] },
    { heading: "Related Experience", kind: "bullets", from: "supporting", sourceSections: ["related projects", "related technologies"] },
  ];
}

function bestPracticeSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "Principles", kind: "bullets", from: "primary", sourceSections: ["best practices", "principles", "guidelines"] },
    { heading: "Trade-offs", kind: "bullets", from: "any", sourceSections: ["trade-offs", "alternatives"] },
    { heading: "When I Use This", kind: "bullets", from: "any", sourceSections: ["when i choose it", "when i use it"] },
    { heading: "When I Avoid This", kind: "bullets", from: "any", sourceSections: ["when i avoid it", "common mistakes"] },
  ];
}

function scenarioSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "guidance"] },
    { heading: "How I Would Think About It", kind: "bullets", from: "primary", sourceSections: ["guidance", "rubric", "decision making"] },
    { heading: "Trade-offs", kind: "bullets", from: "any", sourceSections: ["trade-offs", "alternatives"] },
    { heading: "Questions I’d Ask", kind: "bullets", from: "any", sourceSections: ["questions", "clarifications"] },
  ];
}

function resumeSections(): SectionTemplate[] {
  return [
    { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
    { heading: "Career Timeline", kind: "bullets", from: "primary", sourceSections: ["career timeline"] },
    { heading: "Responsibilities", kind: "bullets", from: "primary", sourceSections: ["responsibilities"] },
    { heading: "Achievements", kind: "bullets", from: "primary", sourceSections: ["achievements"] },
    { heading: "Leadership", kind: "bullets", from: "primary", sourceSections: ["leadership"] },
    { heading: "Technologies", kind: "bullets", from: "primary", sourceSections: ["technologies"] },
    { heading: "Business Impact", kind: "bullets", from: "primary", sourceSections: ["business impact"] },
  ];
}

export function routeStrategy(context: ReasoningContext): ReasoningStrategy {
  const intent = context.intent.primary;
  const questionType = context.questionType;

  if (questionType === "ARCHITECTURE_PLACEMENT" || questionType === "COMPONENT_PLACEMENT") {
    return {
      id: "architecture-placement",
      title: "Architecture Placement",
      primaryIntent: "technology-explanation",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: false,
    };
  }

  if (questionType === "INGESTION_RECOMMENDATION") {
    return {
      id: "ingestion-recommendation",
      title: "Ingestion Recommendation",
      primaryIntent: "system-design",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: true,
    };
  }

  if (questionType === "ARCHITECTURE_DESIGN" || intent === "system-design") {
    return {
      id: "system-design",
      title: "Architecture Design",
      primaryIntent: "system-design",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: true,
    };
  }

  if (questionType === "ARCHITECTURE_REVIEW" || intent === "architecture-review" || intent === "pipeline-review") {
    return {
      id: "architecture-review",
      title: "Architecture Review",
      primaryIntent: "architecture-review",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: true,
    };
  }

  if (questionType === "EXPLANATION" || intent === "technology-explanation") {
    return {
      id: "technology-explanation",
      title: "Technology Explanation",
      primaryIntent: "technology-explanation",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: true,
    };
  }

  if (questionType === "COMPARISON" || intent === "technology-comparison") {
    return {
      id: "technology-comparison",
      title: "Technology Comparison",
      primaryIntent: "technology-comparison",
      sectionTemplates: [],
      followUpHints: [],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "project-discussion" || questionType === "PROJECT_QUESTION") {
    return {
      id: "project-discussion",
      title: "Project Discussion",
      primaryIntent: "project-discussion",
      sectionTemplates: projectSections(),
      followUpHints: [
        "Would you like me to go deeper on the architecture?",
        "Should I explain the business impact in more detail?",
        "Do you want the trade-offs and lessons learned next?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "leadership" || intent === "mentoring") {
    return {
      id: "leadership",
      title: "Leadership",
      primaryIntent: intent,
      sectionTemplates: leadershipSections(),
      followUpHints: [
        "Would you like me to turn this into a mentoring example?",
        "Should I explain how I handled stakeholder alignment?",
        "Do you want the decision-making framework I used?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "interview-preparation" || intent === "behavioral-interview") {
    return {
      id: "interview-preparation",
      title: "Interview Preparation",
      primaryIntent: intent,
      sectionTemplates: interviewSections(),
      followUpHints: [
        "Would you like a harder follow-up question?",
        "Should I answer this in STAR format?",
        "Do you want me to increase the depth of the technical probe?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "career-question" || intent === "resume-question") {
    return {
      id: "career",
      title: "Career",
      primaryIntent: intent,
      sectionTemplates: resumeSections(),
      followUpHints: [
        "Would you like the timeline broken down by role?",
        "Should I connect this to leadership examples?",
        "Do you want the most relevant project stories next?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "cloud-cost-review") {
    return {
      id: "cloud-cost-review",
      title: "Cloud Cost Review",
      primaryIntent: intent,
      sectionTemplates: cloudCostSections(),
      followUpHints: [
        "Would you like me to estimate the biggest savings levers?",
        "Should I separate compute, storage, and network costs?",
        "Do you want a cheaper target architecture next?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "sql-review") {
    return {
      id: "sql-review",
      title: "SQL Review",
      primaryIntent: intent,
      sectionTemplates: sqlSections(),
      followUpHints: [
        "Would you like me to rewrite the query?",
        "Should I estimate the execution bottlenecks?",
        "Do you want indexing or partitioning advice next?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "debugging") {
    return {
      id: "debugging",
      title: "Debugging",
      primaryIntent: intent,
      sectionTemplates: debuggingSections(),
      followUpHints: [
        "Would you like the investigation plan broken down step by step?",
        "Should I identify the highest-risk failure point first?",
        "Do you want the prevention checklist next?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "performance-optimization") {
    return {
      id: "performance-optimization",
      title: "Performance Optimization",
      primaryIntent: intent,
      sectionTemplates: performanceSections(),
      followUpHints: [
        "Would you like me to isolate the bottleneck by stage?",
        "Should I estimate the business impact of the optimization?",
        "Do you want me to compare the cheaper scaling path?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "engineering-philosophy" || intent === "best-practices" || intent === "decision-making") {
    return {
      id: "engineering-philosophy",
      title: "Engineering Philosophy",
      primaryIntent: intent,
      sectionTemplates: philosophySections(),
      followUpHints: [
        "Would you like me to turn this into a decision framework?",
        "Should I show how I apply this in a real project?",
        "Do you want the mentoring version of this answer?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  if (intent === "scenario-analysis") {
    return {
      id: "scenario-analysis",
      title: "Scenario Analysis",
      primaryIntent: intent,
      sectionTemplates: scenarioSections(),
      followUpHints: [
        "Would you like me to make the scenario harder?",
        "Should I answer this as if I were on the interview panel?",
        "Do you want a production-style failure mode added?",
      ],
      clarifyWhenLowConfidence: true,
    };
  }

  return {
    id: "default",
    title: "Reasoned Answer",
    primaryIntent: intent,
    sectionTemplates: [
      { heading: "Executive Summary", kind: "body", from: "primary", sourceSections: ["summary", "overview"] },
      { heading: "Technical Explanation", kind: "bullets", from: "any", sourceSections: ["architecture", "principles", "guidance"] },
      { heading: "Related Experience", kind: "bullets", from: "supporting", sourceSections: ["related projects", "related technologies"] },
    ],
    followUpHints: [
      "Would you like me to go deeper on the architecture?",
      "Should I compare it with the closest alternative?",
      "Do you want a project-based example next?",
    ],
    clarifyWhenLowConfidence: true,
  };
}
