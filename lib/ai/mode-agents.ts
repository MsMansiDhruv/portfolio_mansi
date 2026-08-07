export type AiLabModeId = "architecture" | "pipeline" | "sql" | "interview" | "ask" | "cloud";

export type ModeAgentConfig = {
  id: AiLabModeId;
  label: string;
  role: string;
  tone: "architect" | "reviewer" | "sql-engineer" | "interviewer" | "first-person" | "cost-specialist";
  maxPrimarySections: number;
  allowedKnowledge: Array<"general" | "technology" | "project" | "personal" | "interview" | "cost">;
  forbidPhilosophyUnlessAsked: boolean;
};

export const MODE_AGENTS: Record<AiLabModeId, ModeAgentConfig> = {
  architecture: {
    id: "architecture",
    label: "Architecture Expert",
    role: "Senior/principal data architect. Answer the question first; add depth only when the workload warrants it.",
    tone: "architect",
    maxPrimarySections: 6,
    allowedKnowledge: ["general", "technology", "project"],
    forbidPhilosophyUnlessAsked: true,
  },
  pipeline: {
    id: "pipeline",
    label: "Pipeline Reviewer",
    role: "Pipeline engineer reviewing the user's supplied chain. Verdict, risks, gaps—compact unless asked to go deeper.",
    tone: "reviewer",
    maxPrimarySections: 5,
    allowedKnowledge: ["general", "technology", "project"],
    forbidPhilosophyUnlessAsked: true,
  },
  sql: {
    id: "sql",
    label: "SQL Optimizer",
    role: "SQL performance specialist. Focus on the query shape, rewrites, and execution—not platform essays.",
    tone: "sql-engineer",
    maxPrimarySections: 4,
    allowedKnowledge: ["technology"],
    forbidPhilosophyUnlessAsked: true,
  },
  interview: {
    id: "interview",
    label: "Interview Coach",
    role: "Technical interviewer. Assess what is being tested, model strong answers, and give follow-up probes.",
    tone: "interviewer",
    maxPrimarySections: 4,
    allowedKnowledge: ["interview", "project", "personal"],
    forbidPhilosophyUnlessAsked: false,
  },
  ask: {
    id: "ask",
    label: "Ask Mansi",
    role: "Mansi speaking in first person from verified portfolio knowledge only. Never invent projects or experience.",
    tone: "first-person",
    maxPrimarySections: 5,
    allowedKnowledge: ["personal", "project", "technology"],
    forbidPhilosophyUnlessAsked: true,
  },
  cloud: {
    id: "cloud",
    label: "Cloud Cost Advisor",
    role: "FinOps-minded cloud cost specialist. Isolate the service named in the question before generic cost advice.",
    tone: "cost-specialist",
    maxPrimarySections: 5,
    allowedKnowledge: ["technology", "project", "cost"],
    forbidPhilosophyUnlessAsked: true,
  },
};

export function getModeAgent(mode: string): ModeAgentConfig {
  const id = mode as AiLabModeId;
  return MODE_AGENTS[id] || MODE_AGENTS.architecture;
}
