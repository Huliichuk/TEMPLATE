---
description: Write and run tests for features and bug fixes
---

# Testing Workflow

Purpose: Ensure every feature and fix is backed by appropriate tests.

---

## Step 1 — Determine test scope

- Identify what changed or was added
- Classify: unit test, integration test, or e2e test
- Unit: pure functions, hooks, utilities
- Integration: API routes, server actions, database queries
- E2E: critical user flows (login, CRUD, payments)

---

## Step 2 — Check existing tests

```bash
# Find existing test files
find src -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -20

# Check test framework config
cat vitest.config.* jest.config.* 2>/dev/null | head -30
```

- Understand the existing test patterns and conventions
- Reuse test utilities and factories if they exist

---

## Step 3 — Write tests

- Test **behavior**, not implementation details
- Name tests descriptively: `it("should return error when user not found")`
- Cover:
  - Happy path
  - Edge cases (empty input, null, boundary values)
  - Error cases (network failure, invalid data)
- Mock only at boundaries (API clients, database)
- Keep tests independent — no shared mutable state

---

## Step 4 — Run and verify

```bash
# Run all tests
npm test 2>&1 | tail -30

# Run specific test file
npx vitest run src/path/to/file.test.ts 2>&1

# Run with coverage (if configured)
npm test -- --coverage 2>&1 | tail -20
```

- All tests must pass
- No skipped tests without explanation
- Coverage should not decrease

---

## Output

- Summary: what was tested, number of tests added, coverage impact
