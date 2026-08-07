---
title: Airflow
tags: [technology, airflow, orchestration]
technologies: [python, sql]
projects: []
skills: [orchestration, reliability]
topics: [workflow orchestration]
difficulty: [intermediate]
related_documents: [knowledge/technologies/sql.md, knowledge/technologies/python.md]
---

# Airflow

Overview
- Workflow orchestration for scheduled, observable data pipelines.

Why I use it
- Gives explicit dependencies, scheduling, and recovery control.

When I choose it
- Multi-step data workflows
- Backfills and retries matter

When I avoid it
- Very simple jobs that do not need orchestration overhead

Advantages
- Clear DAGs
- Retry control
- Backfill support

Disadvantages
- DAG sprawl
- Scheduler overhead

Alternatives
- Dagster
- Prefect
- Native cloud orchestration

Enterprise considerations
- Reusable operators, SLAs, and ownership boundaries are important.

Scaling considerations
- Keep DAGs manageable and idempotent.

Common mistakes
- Putting business logic in orchestration

Best practices
- Treat orchestration as coordination, not transformation.

Related technologies
- Python, SQL, Kafka

