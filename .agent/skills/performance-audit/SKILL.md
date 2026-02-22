---
name: performance-audit
description: Advanced skill for identifying and fixing performance bottlenecks in web applications. Includes profiling, rendering optimization, and network efficiency.
---

# Performance Audit Skill

This skill provides a systematic approach to auditing and optimizing the performance of high-end web applications.

## When to Use
- Implementing complex UI components or animations
- Auditing existing pages for slow load times or jank
- Optimizing data fetching strategies in Next.js Server Components
- Before deploying major new features to production

---

## 1. Core Web Vitals Targets

| Metric | Target | What It Measures |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Main content load time |
| **INP** (Interaction to Next Paint) | < 200ms | Input responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |
| **FCP** (First Contentful Paint) | < 1.8s | First visible paint |
| **TTFB** (Time to First Byte) | < 800ms | Server response time |

> These are Google's "Good" thresholds. Anything below = production-ready.

---

## 2. Rendering Optimization

### React Selective Hydration
- Use `Suspense` boundaries around heavy components
- Use `next/dynamic` with `{ ssr: false }` for client-only components
- Stream server components to show content progressively

### Animation Performance
- **GPU-only properties**: `transform`, `opacity` — avoid animating `width`, `height`, `top`, `left`
- **`will-change`**: Apply sparingly to known animated elements: `will-change: transform`
- **`content-visibility: auto`**: For long pages, skip rendering off-screen sections
- **LazyMotion**: Reduces Motion bundle from 34KB → 4.6KB (see `motion-framer.md`)

### Avoid Over-rendering
- `useMemo`/`useCallback` only when profiling confirms a bottleneck
- Move state down — keep it close to where it's used
- Derive state during render — no `useEffect` for computed values

---

## 3. Data Fetching (Next.js 15)

### Parallel Fetching

```typescript
// ❌ Sequential — 600ms total
const user = await getUser(id)      // 300ms
const projects = await getProjects(id) // 300ms

// ✅ Parallel — 300ms total
const [user, projects] = await Promise.all([
  getUser(id),
  getProjects(id),
])
```

### Server Component Streaming

```tsx
export default async function Page() {
  return (
    <>
      {/* Renders immediately */}
      <Header />

      {/* Streams when ready */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsPanel />
      </Suspense>
    </>
  )
}
```

### Optimal Serialization
- Keep server → client props small (< 1KB ideal)
- Never pass full DB objects — select only needed fields
- Use `pick()` or Zod `.pick()` to enforce shape

---

## 4. Asset & Bundle Efficiency

### Images
```tsx
import Image from 'next/image'

<Image
  src="/hero.webp"
  alt="Hero"
  width={1200}
  height={630}
  priority          // Above-the-fold only
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={85}
/>
```

### Fonts
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',    // Prevents FOIT (Flash of Invisible Text)
  variable: '--font-inter',
})
```

### Bundle Splitting
```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})
```

### Tree-Shaking Rules
- **Direct imports**: `import { Button } from '@/components/ui/button'`
- **No barrel exports**: Avoid `import { ... } from '.'` in large directories
- **Analyze**: `ANALYZE=true next build` with `@next/bundle-analyzer`

---

## 5. Audit Workflow

```
1. Measure  → Lighthouse (lab) + CrUX (field) → identify worst metric
2. Network  → DevTools Network tab → find waterfalls, large payloads
3. Profile  → React DevTools Profiler → identify slow renders
4. Bundle   → ANALYZE=true next build → find heavy dependencies
5. Fix      → Apply minimal change (Small Change Principle)
6. Verify   → Re-run Lighthouse → confirm metric improvement
```

### Lighthouse Commands

```bash
# Lab audit (local)
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse.json

# Bundle analysis
ANALYZE=true npm run build
```

---

## 6. Common Bottleneck Fixes

| Symptom | Likely Cause | Fix |
|---|---|---|
| LCP > 2.5s | Large hero image, no priority | Add `priority` to LCP image, serve WebP |
| CLS > 0.1 | Images without dimensions | Always set `width`/`height` on `<Image>` |
| INP > 200ms | Heavy JS on interaction | Move logic to server action or Web Worker |
| Large bundle | Barrel imports, full library | Direct imports, `next/dynamic` |
| Waterfall fetches | Sequential awaits | `Promise.all()` |
| Layout thrashing | Animating box model | Use `transform` only |

## Constraints
- Do NOT perform premature optimizations
- All optimizations must be justified by data or known patterns
- Measure BEFORE and AFTER every change
- Never sacrifice readability for marginal perf gains
