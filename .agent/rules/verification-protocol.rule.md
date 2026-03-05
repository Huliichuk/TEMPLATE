---
trigger: always_on
---

# Verification Protocol Rule

Before marking any task as complete, you MUST perform a self-audit to ensure your work meets Google Staff-level engineering standards.

---

## 1. Compliance Audit
Check your work against the following core documents:
- [GEMINI.md](../../GEMINI.md)
- [pr-checklist.md](../references/pr-checklist.md)
- Relevant Skill files (e.g., `typescript-engineer`, `component-architecture`)

## 2. Hallucination Prevention Check
- [ ] Did I guess any API signatures or configuration options?
- [ ] Did I verify the existence of all files I modified or referenced?
- [ ] Are all external links or documentation references active/verified?

## 3. "The Small Change" Validation
- [ ] Is this the minimal set of changes required to achieve the goal?
- [ ] Did I avoid sweeping refactors or unrelated file changes?
- [ ] Are my changes logically cohesive?

## 4. Reliability & Error Handling
- [ ] Does my implementation handle edge cases (e.g., null values, network failures, empty states)?
- [ ] Did I use the **Result Pattern** for critical business logic?
- [ ] Are there sufficient logs or comments explaining *why* certain decisions were made?

## 5. Security & Privacy
- [ ] Are all secrets, tokens, or PII excluded from logs and commits?
- [ ] Did I validate all user-provided inputs via **Zod** or equivalent?

## 6. Completion Gate (Mandatory)
- [ ] Did I run lint (or the nearest equivalent static check) before finalizing?
- [ ] Did I run tests relevant to the changed behavior before finalizing?
- [ ] If checks could not run, did I clearly report command attempts, blockers, and residual risk?
- [ ] Did I avoid deployment/release/publish commands (including `git push`) unless explicitly requested in this conversation?

---

**Protocol Enforcement**: Failure to follow this protocol is a violation of Google Engineering Principles (GEP).
