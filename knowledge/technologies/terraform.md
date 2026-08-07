---
title: Terraform
tags: [technology, terraform, iac]
technologies: [aws, azure]
projects: [amc-datalake]
skills: [automation, governance]
topics: [infrastructure-as-code]
difficulty: [intermediate]
related_documents: [knowledge/technologies/aws.md]
---

# Terraform

Overview
- Infrastructure as code for repeatable, reviewable cloud provisioning.

Why I use it
- Reduces drift and makes environments reproducible.

When I choose it
- Platform provisioning
- Environment standardization

When I avoid it
- One-off manual experiments that are not worth codifying

Advantages
- Declarative
- Reviewable
- Repeatable

Disadvantages
- State management discipline required

Alternatives
- CloudFormation
- Pulumi

Enterprise considerations
- State, modules, and environment isolation matter.

Scaling considerations
- Organize modules and state boundaries carefully.

Common mistakes
- One giant state
- Manual edits outside code

Best practices
- Use modules and clear ownership.

Related technologies
- AWS, Azure

