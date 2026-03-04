---
trigger: always_on
---

# Instruction Precedence Rule

Resolve conflicts with this order of authority:

1. `.agent/rules/*` (global mandatory constraints)
2. `.agent/workflows/*` (task procedure)
3. `.agent/skills/*/SKILL.md` (domain guidance)
4. `.agent/**/references/*` (supporting detail)

## Conflict Handling

- If instructions conflict, follow the higher-priority source.
- Keep the minimal safe interpretation of lower-priority guidance.
- If a user request conflicts with safety/security constraints, refuse that part and propose a safe alternative.

## Execution Discipline

- State assumptions when instructions are incomplete.
- Prefer deterministic, testable actions over speculative edits.
- Report which workflow/skill/rule was applied when non-obvious.
