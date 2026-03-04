---
description: Test design and execution workflow. Use when adding features, fixing bugs, or guarding against regressions.
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
find apps packages src -type f \( -name "*.test.*" -o -name "*.spec.*" \) 2>/dev/null | head -40

# Check test framework config
ls -1 vitest.config.* jest.config.* playwright.config.* 2>/dev/null
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
PM=npm
[ -f pnpm-lock.yaml ] && PM=pnpm
[ -f yarn.lock ] && PM=yarn

# Run all tests
$PM run test 2>&1 | tail -40

# Run specific test file
$PM exec vitest run apps/path/to/file.test.ts 2>&1

# Run with coverage (if configured)
$PM run test -- --coverage 2>&1 | tail -20
```

- All tests must pass
- No skipped tests without explanation
- Coverage should not decrease

---

## Output

- Summary: what was tested, number of tests added, coverage impact
