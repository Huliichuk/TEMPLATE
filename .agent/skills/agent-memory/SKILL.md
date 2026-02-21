---
name: agent-memory
description: Strategic skill for managing long-term agent memory, cross-agent communication, and context window optimization using Obsidian-style Markdown notes (Knowledge Management).
---

# Agent Memory & Context Orchestration Skill

When multiple autonomous agents (e.g., Open Agent Manager sessions) run in parallel, they are strictly sandboxed and do not share live conversational context. This skill defines the framework for agents to build a shared "Brain", persist long-term memory, and orchestrate their work using **Obsidian-compatible Markdown files**.

## When to Use
- You are a **Super Agent / Orchestrator** trying to map the project architecture for other agents.
- You are starting a complex task and want to leave a trail of "breadcrumbs" so future agent sessions know what you did.
- The context window is getting full, and you need to summarize the ongoing task into a long-term storage file.
- You need to pass guidelines, rules, or environment states to parallel agents.

---

## 1. The Obsidian-Style Memory Protocol

Because agents start with empty conversational memory, the file system is the only shared bus for communication.

### Creating Shared Context
Instead of dumping thoughts into the chat, write them to specific `.md` files in designated directories:
- **`.agent/skills/`**: For actionable, structured guidelines on *how* to do something.
- **`.agent/rules/`**: For absolute, immutable constraints (e.g., "NEVER use npm, only pnpm").
- **`~/.gemini/antigravity/knowledge/`**: (Knowledge Items / KIs) For tracking major project decisions, architectural summaries, and completed milestone reports.

### Markdown Best Practices for Memory
To ensure other agents can parse these files efficiently:
1. **Frontmatter**: Use YAML frontmatter at the top (`--- name: ... ---`) to define metadata so `grep_search` and `find_by_name` tools can index them.
2. **Wiki-Links**: Use `[[feature_auth.md]]` syntax to link related concepts. Agents reading the Markdown can follow these links.
3. **Chunking**: Keep files under 300 lines. A Super Agent shouldn't need a massive context window to read a single note. If a note gets too big, split it.

---

## 2. In-Code "Breadcrumbs" (Contextual Commits)

To help parallel agents understand what a specific file does without reading the entire PR history:
- Leave **high-level architectural comments** at the top of complex files, explaining the *Why*, not the *What*.
- If you are doing a multi-file refactoring, create a temporary `ARCHITECTURE_MIGRATION.md` file in the working directory that explains the exact state of the refactoring, so if another agent jumps in, they know where you left off.

---

## 3. Context Window Optimization (Anthropic Patterns)

When orchestrating long-running sessions, context windows fill up quickly with tool calls and XML outputs.

- **Clear Tool Uses**: If you are repeatedly compiling/running tests, you don't need the 10th failure output in your memory if you fixed it. Document the *fix pattern* into an `error-patterns.md` reference file, and move on.
- **Task Summaries**: Use the `task_boundary` tool's `TaskSummary` specifically to condense 10-20 previous tool calls into a single, punchy sentence.
- **RAG for Context**: Do not `view_file` the entire `node_modules`. Rely on the Context 7 MCP server and the Knowledge Subagent to retrieve targeted snippets.

## Orchestration Flow

1. **Agent A (Worker)**: Encounters a new complex error related to authentication. Spends 20 steps fixing it.
2. **Agent A (Worker)**: Writes the solution into `.agent/skills/auth/references/auth-gotchas.md`.
3. **Agent B (Orchestrator)**: Spins up to work on user profile integration.
4. **Agent B (Orchestrator)**: Runs `list_dir` on `.agent/skills/auth/references/` and reads `auth-gotchas.md`.
5. **Agent B (Orchestrator)**: Implements the profile using the exact rules discovered by Agent A, avoiding the same 20 steps of debugging.

This is the definition of **Agent Knowledge Management**.
