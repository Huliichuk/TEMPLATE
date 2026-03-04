---
description: Build modern showcase-grade UI with premium motion and controlled parallax. Use when the user requests bold, trendy, wow-style interfaces.
---

# UI Showcase Workflow

Purpose: Ship a modern, visually strong interface with high-quality animation and parallax, while staying production-safe.

---

## Step 1 - Define Showcase Direction

- Confirm target tone in one line: minimal premium, editorial, futuristic, playful, or corporate-luxury.
- Confirm page goal: marketing landing, product launch, portfolio, feature reveal, or campaign page.
- Confirm conversion target: signup, demo booking, pricing click, or content engagement.

---

## Step 2 - Build Section Blueprint

Use this baseline composition unless user asks otherwise:

1. Hero:
- Large headline, short supporting copy, one primary CTA.
- Layered visual background (gradient + texture/noise + shape accents).

2. Value Strip:
- 3-5 key value points with compact icon + copy.

3. Bento Features:
- Asymmetric grid with one dominant card and supporting cards.

4. Story/Proof:
- Testimonials, stats, case outcomes, or integration logos.

5. Deep CTA:
- Strong closing section with clear single action.

---

## Step 3 - Motion and Parallax Plan

Use Framer Motion for choreography and CSS transitions for micro-interactions.

Required motion layers:

1. Entry Motion:
- Staggered reveal for hero and first content block.

2. Interaction Motion:
- Button/card hover and active states.
- Modal/drawer transitions if used.

3. Scroll Motion:
- Section reveal by viewport.
- Subtle parallax for decorative layers and hero art.

Parallax constraints:
- Keep transform-based.
- Typical vertical range 8-40px; only large hero visuals can go higher.
- Keep text layers stable; move decorative layers more.

Reduced motion:
- Respect `prefers-reduced-motion`.
- Disable parallax and heavy transitions when reduced-motion is enabled.

---

## Step 4 - Implement with System Discipline

- Keep existing token system and Tailwind conventions.
- Reuse shadcn primitives before adding custom primitives.
- Keep page components thin; extract repeated animation patterns into reusable UI units.
- Use TypeScript with explicit props/interfaces for custom showcase components.

---

## Step 5 - Quality Verification

Before finalizing:

- Check mobile first at 375px and no horizontal overflow.
- Ensure touch targets are at least 44x44px.
- Validate focus visibility and keyboard navigation.
- Verify smoothness on long scrolls (no noticeable jank).
- Confirm readable contrast on gradient/overlay sections.
- Confirm reduced-motion fallback works.

---

## Output

Provide:

1. Visual direction summary.
2. Section map implemented.
3. Motion/parallax behaviors implemented.
4. Accessibility/performance safeguards applied.
5. Files added or changed.
