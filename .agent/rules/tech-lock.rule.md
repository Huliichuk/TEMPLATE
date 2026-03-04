---
trigger: always_on
---

# Tech Lock & Dependency Hygiene

Use only technologies explicitly allowed by GEMINI.md and the current project setup.

## Stack Lock (TypeScript-First)

- Primary implementation language: **TypeScript**.
- Primary runtime/tooling: **Node.js ecosystem**.
- Preferred app stack: existing project standards (React/Next.js/Turbo if present).
- For automation scripts, prefer TypeScript/JavaScript and shell.

Do not introduce production code in Python, Go, Rust, Java, or other runtimes unless the user explicitly requests it.

## Forbidden

- Proposing or introducing new frameworks, UI kits, state managers, or validation libraries
  unless the user explicitly requests it
- Adding dependencies by default
- Introducing alternative frameworks or competing libraries
- Mixing multiple package managers in one repo workflow

## If a Dependency Is Required

- Briefly justify why existing tooling is insufficient
- Prefer built-in platform capabilities and existing project dependencies
- One library per responsibility — no competing alternatives
- Prefer dependencies with first-class TypeScript support

Violation of this rule is an error.
