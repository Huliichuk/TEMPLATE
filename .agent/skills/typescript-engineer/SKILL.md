---
name: typescript-engineer
description: Professional-grade engineering standards for TypeScript, focusing on type safety, clean architecture, and modern best practices.
allowed-tools: []
---

# Professional TypeScript Engineering

## Overview

This skill defines the **Mandatory Engineering Standards** for all TypeScript code in the project. It moves beyond basic syntax to enforce architectural discipline, type safety, and long-term maintainability.

When operating under this skill, you act as a **Staff Software Engineer**. You prioritize correctness, readability, and robustness over speed or cleverness.

**References** (consult for detailed patterns):
- `references/advanced-types.md` — Mapped types, conditional types, template literals
- `references/react-hook-form-zod.md` — Form validation with zodResolver
- `references/tanstack-query.md` — Server state management, optimistic updates
- `references/better-auth.md` — Authentication patterns
- `references/rag-implementation.md` — RAG pipeline patterns
- `references/mcp-builder.md` — MCP server scaffolding

## Core Philosophy

1.  **Safety First**: Compiler errors are better than runtime errors. Use the type system to make invalid states unrepresentable.
2.  **Explicitness**: Code is read more often than written. Be explicit about types, intents, and boundaries.
3.  **Simplicity**: Avoid accidental complexity. Use standard patterns and libraries unless a strong justification exists for deviation.

---

## 1. Type Safety & Identity (Staff Level)

### ❌ Forbidden
- **`any`**: Never use `any`. Use `unknown` or a specific type.
- **Hungarian Notation**: No `sName`, `iCount`, `bEnabled`.
- **Implicit `any`**: Ensure `tsconfig.json` has `noImplicitAny: true`.
- **Non-null assertions (`!`)**: Forbidden unless justified with a comment explaining _why_.
- **Type Assertions (`as`)**: Use only for narrowing. Must be accompanied by a justification comment.

### ✅ Required
- **Descriptive Naming**: Use unambiguous, full-word identifiers (e.g., `errorCount` over `errCnt`).
- **Explicit Return Types**: All exported functions and class methods MUST have explicit return types.
- **Strict Null Handling**: Reserve `| null` or `| undefined` for function signatures, not type aliases.
- **Renaming Imports**: Use `import { x as y }` to avoid collisions or improve clarity.

### Type Patterns

```typescript
// ✅ Branded types — prevent mixing IDs
type UserId = string & { readonly __brand: 'UserId' }
type ProjectId = string & { readonly __brand: 'ProjectId' }

function getUser(id: UserId): Promise<User> { /* ... */ }
// getUser(projectId) ← TypeScript error!

// ✅ Discriminated unions — exhaustive handling
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; code: number }
  | { status: 'loading' }

// ✅ Const assertions for literal types
const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
} as const

type DocumentStatus = typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS]
```

> See `references/advanced-types.md` for mapped types, conditional types, and template literals.

---

## 2. Architecture & Clean Logic

### Functional Core, Imperative Shell
- Keep business logic **pure** and push I/O to the edges.
- Container Classes are forbidden — export individual functions and constants.

### Result Pattern (Mandatory for Business Logic)

```typescript
// Define once, reuse everywhere
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E }

// ✅ Business logic returns Result — no throwing
function calculateDiscount(price: number, code: string): Result<number> {
  if (price <= 0) return { success: false, error: 'Price must be positive' }
  const discount = DISCOUNT_MAP[code]
  if (!discount) return { success: false, error: `Unknown discount code: ${code}` }
  return { success: true, data: price * (1 - discount) }
}

// ✅ Consumer handles both cases explicitly
const result = calculateDiscount(100, 'SAVE20')
if (!result.success) {
  toast.error(result.error)
  return
}
// result.data is narrowed to number here
```

### Zod Boundary Validation (Mandatory for External Input)

```typescript
import { z } from 'zod'

// ✅ Define schema at the boundary
const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  clientId: z.string().uuid('Invalid client ID'),
  budget: z.number().positive().optional(),
})

type CreateProjectInput = z.infer<typeof CreateProjectSchema>

// ✅ Parse at the boundary — never trust raw input
function handleCreateProject(rawData: unknown): Result<Project> {
  const parsed = CreateProjectSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }
  // parsed.data is fully typed and validated
  return createProject(parsed.data)
}
```

> See `references/react-hook-form-zod.md` for form integration with zodResolver.

---

## 3. Server Actions (Next.js)

### Security Template (Mandatory)

```typescript
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  name: z.string().min(1).max(100),
})

export async function createItem(rawData: unknown): Promise<Result<Item>> {
  // 1. Auth check
  const session = await auth()
  if (!session) return { success: false, error: 'Unauthorized' }

  // 2. Validate input
  const parsed = schema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: 'Validation failed' }

  // 3. Business logic with error handling
  try {
    const item = await db.items.create({ data: parsed.data })
    revalidatePath('/items')
    return { success: true, data: item }
  } catch (error) {
    return { success: false, error: 'Database error' }
  }
  // ⚠️ NEVER put redirect() inside try-catch — it throws!
}
```

> See `references/vercel-nextjs-patterns.md` for the `redirect()` gotcha.

---

## 4. Data Fetching Patterns

### Server Components (Default)

```typescript
// ✅ Direct async — no useEffect, no useState
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // Next.js 15: params is async
  const project = await getProject(id)
  if (!project) notFound()
  return <ProjectView project={project} />
}
```

### Parallel Fetching (Mandatory — No Waterfalls)

```typescript
// ❌ BAD — sequential
const user = await getUser(id)
const projects = await getProjects(id) // waits for user

// ✅ GOOD — parallel
const [user, projects] = await Promise.all([
  getUser(id),
  getProjects(id),
])
```

### Client State (TanStack Query)

```typescript
// ✅ queryOptions factory (v5)
export const projectQueryOptions = (id: string) => queryOptions({
  queryKey: ['projects', id],
  queryFn: () => getProject(id),
})

// ✅ Optimistic mutation
export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProject,
    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ['projects', updated.id] })
      const previous = queryClient.getQueryData(['projects', updated.id])
      queryClient.setQueryData(['projects', updated.id], updated)
      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['projects', context?.previous?.id], context?.previous)
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ['projects', vars.id] })
    },
  })
}
```

> See `references/tanstack-query.md` for full optimistic update patterns.

---

## 5. Error Handling

### Hierarchy

| Layer | Pattern | Example |
|---|---|---|
| **Business Logic** | Result Pattern | `{ success: false, error: 'Not found' }` |
| **Server Actions** | Result + Zod | Auth → Validate → try/catch → Result |
| **API Routes** | NextResponse + status codes | `NextResponse.json({ error }, { status: 400 })` |
| **UI Components** | Error boundaries + toast | `error.tsx`, `toast.error()` |
| **Forms** | `setError()` from RHF | Field-level + root-level errors |

### try-catch Rules

```typescript
// ✅ Catch specific, return Result
try {
  const data = await db.query(...)
  return { success: true, data }
} catch (error) {
  // Log for debugging, return safe error for consumer
  console.error('[createItem]', error)
  return { success: false, error: 'Failed to create item' }
}

// ❌ NEVER catch-and-ignore
try { riskyOperation() } catch {} // Forbidden

// ❌ NEVER catch navigation errors
// redirect() and notFound() throw — don't put them in try-catch!
```

---

## 6. High-Performance React

- **GPU-Accelerated Motion**: Strictly use `transform` and `opacity` for animations.
- **Avoid Waterfall Fetches**: Use `Promise.all` or parallel server components.
- **Derived State**: Calculate values during render. Avoid `useEffect` for syncing state.
- **Memoization**: Use `useMemo`/`useCallback` only when profiling identifies a bottleneck.
- **Dynamic Imports**: Use `next/dynamic` for components > 30KB or below the fold.
- **Server Components Default**: Only add `"use client"` when hooks or browser APIs are needed.

---

## 7. Module Organization

```
src/
├── lib/           # Pure business logic, utilities, types
│   ├── types.ts   # Shared types and Zod schemas
│   ├── utils.ts   # Pure helper functions
│   └── result.ts  # Result type definition
├── actions/       # Server Actions (auth + validate + execute)
├── hooks/         # Custom React hooks (TanStack Query wrappers)
├── components/    # UI components (see component-architecture skill)
└── app/           # Next.js routes (thin — delegate to components)
```

### File Size Rules
- **Target**: 300–400 lines per file
- **Hard limit**: 500 lines requires refactoring or explicit justification
- **Hooks**: 150–200 lines max
- **One responsibility per file** — god-files are forbidden
