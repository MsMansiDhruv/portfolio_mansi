---
title: Spark
tags: [technology, spark, pyspark, distributed-compute]
technologies: [databricks, sql]
projects: [amc-datalake, gpu-benchmark, small-datalake-poc]
skills: [performance, scaling]
topics: [spark, distributed systems]
difficulty: [intermediate]
related_documents: [knowledge/technologies/databricks.md, knowledge/technologies/sql.md]
---

# Spark

Overview
- Distributed compute engine for large-scale batch, streaming, and analytical workloads.

Why I use it
- It scales transformation work that is too large for a single machine.

When I choose it
- Large data volumes
- Complex transforms
- Batch and streaming pipelines

When I avoid it
- Small workloads where overhead outweighs benefits

Advantages
- Parallelism
- Flexible APIs
- Broad ecosystem

Disadvantages
- Shuffle-heavy jobs can become expensive
- Tuning requires discipline

Alternatives
- SQL warehouse engines
- Serverless ETL systems

Enterprise considerations
- Governance, observability, and cost controls are essential.

Scaling considerations
- Partitioning, skew, caching, and file size affect runtime behavior.

Common mistakes
- Too many small files
- Ignoring skew
- Overusing UDFs

Best practices
- Filter early
- Broadcast small dimensions
- Reduce unnecessary shuffles

Related technologies
- Databricks, SQL, Delta Lake

