---
name: testing
description: Testing patterns for Next.js applications with Vitest, React Testing Library, MSW, and Playwright. Covers unit, integration, and E2E testing.
---

# Testing Skill

## Overview

This skill defines **testing standards** for all code in the project. Testing is not optional — critical business logic, data transformations, and user-facing workflows MUST be covered.

### When to Use
- Creating new features (write tests alongside implementation)
- Fixing bugs (write a failing test first, then fix)
- Refactoring (ensure existing tests pass before and after)
- Adding Server Actions or API routes

---

## 1. Testing Stack

| Tool | Purpose | Package |
|---|---|---|
| **Vitest** | Unit/integration test runner | `vitest` |
| **React Testing Library** | Component testing | `@testing-library/react` |
| **MSW** | API mocking | `msw` |
| **Playwright** | E2E browser testing | `@playwright/test` |
| **user-event** | Realistic user interactions | `@testing-library/user-event` |

---

## 2. File Organization

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts      # Unit tests next to source
├── actions/
│   ├── create-project.ts
│   └── __tests__/
│       └── create-project.test.ts
├── components/
│   ├── ProjectCard.tsx
│   └── __tests__/
│       └── ProjectCard.test.tsx
├── hooks/
│   ├── use-projects.ts
│   └── __tests__/
│       └── use-projects.test.ts
└── e2e/                        # Playwright E2E tests
    ├── auth.spec.ts
    └── projects.spec.ts
```

**Rules:**
- Test files live in `__tests__/` directories next to source
- Use `.test.ts` for unit/integration, `.spec.ts` for E2E
- One test file per source file

---

## 3. Unit Tests (Vitest)

### Pure Function Testing

```typescript
// lib/__tests__/calculate-total.test.ts
import { describe, it, expect } from 'vitest'
import { calculateTotal } from '../calculate-total'

describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    const result = calculateTotal({ price: 100, quantity: 2, taxRate: 0.21 })
    expect(result).toBe(242)
  })

  it('should handle zero quantity', () => {
    const result = calculateTotal({ price: 100, quantity: 0, taxRate: 0.21 })
    expect(result).toBe(0)
  })

  it('should handle negative prices gracefully', () => {
    const result = calculateTotal({ price: -100, quantity: 1, taxRate: 0.21 })
    expect(result).toEqual({ success: false, error: 'Price must be positive' })
  })
})
```

### Result Pattern Testing

```typescript
import { describe, it, expect } from 'vitest'
import { validateDiscount } from '../discounts'

describe('validateDiscount', () => {
  it('should return success for valid code', () => {
    const result = validateDiscount('SAVE20')
    expect(result).toEqual({ success: true, data: 0.2 })
  })

  it('should return error for invalid code', () => {
    const result = validateDiscount('INVALID')
    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('Unknown'),
    })
  })
})
```

### Zod Schema Testing

```typescript
import { describe, it, expect } from 'vitest'
import { CreateProjectSchema } from '../schemas'

describe('CreateProjectSchema', () => {
  it('should accept valid input', () => {
    const result = CreateProjectSchema.safeParse({
      name: 'My Project',
      clientId: '550e8400-e29b-41d4-a716-446655440000',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty name', () => {
    const result = CreateProjectSchema.safeParse({ name: '', clientId: 'valid-uuid' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid UUID', () => {
    const result = CreateProjectSchema.safeParse({ name: 'Test', clientId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })
})
```

---

## 4. Component Tests (React Testing Library)

### Principles
- Test **behavior**, not implementation details
- Query by **role**, **label**, or **text** — never by CSS class or test ID
- Use `user-event` over `fireEvent` for realistic interactions

```typescript
// components/__tests__/ProjectCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCard } from '../ProjectCard'

describe('ProjectCard', () => {
  const defaultProps = {
    name: 'Test Project',
    status: 'active' as const,
    onDelete: vi.fn(),
  }

  it('should render project name', () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectCard {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(defaultProps.onDelete).toHaveBeenCalledOnce()
  })

  it('should show confirmation dialog before delete', async () => {
    const user = userEvent.setup()
    render(<ProjectCard {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('should handle loading state', () => {
    render(<ProjectCard {...defaultProps} isLoading />)
    expect(screen.getByRole('status')).toBeInTheDocument() // Skeleton
  })
})
```

### Query Priority (Mandatory)

```
1. getByRole       — Accessible queries (buttons, links, inputs)
2. getByLabelText  — Form elements
3. getByText       — Static content
4. getByPlaceholder— Input hints
5. getByTestId     — LAST RESORT only
```

---

## 5. API Mocking (MSW)

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json([
      { id: '1', name: 'Project Alpha', status: 'active' },
      { id: '2', name: 'Project Beta', status: 'draft' },
    ])
  }),

  http.post('/api/projects', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: '3', ...body, status: 'draft' },
      { status: 201 }
    )
  }),

  http.delete('/api/projects/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 })
  }),
]

// mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Override for Specific Tests

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'

it('should handle API error', async () => {
  server.use(
    http.get('/api/projects', () => {
      return HttpResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    })
  )
  // ... test error handling UI
})
```

---

## 6. E2E Tests (Playwright)

```typescript
// e2e/projects.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Projects', () => {
  test('should create a new project', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('button', { name: /new project/i }).click()

    await page.getByLabel('Name').fill('Integration Test Project')
    await page.getByRole('button', { name: /create/i }).click()

    // Verify redirect and success
    await expect(page).toHaveURL(/\/projects\/[\w-]+/)
    await expect(page.getByText('Integration Test Project')).toBeVisible()
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/projects/new')
    await page.getByRole('button', { name: /create/i }).click()

    await expect(page.getByText(/name is required/i)).toBeVisible()
  })
})
```

---

## 7. Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**', 'src/actions/**', 'src/hooks/**'],
      exclude: ['**/__tests__/**', '**/*.d.ts'],
    },
  },
})
```

---

## 8. What to Test (Priority)

| Priority | What | Example |
|---|---|---|
| 🔴 **Must** | Business logic & data transformations | `calculateTotal`, `formatCurrency` |
| 🔴 **Must** | Zod schemas & validation | All `CreateXSchema`, `UpdateXSchema` |
| 🔴 **Must** | Server Actions (auth + validation) | `createProject`, `deleteInvoice` |
| 🟡 **Should** | Component behavior (user flows) | Form submission, error display |
| 🟡 **Should** | Custom hooks (TanStack Query) | Optimistic updates, cache invalidation |
| 🟢 **Nice** | E2E critical paths | Login → Create → View → Delete |
| ⚪ **Skip** | Pure UI rendering (no logic) | Static cards, layout components |

## Rules

- **Test behavior, not implementation** — test what the user sees, not internal state
- **Arrange-Act-Assert** — every test follows this structure
- **One assertion per concept** — multiple `expect()` is fine if testing one logical scenario
- **No `test.skip`** — fix or delete broken tests, never skip
- **Deterministic** — no `Math.random()`, `Date.now()`, or network in unit tests
- **Fast** — unit tests must complete in < 5 seconds total
