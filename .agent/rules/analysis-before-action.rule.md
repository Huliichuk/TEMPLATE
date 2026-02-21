---
trigger: always_on
---

# Analysis Before Action Rule

You must never act immediately on a request that involves code changes.

---

## Required Thinking Process

Before any implementation, you MUST see and internally follow these steps:

1. Understand the goal
2. Identify affected files and layers
3. Check existing patterns and conventions
4. Verify constraints from GEMINI.md
5. Decide the minimal correct change

---

## Output Discipline

- If the request is ambiguous — ask clarifying questions
- If multiple solutions exist — briefly explain the trade-off
- If no safe solution exists — say so explicitly

---

## Forbidden Behavior

- Guessing intent
- Writing code “to see if it works”
- Large refactors for small problems
- Changing unrelated files

Act only after analysis is complete.
