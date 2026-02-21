---
name: motion-framer
description: Motion (formerly Framer Motion) animation library patterns — gesture, scroll, layout, SVG, exit animations, bundle optimization. Score 9.7.
source: https://github.com/jezweb/claude-skills (score 9.7)
---

# Motion (Framer Motion) — Reference

## When to Use Motion vs AutoAnimate

```
Need gestures (drag, hover, tap)?    → Motion
Need scroll-based animations?        → Motion
Need shared element transitions?     → Motion
Need SVG path morphing?              → Motion
Just list add/remove/sort?           → AutoAnimate
Accordion/collapse/expand?           → AutoAnimate (unless custom physics)
Want zero configuration?             → AutoAnimate
Everything else?                     → Motion
```

## Key Capabilities

- **Gestures**: drag, hover, tap, pan, focus — cross-device
- **Scroll**: viewport-triggered, scroll-linked, parallax
- **Layout**: FLIP technique, shared element transitions
- **Spring Physics**: natural, customizable
- **SVG**: path morphing, line drawing
- **Exit**: AnimatePresence for unmount transitions
- **Bundle**: 2.3 KB (useAnimate mini) → 34 KB (full), LazyMotion = 4.6 KB

## Use Cases

| Category | Examples |
|---|---|
| **Complex Interactions** | Drag-and-drop, kanban, sortable lists, sliders |
| **Scroll Animations** | Hero parallax, scroll-triggered reveals, progress bars |
| **Layout Transitions** | Card → detail page, expand/collapse, grid/list switching |
| **Advanced** | SVG line drawing, path morphing, staggered sequences, modal dialogs |

## Bundle Optimization

| Import | Size |
|---|---|
| `useAnimate` mini | ~2.3 KB |
| `LazyMotion` | ~4.6 KB |
| Full `motion` | ~34 KB |

## Production Tested

React 19.2, Next.js 16.1, Vite 7.3, Tailwind v4
