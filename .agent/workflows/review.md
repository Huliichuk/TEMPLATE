---
description: Multi-perspective code review for pull requests or changes
---

# Code Review

Comprehensive code review from multiple expert perspectives.

## Review Steps

1. **Read the changes** — Understand the full scope of modifications

2. **Functional Review**:
   - Does the code do what it's supposed to?
   - Are edge cases handled?
   - Are error paths covered?
   - Is the behavior correct for all inputs?

3. **Type Safety Review**:
   - Are types properly defined (no `any`)?
   - Are generic types used where appropriate?
   - Are return types explicit?
   - Null/undefined handled properly?

4. **Security Review**:
   - No secrets hardcoded
   - Input validation present
   - SQL injection prevention (parameterized queries)
   - Proper authentication/authorization checks
   - No XSS vulnerabilities

5. **Performance Review**:
   - No unnecessary re-renders (React)
   - Proper memoization where needed
   - No N+1 queries
   - Efficient data structures
   - Lazy loading where appropriate

6. **Maintainability Review**:
   - Code follows SOLID principles
   - Files are reasonably sized (target 300-400 lines, max 500)
   - Clear naming conventions
   - Comments explain WHY, not WHAT
   - No duplicated logic

7. **Architecture Review**:
   - Proper separation of concerns
   - No business logic in UI components
   - No framework leakage into domain logic

## Output Format

Provide a prioritized list of findings:

```
### 🔴 Critical (must fix)
1. [Finding]

### 🟡 Important (should fix)
1. [Finding]

### 🟢 Suggestions (nice to have)
1. [Finding]

### ✅ Good practices observed
1. [Finding]
```
