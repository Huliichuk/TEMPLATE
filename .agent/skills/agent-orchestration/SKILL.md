---
name: agent-orchestration
description: Advanced skill for building autonomous agents, orchestrators, and planning systems using Anthropic's Evaluator-Optimizer and Orchestrator-Worker patterns.
---

# Agent Orchestration & Planning Skill

This skill provides a systematic approach to designing complex Agent systems, building cool prompts, and structuring orchestrator-worker workflows. It is meant to be used when an agent needs to break down tasks, supervise other agents, or evaluate LLM generation outputs.

## When to Use
- Building multi-agent systems (e.g., separating planning, coding, and reviewing).
- Designing complex prompts that require breaking down tasks into sub-tasks.
- Implementing an Orchestrator-Worker pattern to execute sub-tasks in parallel.
- Implementing an Evaluator-Optimizer pattern to continuously improve outputs.
- Writing "cool plans" and "cool tasks" for agentic workflows.

---

## 1. The Orchestrator-Worker Pattern

A pattern where a central Orchestrator LLM breaks a complex goal into parallelizable sub-tasks, delegates them to Worker LLMs, and then synthesizes the results.

### When to use:
- The task is highly complex but can be split into independent pieces.
- You need diverse approaches or multiple perspectives simultaneously.
- Speed is critical (since workers run in parallel).

### How it works:
1. **Orchestrator Prompt**: Analyzes the original task and outputs a structured plan (usually XML/JSON) defining `N` specific sub-tasks.
2. **Workers execution**: Each worker is given a specific sub-task.
3. **Synthesis**: The Orchestrator (or a separate Synthesizer node) combines all worker outputs into a final coherent result.

---

## 2. The Evaluator-Optimizer Pattern

A self-correction loop where one LLM generates content (Optimizer) and another evaluates it against specific criteria (Evaluator), providing feedback for the next iteration.

### When to use:
- Tasks with clear success criteria but unpredictable initial outputs (e.g., complex coding, creative writing).
- Tasks where iterative refinement drastically improves quality.

### How it works:
1. **Generator**: Creates an initial draft.
2. **Evaluator**: Checks the draft against criteria (e.g., "Is the code type-safe?", "Does the essay answer the prompt?"). Returns `PASS` or `FAIL` + `Feedback`.
3. **Loop**: If `FAIL`, the Generator tries again with the feedback added to its context. Terminates on `PASS` or max retries.

---

## 3. Planning & Task Breakdown (The Brain)

Planning is the core of any agentic system. Without robust planning, an agent cannot fulfill complex tasks.

- **Complex Task Breakdown**: The agent acts as an *expert research planner*, splitting the query into targeted sub-tasks (e.g., "Research API docs", "Write component", "Write test").
- **Structured Output**: Force the planner to output machine-readable formats (like `<tasks><task>...</task></tasks>`).
- **Chain of Thought**: Always ask the planner to output an `<analysis>` or `<thoughts>` block before the final plan. This forces the LLM to reason before committing to a plan.

---

## 4. Designing "Cool" Prompts (Prompt Engineering)

To make an agent "cool" and effective, your system prompts must be:
- **Role-based**: "You are an expert orchestrator..."
- **Constrained**: Tell it explicitly what *not* to do. (e.g., "Do not hallucinate APIs. Do not skip testing").
- **Structured**: Use XML tags for structure. Anthropic models excel at XML parsing. `<task>`, `<analysis>`, `<feedback>`.
- **Iterative**: Include memory and previous attempts in the prompt context.

## References
Consult `references/orchestrator-patterns.md` for exact Python/TypeScript implementation templates inspired by the Anthropic Cookbook.
