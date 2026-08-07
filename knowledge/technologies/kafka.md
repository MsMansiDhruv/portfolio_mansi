---
title: Kafka
tags: [technology, kafka, streaming]
technologies: [spark, databricks]
projects: []
skills: [streaming, reliability]
topics: [event streaming]
difficulty: [intermediate]
related_documents: [knowledge/technologies/spark.md]
---

# Kafka

Overview
- Durable event streaming platform for ordered ingestion and fan-out.

Why I use it
- Best when ordered replayable event streams are important.

When I choose it
- Streaming ingestion
- Multiple consumers
- Replay and durability requirements

When I avoid it
- Simple batch loads with no streaming requirement

Advantages
- Replay
- Ordering
- Consumer decoupling

Disadvantages
- Operational overhead
- Schema and topic governance are required

Alternatives
- Event Hubs
- Pub/Sub
- Kinesis

Enterprise considerations
- Retention, schema governance, and consumer lag monitoring matter.

Scaling considerations
- Partition planning and consumer group design affect throughput.

Common mistakes
- Excessive topic sprawl
- Undefined ownership

Best practices
- Define contracts and retention policies.

Related technologies
- Spark, Databricks, Airflow

