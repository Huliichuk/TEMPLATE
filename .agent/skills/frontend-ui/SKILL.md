---
name: frontend-ui
description: Modern frontend UI and motion system for TypeScript React/Next.js applications. Use when building or refactoring interfaces that need premium visual direction, polished animations, parallax effects, and strong accessibility/performance discipline.
---

# Frontend UI Skill - Modern, Expressive, Production-Safe

## Overview

Build interfaces that look contemporary and intentional, not generic. Default to strong visual hierarchy, clear art direction, and meaningful motion.
Keep implementation aligned with the existing design system, tokens, and component architecture.

## Operating Modes

Choose one mode before implementation:

1. System Match Mode:
- Use for existing product surfaces where visual consistency is priority.
- Extend current UI patterns without introducing a new visual language.

2. Modern Showcase Mode:
- Use when user asks for modern, trendy, premium, bold, or "wow" UI.
- Introduce stronger typography, layered backgrounds, motion staging, and controlled parallax.
- Keep changes coherent and reusable across sections, not one-off effects.

## UI Implementation Contract

Before writing code, define a short plan with:

1. Visual Direction:
- Typography strategy (headline scale, body scale, contrast behavior).
- Color strategy (existing tokens + any new token proposals).
- Depth strategy (cards, overlays, shadows, borders).

2. Motion Direction:
- Entry motion (page load and section reveal).
- Interaction motion (hover, tap, focus, modal/drawer transitions).
- Scroll motion (reveal, progress-driven transforms, parallax amplitude).

3. Responsiveness:
- Mobile baseline at 375px.
- Tablet and desktop adaptation for layout and motion intensity.

If requirements are ambiguous, assume System Match Mode unless user clearly asks for a showcase experience.

## Modern UI Patterns (Current Baseline)

Prefer these patterns when modern styling is requested:

1. Hero with depth:
- Layered gradient or texture background.
- Foreground copy + visual block with slight parallax offset.

2. Bento information layout:
- Asymmetric card hierarchy with clear focal card.
- Subtle hover lift and border/lighting response.

3. Scroll storytelling:
- Staggered reveal by section.
- Sticky anchors for key content transitions.

4. Expressive type:
- Large headline scale with tight tracking.
- Balanced line breaks and readable body contrast.

5. Atmospheric background:
- Soft gradients, light noise, geometric accents.
- No visual clutter that competes with content legibility.

## Motion and Parallax Rules

Use motion to support comprehension and premium feel, not decoration noise.

1. Preferred tooling:
- Use existing Framer Motion setup in this repo for complex choreography.
- Use Tailwind/CSS transitions for simple hover and state changes.

2. Safe motion defaults:
- Enter transitions: 0.4s to 0.8s.
- Micro-interactions: 0.12s to 0.24s.
- Use smooth easing (`easeOut`, cubic-bezier style curves).

3. Parallax discipline:
- Keep amplitude subtle (typically 8px to 40px depending on section size).
- Favor transform-based motion (`translate`, `scale`, `opacity`).
- Avoid layout-thrashing properties and aggressive blur animations.

4. Reduced motion:
- Always respect `prefers-reduced-motion`.
- Provide static fallback for parallax and reveal sequences.

5. Mobile interaction constraints:
- Reduce or disable heavy parallax on coarse pointers/touch devices.
- Keep touch targets at least 44x44px.

## Performance and Quality Guardrails

1. Performance:
- Animate `transform` and `opacity` first.
- Limit simultaneous animated elements in viewport.
- Avoid long scroll-linked chains that impact main thread.
- Lazy-load below-the-fold media and heavy sections.

2. Accessibility:
- Maintain keyboard focus visibility.
- Preserve readable contrast under overlays/gradients.
- Do not encode meaning using motion alone.

3. Architecture:
- Build reusable motion primitives/components where repeated.
- Keep pages thin; move complex animation logic into focused components/hooks.
- Keep TypeScript strict and explicit for component props and variants.

## Output Requirements

When delivering UI work, summarize:

1. Visual direction applied.
2. Motion/parallax behaviors added.
3. Accessibility and reduced-motion handling.
4. Performance safeguards used.
5. Files/components introduced or updated.

## References

Use these references as needed:

- `references/motion-parallax-playbook.md` for motion and parallax implementation patterns.
- `references/design-system-tokens.md` for token usage and consistency.
- `references/tailwind-v4-shadcn.md` for component and utility conventions.
- `references/vercel-web-guidelines.md` for UX, accessibility, and performance checks.
