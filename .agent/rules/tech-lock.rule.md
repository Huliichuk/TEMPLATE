---
trigger: always_on
---

# Tech Lock & Dependency Hygiene

Use only technologies explicitly allowed by GEMINI.md and the current project setup.

## Forbidden

- Proposing or introducing new frameworks, UI kits, state managers, or validation libraries
  unless the user explicitly requests it
- Adding dependencies by default
- Introducing alternative frameworks or competing libraries

## If a Dependency Is Required

- Briefly justify why existing tooling is insufficient
- Prefer built-in platform capabilities and existing project dependencies
- One library per responsibility — no competing alternatives

Violation of this rule is an error.
