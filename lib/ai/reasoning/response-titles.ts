import type { ReasoningContext } from "./reasoning-types";

function isIot(context: ReasoningContext) {
  return context.analysis.domain === "IoT" || /\biot\b/i.test(context.question);
}

export function responseTitle(context: ReasoningContext) {
  switch (context.questionType) {
    case "ARCHITECTURE_DESIGN":
      return isIot(context) ? "IoT streaming architecture" : "Architecture design";
    case "ARCHITECTURE_PLACEMENT": {
      const subject = context.analysis.subject || "Technology";
      return `${subject} in the reference architecture`;
    }
    case "COMPONENT_PLACEMENT": {
      return `${context.analysis.subject || "Component"} in the pipeline`;
    }
    case "ARCHITECTURE_REVIEW":
      return "Architecture review";
    case "EXPLANATION":
      return context.entities.technologies[0]?.label || context.analysis.technologies[0] || "Technology explanation";
    case "COMPARISON":
      return "Technology comparison";
    case "PROJECT_QUESTION": {
      const q = context.question;
      if (/\bamc\b/i.test(q) || /\bdatalake\b/i.test(q)) {
        const amc = context.documents.find((d) => d.category === "project" && /\bamc\b/i.test(d.title));
        if (amc) return amc.title;
        return "Legacy Data Modernization & ETL";
      }
      return context.documents.find((d) => d.category === "project")?.title || "Project overview";
    }
    case "COST_ANALYSIS":
      return "Cloud cost review";
    case "SQL_OPTIMIZATION":
      return "SQL optimization";
    case "OPTIMIZATION":
      return "Performance optimization";
    case "INTERVIEW":
      return "Interview coaching";
    case "PERSONAL_EXPERIENCE":
      if (/\b(difficult|hard|challenging|tough)\b/i.test(context.question) && /\bdecision\b/i.test(context.question)) {
        return "A difficult engineering decision";
      }
      if (/\b(learned|lesson)\b/i.test(context.question)) return "Lessons from production";
      return "Personal experience";
    case "PORTFOLIO_OVERVIEW":
      return context.mode === "ask" ? "Projects I've worked on" : "Portfolio projects";
    case "TECHNOLOGIES_OVERVIEW":
      return context.mode === "ask" ? "Technologies I've worked with" : "Technology overview";
    default:
      if (context.mode === "ask") {
        if (context.questionType === "PERSONAL_EXPERIENCE" || context.questionType === "CAREER") {
          return "Personal experience";
        }
        return "Personal experience";
      }
      return "Response";
  }
}
