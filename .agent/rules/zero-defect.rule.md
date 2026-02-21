---
trigger: always_on
---

# Zero-Defect Development Rule

You MUST produce code that works on the first try. Bugs, type errors, wrong imports, and regressions are UNACCEPTABLE. Follow this protocol for every code change.

---

## Phase 1: PRE-FLIGHT (Before Writing Code)

### 1.1 Understand Before Acting
- [ ] Read ALL files you plan to modify (not just outlines — read the actual code)
- [ ] Identify existing patterns, naming conventions, and import paths
- [ ] Check `package.json` for available dependencies — NEVER import a library that isn't installed
- [ ] Verify API signatures by reading source code or official docs — NEVER guess

### 1.2 Version Synchronization
- [ ] Check `package.json` for EXACT version numbers of key frameworks (Next.js, React, etc.)
- [ ] If using framework-specific APIs (Next.js 15 async `cookies()`, `headers()`, etc.), verify via `context7` MCP or docs that the API matches the installed version
- [ ] NEVER rely on training data for bleeding-edge syntax — always verify

### 1.3 Impact Analysis
- [ ] List every file that will be affected by this change
- [ ] Identify downstream consumers (who imports this file? who calls this function?)
- [ ] Check for existing tests that might break
- [ ] If modifying a shared component, verify ALL usage sites first
- [ ] If modifying a data model (interface/Zod), check if a database migration is needed

### 1.4 Context Hygiene
- Do NOT dump entire files into context unless necessary
- Use `grep_search` or `view_file_outline` first to locate specific 20–50 lines of code
- Only read the specific targets — "reading all" means understanding the dependency graph, not loading all text

### 1.5 Uncertainty Protocol
> If you are NOT 100% certain about an API, import path, function signature, or config option — **STOP and verify**.
- Use `view_file`, `view_code_item`, or `grep_search` to find the actual definition
- Use `context7` MCP to check official documentation
- If still uncertain — ask the user. NEVER guess.

---

## Phase 2: WRITING (During Implementation)

### 2.1 Type Safety First
- ALL variables, function params, and return types MUST be explicitly typed
- NEVER use `any`, `as any`, or non-null assertions (`!.`) unless documented why
- Use `interface` for component props, `type` for unions/intersections
- Validate all external data at boundaries with Zod

### 2.2 Import Hygiene
- Use EXACT import paths — copy from existing files in the project
- Prefer named imports over default imports
- Check that every import resolves to an actual exported symbol
- NEVER import from a path you haven't verified exists
- **Server/Client Boundary**: Before adding `"use client"`, scan imports. If ANY import contains `fs`, `path`, `headers()`, `cookies()`, or DB SDKs — STOP and refactor to pass data as props or use a Server Action

### 2.3 Defensive Patterns
- Handle `null`, `undefined`, and empty arrays explicitly
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safety
- Add `try/catch` around all I/O operations (fetch, DB, file system)
- Use the Result Pattern (`{ success: true, data } | { success: false, error }`) for business logic
- Add `text-wrap: balance` and `break-words` for dynamic text content

### 2.4 Regression Prevention
- When editing an existing function, preserve ALL existing behavior unless explicitly changing it
- When adding a new prop to a component, ensure ALL call sites still compile (provide defaults)
- When modifying a type/interface, grep for ALL files that reference it
- NEVER delete code without first confirming it's unused

### 2.5 Atomic Operations
- NEVER mix refactoring with feature implementation in the same edit
- If a file needs refactoring AND a new feature, do the refactor first as Task A, then the feature as Task B
- Treat `app/` directory file paths as hardcoded API contracts — moving/renaming breaks routes and SEO

---

## Phase 3: POST-FLIGHT (After Writing, Before Submitting)

### 3.1 Self-Review Checklist
- [ ] Re-read every line of code you wrote — does it make logical sense?
- [ ] Are all imports correct and resolvable?
- [ ] Are all TypeScript types consistent (no `any`, no missing types)?
- [ ] Have you handled ALL edge cases (empty data, null values, loading states, errors)?
- [ ] Does this change break any existing behavior?
- [ ] Are there any hardcoded values that should be environment variables or constants?

### 3.2 Build Verification
- If a build/type-check command is available, run it to verify no compile errors
- Trace the execution path from entry point to output — verify prop threading parent → child
- If changing data shapes, verify that ALL consumers of that data are updated
- For UI changes: verify parent containers have explicit `relative`/`absolute` positioning and `z-index` if using overlays

### 3.3 Common AI Agent Mistakes (Self-Check)
- [ ] Did I hallucinate an API that doesn't exist? (Verify via source code or docs)
- [ ] Did I import from a non-existent path? (Verify the file exists)
- [ ] Did I use a deprecated or renamed function? (Check latest docs)
- [ ] Did I forget to handle the loading/error states?
- [ ] Did I leave placeholder text or TODO comments?
- [ ] Did I mix up similar variable names (e.g., `userId` vs `user_id`)?
- [ ] Did I break the existing Type contract by adding/removing required fields?

---

## Phase 4: CONTINUOUS IMPROVEMENT

### Learn from Mistakes
- If a user reports a bug in code you wrote, analyze WHY it happened
- Add the specific failure pattern to your pre-flight checks for future tasks
- If the same type of error recurs, it indicates a systemic gap in your process

### Testing Awareness
- Know where tests live in the project
- If modifying code covered by tests, run them mentally
- If adding new critical logic, recommend test creation to the user

### Recursion Limit (Fix-the-Fix Prevention)
- If your fix causes a NEW error, you have ONE retry
- If the second attempt also fails, REVERT all changes and report the specific gap to the user
- NEVER spiral into a "fix-the-fix" loop — this causes cascading regressions

---

## Forbidden Behaviors

| ❌ Forbidden | ✅ Required Instead |
|---|---|
| Guessing an import path | Read existing imports in the same directory |
| Using `any` type | Find or create the proper type/interface |
| Assuming an API shape | Read the actual function signature or docs |
| Deleting code without checking usage | `grep_search` for all references first |
| Writing "this might work" code | Verify each line will work before writing |
| Leaving TODO comments | Implement the full solution or ask the user |
| Making 20 changes when 3 are needed | Apply the "Small Change" principle |

---

## Gold Standard Code Patterns

These patterns are MANDATORY when applicable. Copy and adapt — do not reinvent.

### Server Action Security (REQUIRED for all Server Actions)
```typescript
'use server'
import { z } from 'zod';
import { auth } from '@/auth';

const schema = z.object({ name: z.string().min(1) });

export async function createItem(data: unknown) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" } as const;

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() } as const;

  try {
    // ... db logic ...
    return { success: true, data: result } as const;
  } catch (e) {
    return { success: false, error: "Database error" } as const;
  }
}
```

### Safe Data Fetching (REQUIRED for Server Components)
```typescript
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next.js 15: params is async
  const item = await getItem(id);
  if (!item) notFound(); // Triggers not-found.tsx
  return <div>{item.name}</div>;
}
```

### Result Pattern (REQUIRED for business logic)
```typescript
type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };
```

---

**Enforcement**: Violation of this rule is a critical error per Google Engineering Principles (GEP).
