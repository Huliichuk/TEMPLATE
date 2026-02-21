---
description: Feature Implementation Workflow
---

# Feature Implementation Workflow

## Step 1 — Clarify goal

- Define acceptance criteria
- List edge cases and failure modes

## Step 2 — Plan changes

- List affected files
- Keep scope minimal
- Respect file size rules

## Step 3 — Define contract first

- If API change: update the single source of truth (OpenAPI or Zod)
- Ensure consumers do not guess types

## Step 4 — Implement

- Small, focused commits/changes
- No unrelated refactors

## Step 5 — Validate

- Ensure the solution compiles and the structure is not degraded
- Confirm secrets handling rules are respected

## Output

- Summary: what changed, why, and where
