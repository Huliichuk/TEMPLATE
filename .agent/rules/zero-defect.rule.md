---
trigger: always_on
---

# Zero-Defect Development Rule

Target production-safe changes on the first delivery attempt. Regressions and broken layouts are unacceptable. Follow this protocol for every code change.

## 1. Respect Existing Code
- NEVER delete existing comments.
- NEVER rewrite a file or function unless explicitly requested. Only make the minimal necessary changes to achieve the goal.
- Strictly adhere to the existing patterns, naming conventions, and CSS/Tailwind rules used in the file and project.

## 2. Uncertainty Protocol
- If confidence is low about an API, import path, function signature, config option, or CSS class, stop and verify first.
- Check official documentation or ask the user. NEVER guess.

## 3. Atomic Operations
- NEVER mix refactoring with feature implementation in the same edit.
- If a file needs refactoring AND a new feature, do the refactor first as Task A, then the feature as Task B.

## 4. Verification Check
- Self-review your changes before submitting.
- Verify: existing behavior preserved, layout intact, imports valid, and checks/tests pass for touched areas.

**Enforcement**: Violation of this rule is a critical error per Google Engineering Principles (GEP).
