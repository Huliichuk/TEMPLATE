---
trigger: always_on
---

# Execution Safety Gate Rule

Before marking any implementation/debug/refactor task as complete, enforce the following:

## 1. Mandatory Validation
- Detect the package manager from lockfiles.
- Run `lint` (or the nearest equivalent static check when lint is unavailable).
- Run `test` (full suite or focused tests relevant to the changed behavior).
- If any required check fails, continue fixing until it passes or explicitly report why work is blocked.

## 2. Required Reporting
- Include validation evidence in the final response:
  - exact commands executed,
  - pass/fail outcomes,
  - any unverified areas.

## 3. Deployment Prohibition (Strict)
- Do NOT run deployment/release/publish commands unless the user explicitly requests deployment in the current conversation.
- Do NOT run `git push` unless explicitly requested in the current conversation.
- Default behavior is local verification only.

**Enforcement**: Violating this rule is a critical error.
