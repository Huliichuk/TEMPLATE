---
description: Build UI pages and components without style drift
---

# UI Build Workflow

Purpose: Build UI that is consistent across the product. Covers both new components and new pages.

---

## Step 1 — Read the existing system

- Identify existing tokens (CSS custom properties, Tailwind theme)
- Identify existing UI primitives (shadcn/ui + local wrappers)
- Identify layout patterns used in current pages
- If tokens/components do not exist yet — create minimal set first

---

## Step 2 — Define requirements

- List the UI elements needed (forms, buttons, tables, dialogs)
- Decide what can be composed from existing components
- Reuse existing patterns whenever possible

---

## Step 3 — Component-first implementation

- Implement or extend reusable components before pages
- Pages should be thin and composed from components
- No duplicated UI patterns across pages
- Components must be small, focused, and reusable

---

## Step 4 — Consistency check

- Ensure no random colors, spacing, font sizes
- Ensure Tailwind + tokens are used consistently
- Ensure no inline styles for visual design
- Compare new UI with existing UI — refactor drift if detected

---

## Step 5 — Zero-Slop & Aesthetics Polish

- Implement glassmorphism using `backdrop-blur` and semi-transparent borders.
- Add mesh gradients for depth.
- Ensure all animations use GPU-accelerated properties (`transform`, `opacity`).
- **NanoBanana**: Generate custom high-end assets using `generate_image` instead of using placeholders.

---

## Output

- Short summary:
  - which tokens/primitives were used or added
  - which reusable components were introduced or extended
  - where the new UI lives
