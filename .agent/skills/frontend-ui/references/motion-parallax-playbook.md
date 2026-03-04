---
name: motion-parallax-playbook
description: Practical Framer Motion and CSS patterns for premium UI animation, scroll reveal, and parallax effects with accessibility and performance safeguards.
---

# Motion and Parallax Playbook

## 1. Motion Tokens

Use shared motion tokens to keep behavior consistent:

- Fast interaction: 120-180ms
- Standard transition: 220-320ms
- Section reveal: 450-700ms
- Easing: ease-out curves for entry, ease-in-out for state changes

Define reusable constants in TypeScript where possible:

```ts
export const MOTION = {
  fast: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
  base: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  reveal: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const;
```

## 2. Staggered Reveal Pattern

Use for hero blocks, feature grids, and onboarding sections:

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

## 3. Scroll Reveal

Use `whileInView` with viewport thresholds to avoid triggering too early:

```tsx
<motion.section
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{ duration: 0.6 }}
/>
```

## 4. Parallax Hero Pattern

Use subtle offset only. Start with conservative range:

```tsx
const { scrollYProgress } = useScroll();
const ySlow = useTransform(scrollYProgress, [0, 1], [0, -40]);
const yFast = useTransform(scrollYProgress, [0, 1], [0, -90]);

<motion.div style={{ y: ySlow }} />
<motion.div style={{ y: yFast }} />
```

Guidelines:
- 8-40px for subtle layers.
- 40-120px for large hero art only.
- Keep copy layers more stable than decorative layers.

## 5. Reduced Motion Fallback

Always gate strong motion with user preference:

```tsx
const shouldReduceMotion = useReducedMotion();

const cardInitial = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
const cardAnimate = { opacity: 1, y: 0 };
```

For CSS-based effects:

```css
@media (prefers-reduced-motion: reduce) {
  .parallax-layer {
    transform: none !important;
    transition: none !important;
  }
}
```

## 6. Performance Checklist

Before shipping motion/parallax:

- Animate transform/opacity, avoid layout properties.
- Avoid large animated box-shadows and filters.
- Keep scroll-linked calculations minimal.
- Test on mobile hardware and low-power mode.
- Confirm no visible frame drops in long sections.

## 7. Anti-Patterns

Avoid these:

- Parallax on every section by default.
- `transition: all`.
- Huge background blur animations.
- Continuous infinite motion that distracts from content.
- Motion with no reduced-motion alternative.
