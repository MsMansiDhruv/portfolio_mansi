import { architectureKnowledge } from "./architecture";
import { airflowKnowledge } from "./airflow";
import { cloudKnowledge } from "./cloud";
import { databricksKnowledge } from "./databricks";
import { interviewKnowledge } from "./interview";
import { leadershipKnowledge } from "./leadership";
import { powerBiKnowledge } from "./powerbi";
import { projectKnowledge } from "./projects";
import { resumeKnowledge } from "./resume";
import { snowflakeKnowledge } from "./snowflake";
import { sparkKnowledge } from "./spark";
import { sqlKnowledge } from "./sql";
import { terraformKnowledge } from "./terraform";

export const knowledgeCatalog = [
  ...projectKnowledge,
  databricksKnowledge,
  sparkKnowledge,
  sqlKnowledge,
  snowflakeKnowledge,
  terraformKnowledge,
  airflowKnowledge,
  cloudKnowledge,
  leadershipKnowledge,
  interviewKnowledge,
  powerBiKnowledge,
  architectureKnowledge,
  resumeKnowledge,
];

export const knowledgeById = Object.fromEntries(knowledgeCatalog.map((document) => [document.id, document]));

