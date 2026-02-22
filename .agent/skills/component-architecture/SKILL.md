---
name: Component Architecture
description: Patterns for building TypeScript React components with modern UI libraries
---

# Component Architecture Skill

## When to Use
- Creating new UI components
- Refactoring existing components
- Building form components
- Creating data display components

## Component Structure Pattern

### File Organization
```
src/components/
├── ui/                    # UI primitives (shadcn/ui, etc.)
├── layout/                # Layout components (TopBar, Sidebar, etc.)
├── <feature>/             # Feature-specific components
│   ├── FeatureForm.tsx
│   ├── FeatureList.tsx
│   └── use-feature-form.ts  # Hook for form logic
└── shared/                # Reusable across features
```

### Component Template
```tsx
"use client"  // Only if uses browser APIs, hooks, or event handlers

import { cn } from "@/lib/utils"

interface MyComponentProps {
  title: string
  onAction?: () => void
  className?: string
}

export function MyComponent({ title, onAction, className }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {onAction && (
        <Button onClick={onAction}>Action</Button>
      )}
    </div>
  )
}
```

### Hook Extraction Pattern
When a component exceeds ~200 lines, extract logic into a hook:

```tsx
// use-feature-form.ts
export function useFeatureForm(initialData?: Feature) {
  const [formData, setFormData] = useState(initialData)
  // ... all state, handlers, validation logic
  return { formData, setFormData, handleSubmit, errors }
}

// FeatureForm.tsx — pure rendering
export function FeatureForm({ initialData }: Props) {
  const { formData, handleSubmit, errors } = useFeatureForm(initialData)
  return <form onSubmit={handleSubmit}>...</form>
}
```

## Styling Rules

### Utility-First CSS (Tailwind)
- ✅ `className="flex items-center gap-2 p-4 bg-background"`
- ❌ No inline styles: `style={{ display: 'flex' }}`
- ❌ No CSS modules unless project convention

### UI Library Components
- Import from designated UI directory (e.g., `@/components/ui/`)
- Use `cn()` for conditional classes
- Extend via composition, not modification

### Dark Mode
- Use semantic colors: `bg-background`, `text-foreground`
- Avoid hardcoded colors: ❌ `bg-white`, ✅ `bg-background`

## Next.js 15 Async Request APIs

In Next.js 15, certain APIs are now asynchronous. Always `await` them.

### Page Params & SearchParams
```tsx
// Page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query: string }>
}) {
  const { id } = await params
  const { query } = await searchParams
  return <div>{id}: {query}</div>
}
```

### Cookies & Headers
```tsx
import { cookies, headers } from "next/headers"

export async function MyServerComponent() {
  const cookieStore = await cookies()
  const headerList = await headers()
  const theme = cookieStore.get("theme")
  return <div>{theme}</div>
}
```

## Styling Rules

### Utility-First CSS (Tailwind)
- ✅ `className="flex items-center gap-2 p-4 bg-background"`
- ❌ No inline styles: `style={{ display: 'flex' }}`

### UI Library Components
- Import from designated UI directory (e.g., `@/components/ui/`)
- Use `cn()` for conditional classes
- Ensure standard, clean, and accessible UI patterns matching shadcn.

## Server vs Client Components (Next.js App Router)

### Server Components (default)
- Data fetching
- Static content
- Access to secure resources (DB, secrets)
- No hooks, no browser APIs
- Can `await` directly

### Client Components (`"use client"`)
- Required for: `useState`, `useEffect`, `onClick`, browser APIs.
- Keep as small as possible.
- Pass server data via props or use `use` hook in React 19.

## File Size Rules
- Component: 300-400 lines max (as per GEMINI.md)
- If > 500 lines → refactor or explicit justification required.
- Hook: 150-200 lines max.
