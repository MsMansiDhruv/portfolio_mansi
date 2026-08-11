import { architectureKnowledge } from "./architecture";
import { airflowKnowledge } from "./airflow";
import { awsKnowledge } from "./aws";
import { cloudKnowledge } from "./cloud";
import { databricksKnowledge } from "./databricks";
import { dynamodbKnowledge } from "./dynamodb";
import { experienceKnowledge } from "./experience";
import { glueKnowledge } from "./glue";
import { interviewKnowledge } from "./interview";
import { kafkaKnowledge } from "./kafka";
import { lambdaKnowledge } from "./lambda";
import { leadershipKnowledge } from "./leadership";
import { mlflowKnowledge } from "./mlflow";
import { philosophyKnowledge } from "./philosophy";
import { powerBiKnowledge } from "./powerbi";
import { projectKnowledge } from "./projects";
import { redshiftKnowledge } from "./redshift";
import { resumeKnowledge } from "./resume";
import { snowflakeKnowledge } from "./snowflake";
import { sparkKnowledge } from "./spark";
import { storyKnowledge } from "./stories";
import { sqlKnowledge } from "./sql";
import { terraformKnowledge } from "./terraform";

export const knowledgeCatalog = [
  ...projectKnowledge,
  ...experienceKnowledge,
  ...storyKnowledge,
  philosophyKnowledge,
  awsKnowledge,
  redshiftKnowledge,
  dynamodbKnowledge,
  glueKnowledge,
  lambdaKnowledge,
  mlflowKnowledge,
  kafkaKnowledge,
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
