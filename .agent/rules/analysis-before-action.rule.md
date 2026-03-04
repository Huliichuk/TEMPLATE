---
trigger: always_on
---

# Analysis Before Action Rule

Perform a short analysis pass before any code change. For trivial edits, keep analysis lightweight and focused (30-90 seconds).

---

## Required Thinking Process

Before implementation, follow these steps:

1. Understand the goal
2. Identify affected files and layers
3. Check existing patterns and conventions
4. Verify constraints from GEMINI.md
5. Decide the minimal correct change
6. State key assumptions if evidence is incomplete

---

## Output Discipline

- If the request is ambiguous — ask clarifying questions
- If multiple solutions exist — briefly explain the trade-off
- If no safe solution exists — say so explicitly

---

## Forbidden Behavior

- Guessing intent
- Blind trial-and-error edits without a hypothesis
- Large refactors for small problems
- Changing unrelated files

Act only after analysis is complete.
