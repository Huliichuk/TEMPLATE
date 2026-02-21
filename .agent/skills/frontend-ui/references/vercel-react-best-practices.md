---
name: vercel-react-best-practices
description: 40+ React/Next.js performance rules from Vercel Labs (1.1K installs, score 9.6). Priority-ordered from CRITICAL to LOW impact.
source: https://github.com/vercel-labs/agent-skills (score 9.6)
---

# Vercel React Best Practices — Performance Guide

## Priority Categories

| Priority | Category | Impact |
|---|---|---|
| **CRITICAL** | Eliminating Waterfalls | Parallel data fetching |
| **CRITICAL** | Bundle Size | Tree-shaking, dynamic imports |
| **HIGH** | Server-Side Performance | Caching, parallel RSC fetching |
| **MEDIUM-HIGH** | Client Data Fetching | SWR dedup, event listeners |
| **MEDIUM** | Re-render Optimization | memo, derived state |
| **MEDIUM** | Rendering Performance | content-visibility, hoist JSX |
| **LOW-MEDIUM** | JavaScript Performance | Set/Map lookups, function caching |
| **LOW** | Advanced Patterns | Event handler refs |

## CRITICAL: Eliminating Waterfalls

```tsx
// ❌ BAD — Sequential fetching (waterfall)
export default async function Page() {
  const header = await fetchHeader()       // waits...
  return (
    <div>
      <div>{header}</div>
      <Sidebar />                           // ...then starts
    </div>
  )
}

// ✅ GOOD — Parallel via component composition
export default function Page() {
  return (
    <div>
      <Header />     {/* Both fetch simultaneously */}
      <Sidebar />
    </div>
  )
}

async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

## CRITICAL: Bundle Size

```tsx
// ❌ BAD — barrel imports pull entire module
import { Button, Input } from '@/components'

// ✅ GOOD — direct imports for tree-shaking
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

// ❌ BAD — loaded in initial bundle
import { HeavyChart } from './HeavyChart'

// ✅ GOOD — dynamic import with loading state
import dynamic from 'next/dynamic'
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />
})
```

## HIGH: Next.js Caching Patterns

```tsx
// Static data (like getStaticProps)
const staticData = await fetch('...', { cache: 'force-cache' })

// Dynamic data (like getServerSideProps)
const dynamicData = await fetch('...', { cache: 'no-store' })

// Time-based revalidation (ISR)
const revalidated = await fetch('...', { next: { revalidate: 10 } })
```

### ISR with Dynamic Routes

```tsx
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((post) => ({ id: String(post.id) }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await fetch(`https://api.example.com/posts/${id}`).then(r => r.json())
  return <main><h1>{post.title}</h1></main>
}
```

### Database Query Caching with Tags

```tsx
import { unstable_cache } from 'next/cache'

const getCachedPosts = unstable_cache(
  async () => await db.select().from(posts),
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)
// Invalidate: revalidateTag('posts')
```

## Rules

- **Always** compose RSC for parallel data fetching — never `await` sequentially
- **Always** use direct imports — never barrel imports
- **Use** `dynamic()` for components > 30KB or below the fold
- **Prefer** `unstable_cache` with tags for database queries
- **Set** `revalidate` on routes with semi-static data
