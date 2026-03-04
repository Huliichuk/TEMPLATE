---
description: Build UI pages and components without style drift. Use when implementing or extending product interfaces.
---

# UI Build Workflow

Purpose: Build modern, high-quality UI that stays consistent with the product design system. Covers both new components and new pages.

---

## Step 1 — Read the existing system

- Identify existing tokens (CSS custom properties, Tailwind theme)
- Identify existing UI primitives (shadcn/ui + local wrappers)
- Identify layout patterns used in current pages
- Identify existing motion tooling (Framer Motion usage, animation helpers)
- If tokens/components do not exist yet — create minimal set first

---

## Step 2 — Define visual and motion direction

- List the UI elements needed (forms, buttons, tables, dialogs)
- Decide what can be composed from existing components
- Reuse existing patterns whenever possible
- Define a clear art direction (conservative system-match vs modern showcase)
- Define motion plan:
  - entry/reveal behavior
  - hover/tap behavior
  - scroll/parallax behavior
  - reduced-motion fallback

---

## Step 3 — Component-first implementation

- Implement or extend reusable components before pages
- Pages should be thin and composed from components
- No duplicated UI patterns across pages
- Components must be small, focused, and reusable

---

## Step 4 — Apply modern interaction quality

- Ensure no random colors, spacing, font sizes
- Ensure Tailwind + tokens are used consistently
- Ensure no inline styles for visual design
- Compare new UI with existing UI — refactor drift if detected
- Use meaningful animation only (avoid motion noise)
- Keep parallax subtle and transform-based

---

## Step 5 — Performance and accessibility verification

- Respect `prefers-reduced-motion`
- Keep touch targets at least 44x44px
- Validate keyboard focus states on interactive elements
- Check for animation-induced jank on mobile and desktop
- Ensure contrast remains valid with gradients/overlays

---

## Output

- Short summary:
  - which tokens/primitives were used or added
  - which motion/parallax behaviors were added
  - how reduced-motion fallback was handled
  - which reusable components were introduced or extended
  - where the new UI lives
