---
name: memory-patterns
description: Reference implementations for cross-agent memory management using Anthropic's Memory Tool concepts and Obsidian-style File Systems.
source: Internal Orchestration Patterns + Anthropic Cookbook
---

# Agent Memory Patterns — Reference

## 1. The Obsidian "Second Brain" Structure

When an orchestrator agent sets up a new repository, it should initialize a memory structure for fellow agents.

```bash
.agent/
├── rules/                    # High-priority constraints (e.g., GEMINI.md components)
│   └── zero-defect.rule.md
├── skills/                   # Domain knowledge
│   └── agent-memory/
├── workflows/                # CI/CD and slash commands
│   └── feature-implementation.md
└── .memory/                  # Temporary cross-agent state (if needed in repo)
    └── active_migration.md   # What the current agents are actively changing
```

## 2. Shared State Protocol (Temporary Breadcrumbs)

When breaking a large task among parallel workers, the Orchestrator writes a central "State" file.

### Example: `.agent/.memory/db-migration-state.md`
```markdown
---
status: IN_PROGRESS
owner: Agent-Worker-1
target_completion: 2026-02-21
---

# Database Migration Strategy v2

> [!IMPORTANT]
> Agent-Worker-2: Do NOT touch the `users` table until this status is marked as DONE.

## Sub-tasks
- [x] Create initial migration file (Agent-Worker-1)
- [ ] Update Supabase policies (Agent-Worker-1)
```

## 3. The "Memory Tool" Concept (Anthropic Pattern)

In advanced MCP setups (like Anthropic's `memory_20250818` tool), agents can explicitly call standard memory storage. In a standard filesystem, we simulate this by creating `Knowledge Items (KIs)` using JSON metadata and markdown content.

### Reading Memory
When an agent encounters an unknown pattern:
1. Search local `.agent/skills` for matching domain knowledge.
2. Search global `~/.gemini/antigravity/knowledge/` for KIs related to the project.
3. If context is missing, check the conversational `.system_generated/logs` of a related Conversation ID.

### Writing Memory
When an agent solves a difficult, non-trivial problem:
1. **Do not** just finish the task and exit.
2. **Do** create a reference markdown file (e.g., `fixing-vite-build-ooms.md`).
3. Add it to the relevant `.agent/skills/{domain}/references/` folder.
4. Update `SKILL.md` to link to the new reference.

## 4. Context Editing (Preventing Window Overflow)

- **Summarize before shifting**: If you switch from "Planning Backend" to "Implementing Frontend", write a quick markdown summary of backend endpoints to your `task.md` or a temp file, rather than keeping all the backend code files in your active memory context.
- **Clear Tool Uses**: If you ran `npm run dev` 15 times and got traces, the session context is huge. Start a new Task Boundary with a concise summary of the errors and how you fixed them, creating a single "condensed" thought before moving on.
