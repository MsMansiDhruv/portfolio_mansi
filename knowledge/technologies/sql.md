---
title: SQL
tags: [technology, sql, analytics]
technologies: [spark, powerbi, snowflake]
projects: [amc-datalake]
skills: [analysis, optimization]
topics: [sql]
difficulty: [intermediate]
related_documents: [knowledge/technologies/powerbi.md, knowledge/technologies/spark.md]
---

# SQL

Overview
- Declarative language for querying and shaping relational and analytical data.

Why I use it
- It is the most portable and readable language for analytics work.

When I choose it
- Reporting
- Data validation
- Analytical transformations

When I avoid it
- When the problem needs non-tabular compute or orchestration

Advantages
- Readable
- Portable
- Optimizable

Disadvantages
- Can become expensive when written poorly

Alternatives
- Spark DataFrames
- BI semantic layers

Enterprise considerations
- Governance, naming, and model design matter.

Scaling considerations
- Filter early and reduce scan volume.

Common mistakes
- SELECT *
- Non-sargable filters

Best practices
- Keep transformations readable and measurable.

Related technologies
- Spark, Power BI, Snowflake

