---
name: tailwind-patterns
description: Tailwind CSS best practices for mobile-first responsive design, class optimization, and component extraction. Reference material from /ruchernchong/claude-kit (score 8.8).
source: https://github.com/ruchernchong/claude-kit/blob/main/skills/tailwind/SKILL.md
---

# Tailwind CSS Patterns — Reference

## Mobile-First Responsive Design (MANDATORY)

```tsx
// ❌ BAD — desktop-first (scaling down)
<div className="text-2xl md:text-xl sm:text-lg">

// ✅ GOOD — mobile-first (scaling up)
<div className="text-lg md:text-xl lg:text-2xl">
```

## Responsive Components

```tsx
// Responsive button
<Button className="text-sm md:text-base lg:text-lg px-3 md:px-4 lg:px-6">
  Responsive Button
</Button>
```

## Class Optimization

```tsx
// ❌ BAD — redundant classes
<div className="p-4 px-4 py-4 p-6">

// ✅ GOOD — single source of truth
<div className="p-6">

// ❌ BAD — verbose
<div className="mt-4 mr-4 mb-4 ml-4">

// ✅ GOOD — shorthand
<div className="m-4">
```

## Extract Repeated Patterns

```css
/* Before — repeated across components */
/* <div className="rounded-xl border border-border/60 bg-surface p-4"> */

/* After — extract to @layer */
@layer components {
  .card {
    @apply rounded-xl border border-border/60 bg-surface p-4;
  }
}
```

## Rules

- **Always** use mobile-first approach (scale UP, not down)
- **Never** use redundant utility classes
- **Extract** repeated patterns to `@layer components`
- **Use** shorthand utilities (`m-4` over `mt-4 mr-4 mb-4 ml-4`)
- **Prefer** CSS variables for theming consistency
