---
title: Delta Lake
tags: [technology, delta-lake, storage, lakehouse]
technologies: [databricks, spark, sql]
projects: [amc-datalake, small-datalake-poc]
skills: [governance, reliability]
topics: [lakehouse storage]
difficulty: [intermediate]
related_documents: [knowledge/technologies/databricks.md, knowledge/technologies/sql.md]
---

# Delta Lake

Overview
- Reliable table storage layer for lakehouse architectures.

Why I use it
- Adds ACID semantics and auditability to analytical storage.

When I choose it
- Need for schema enforcement
- Time travel
- Incremental and governed analytics

When I avoid it
- Unstructured raw landing zones that do not need table semantics yet

Advantages
- ACID
- Schema enforcement
- Time travel

Disadvantages
- Adds operational structure
- Requires disciplined write patterns

Alternatives
- Parquet
- Iceberg
- Warehouse-managed tables

Enterprise considerations
- Governance and lifecycle strategy are necessary.

Scaling considerations
- Partitioning, compaction, and file sizing affect performance.

Common mistakes
- Skipping compaction
- Treating storage like a dump

Best practices
- Curate tables intentionally and version data contracts.

Related technologies
- Spark, Databricks, SQL

