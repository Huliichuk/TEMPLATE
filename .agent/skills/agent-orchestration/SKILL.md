---
name: agent-orchestration
description: Advanced skill for building autonomous agents, orchestrators, and planning systems using Anthropic's Evaluator-Optimizer and Orchestrator-Worker patterns.
---

# Agent Orchestration & Planning Skill

This skill provides a systematic approach to planning complex tasks.

## When to Use
- Designing complex prompts that require breaking down tasks into sub-tasks.
- When you are confused about how to proceed and need a structured plan.

---

## 1. Planning & Task Breakdown

Planning is the core of any agentic system. Without robust planning, an agent cannot fulfill complex tasks.

- **Complex Task Breakdown**: Split the query into targeted sub-tasks (e.g., "Research API docs", "Write component", "Write test").
- **Chain of Thought**: Always analyze the problem before committing to a plan or editing code.

---

## 2. Designing Clear Prompts

When generating system prompts or plans:
- **Be direct**: Tell it explicitly what *to* do, rather than a list of what *not* to do.
- **Structured**: Use Markdown lists or XML tags for structure.

## References
Consult `references/orchestrator-patterns.md` for exact Python/TypeScript implementation templates inspired by the Anthropic Cookbook.
