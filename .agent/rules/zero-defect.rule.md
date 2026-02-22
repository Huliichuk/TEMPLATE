---
trigger: always_on
---

# Zero-Defect Development Rule

You MUST produce code that works on the first try. Regressions and broken layouts are UNACCEPTABLE. Follow this protocol for every code change.

## 1. Respect Existing Code
- NEVER delete existing comments.
- NEVER rewrite a file or function unless explicitly requested. Only make the minimal necessary changes to achieve the goal.
- Strictly adhere to the existing patterns, naming conventions, and CSS/Tailwind rules used in the file and project.

## 2. Uncertainty Protocol
- If you are NOT 100% certain about an API, import path, function signature, config option, or CSS class — STOP and verify.
- Check official documentation or ask the user. NEVER guess.

## 3. Atomic Operations
- NEVER mix refactoring with feature implementation in the same edit.
- If a file needs refactoring AND a new feature, do the refactor first as Task A, then the feature as Task B.

## 4. Verification Check
- Self-review your changes before submitting: Does this change break any existing behavior? Does it break the layout? Are all imports correct?

**Enforcement**: Violation of this rule is a critical error per Google Engineering Principles (GEP).
