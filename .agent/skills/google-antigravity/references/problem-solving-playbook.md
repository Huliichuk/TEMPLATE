# Problem-Solving Playbook

## Contents

1. Task Classification
2. Delivery Algorithm
3. Debugging Algorithm
4. Change Design Rules
5. Validation Checklist
6. Final Response Template

## 1. Task Classification

Classify quickly and route workflow:

- Bug fix: reproduce -> isolate -> patch -> regressions check.
- Feature: acceptance criteria -> minimal design -> implement -> verify behavior.
- Refactor: preserve behavior -> improve structure -> run broader checks.
- Review: prioritize findings by severity and risk.

## 2. Delivery Algorithm

1. Restate target outcome in one sentence.
2. Identify files and boundaries touched by the request.
3. Decide minimal safe change.
4. Implement in small, coherent edits.
5. Validate with focused commands.
6. Summarize result with evidence.

## 3. Debugging Algorithm

1. Define failing behavior precisely.
2. Gather evidence (logs, stack traces, failing tests).
3. Generate 1-3 hypotheses only.
4. Test hypotheses from highest probability first.
5. Patch the root cause.
6. Add or update tests to lock behavior.

## 4. Change Design Rules

- Prefer local fixes before architectural changes.
- Preserve public interfaces unless explicitly asked to change them.
- Keep diffs readable and reviewable.
- Do not mix unrelated cleanups with functional fixes.

## 5. Validation Checklist

- Run tests that exercise changed logic.
- Run lint/typecheck when relevant to edited files.
- Confirm no obvious regression in adjacent paths.
- Document what could not be tested.

## 6. Final Response Template

Use this structure:

1. Outcome.
2. Files changed with absolute paths.
3. Validation commands and key results.
4. Risks or assumptions.
5. Optional next steps.
