---
trigger: always_on
---

# Verification Protocol Rule

Before calling `notify_user` or "finishing" any task, you MUST perform a self-audit to ensure your work meets Google Staff-level engineering standards.

---

## 1. Compliance Audit
Check your work against the following core documents:
- [GEMINI.md](file:///Users/tarashuliichuk/MyProjects/TEMPLATE/GEMINI.md) (All 11 sections)
- [pr-checklist.md](file:///Users/tarashuliichuk/MyProjects/TEMPLATE/.agent/references/pr-checklist.md)
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

---

**Protocol Enforcement**: Failure to follow this protocol is a violation of Google Engineering Principles (GEP).
