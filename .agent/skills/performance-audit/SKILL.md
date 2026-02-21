---
name: performance-audit
description: Advanced skill for identifying and fixing performance bottlenecks in web applications. Includes profiling, rendering optimization, and network efficiency.
---

# Performance Audit Skill

This skill provides a systematic approach to auditing and optimizing the performance of high-end web applications.

## When to Use
- Implementing complex UI components or animations.
- Auditing existing pages for slow load times or jank.
- Optimizing data fetching strategies in Next.js Server Components.

## Core Pillars

### 1. Rendering Optimization
- **React Selective Hydration**: Use `Suspense` and `dynamic()` to prevent blocking hydration.
- **Micro-animations**: Ensure all motion follows Section 10 of `GEMINI.md` (GPU-accelerated transforms).
- **Avoid Over-rendering**: Use `useMemo`, `useCallback`, and component memoization only where profiling identifies a bottleneck.

### 2. Data Fetching (Next.js 15)
- **Parallel Fetching**: Prefer `Promise.all()` over multiple awaited fetches to avoid waterfalls.
- **Server Component Streaming**: Leverage `fetch` cache and streaming `Suspense` boundaries.
- **Optimal Serialization**: Keep props small and avoid passing large, unused data objects from server to client.

### 3. Asset & Bundle Efficiency
- **Image Optimization**: Use `next/image` with proper `priority`, `loading`, and `sizes`.
- **Dynamic Imports**: Split large libraries or non-critical components into dynamic chunks.
- **Font Optimization**: Use `next/font` for zero CLS (Cumulative Layout Shift).

## Audit Workflow
1. **Initial Assessment**: Run Lighthouse or use browser devtools to identify slow frames.
2. **Network Analysis**: Check for waterfall requests or large payloads.
3. **Execution Profiling**: Identify slow JS execution or long-running tasks.
4. **Remediation**: Apply the minimal set of changes (The "Small Change" Principle) to address the primary bottleneck.

## Constraints
- Do NOT perform premature optimizations.
- All optimizations must be justified by data or known performance patterns.
