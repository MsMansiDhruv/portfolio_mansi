---
title: Databricks
tags: [technology, databricks, spark, lakehouse]
technologies: [spark, delta-lake, unity-catalog]
projects: [amc-datalake]
skills: [platform engineering, governance]
topics: [databricks, lakehouse]
difficulty: [intermediate]
related_documents: [knowledge/technologies/spark.md, knowledge/technologies/delta-lake.md]
---

# Databricks

Overview
- Unified data and AI platform for lakehouse-style analytics and engineering.

Why I use it
- TODO: Explain your exact decision pattern here.

When I choose it
- Scalable transformations
- Governed lakehouse workflows
- Mixed batch and streaming workloads

When I avoid it
- Simpler workloads that do not need Spark-scale compute

Advantages
- Spark-native scaling
- Delta integration
- Strong governance patterns

Disadvantages
- Cost can rise quickly without discipline
- Notebook sprawl can create maintainability debt

Alternatives
- Snowflake
- BigQuery
- Synapse

Enterprise considerations
- Access control, workspace boundaries, and catalog governance matter.

Scaling considerations
- Cluster strategy, file sizing, and partitioning drive cost and performance.

Common mistakes
- Leaving clusters on
- Using notebooks as the only production artifact

Best practices
- Use jobs for repeatable execution.
- Separate development and production concerns.

Related technologies
- Spark, Delta Lake, Terraform

