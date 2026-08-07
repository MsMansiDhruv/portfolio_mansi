---
title: AMC - Datalake Solution
tags: [project, datalake, amc, databricks, aws, sql]
technologies: [s3, iceberg, pyspark, aws, terraform, redshift]
projects: [gpu-benchmark, small-datalake-poc]
skills: [architecture, automation, governance]
topics: [lakehouse, analytics, enterprise]
difficulty: [advanced]
related_documents: [knowledge/technologies/databricks.md, knowledge/technologies/delta-lake.md, knowledge/stories/optimization-wins.md]
---

# AMC - Datalake Solution

Business Context
- Built a reusable, cost-efficient cloud-native analytics foundation for an asset management client.

Problem Statement
- Multiple on-prem sources needed to be unified with better reliability, lower cost, and faster analytics access.

My Responsibilities
- Led end-to-end architecture design.
- Built incremental ingestion and validation patterns.
- Designed CI/CD and infrastructure automation.

Architecture
- TODO: Add the full layer-by-layer architecture diagram and flow.

Technologies
- S3, Iceberg, PySpark, AWS, Terraform, Redshift

Engineering Decisions
- Chose incremental processing over repeated full reloads.
- Chose columnar open-table storage to reduce cost and improve reuse.

Alternatives Considered
- Legacy warehouse-heavy approach
- Full reload batch processing

Trade-offs
- More engineering discipline was required, but the platform became easier to trust and scale.

Challenges
- Coordinating source migration, network setup, validation, and downstream consumers.

Business Impact
- Unified customer, transaction, and portfolio data into a single source of truth.

Scale
- TODO: Add row counts, throughput, and source count.

Performance
- Sub-10 second BI queries on large transactional datasets were achieved for the intended surfaces.

Lessons Learned
- Platform decisions matter most when they reduce future onboarding and support cost.

What I Would Improve Today
- Add explicit data quality SLAs and richer lineage automation.

Related Technologies
- Databricks, Delta Lake, SQL, Terraform

Related Projects
- GPU Benchmark Pod, Small Data Lake (PoC)

