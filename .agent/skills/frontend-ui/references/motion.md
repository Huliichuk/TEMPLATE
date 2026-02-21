# Motion & Animation Patterns

Motion should feel purposeful, physical, and fluid. Use it to guide the eye, reinforce spatial relationships, and make the interface feel alive.

> [!IMPORTANT]
> **GPU-Only Rule**: ALWAYS animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Violation causes layout thrashing and jank.

---

## 1. Parallax Effects

### 1.1 CSS-Only Parallax (`perspective`)
The lightest approach. Uses CSS 3D transforms to create depth layers.

```tsx
<div className="h-screen overflow-x-hidden overflow-y-auto [perspective:10px]">
  <div className="relative flex h-full items-center justify-center [transform-style:preserve-3d]">
    {/* Background layer — moves slower */}
    <div className="absolute inset-0 -z-10 [transform:translateZ(-10px)_scale(2)]">
      <div className="h-full w-full bg-[url('/hero-bg.webp')] bg-cover bg-center" />
    </div>
    {/* Foreground — normal speed */}
    <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
      Parallax Hero
    </h1>
  </div>
</div>
```

### 1.2 CSS Scroll-Driven Parallax
Modern, high-performance. Runs off-main-thread via the compositor.

```css
.parallax-slow {
  animation: parallaxShift linear both;
  animation-timeline: scroll();
}
@keyframes parallaxShift {
  from { transform: translateY(0); }
  to { transform: translateY(-100px); }
}

.parallax-fast {
  animation: parallaxShift linear both;
  animation-timeline: scroll();
}
@keyframes parallaxShiftFast {
  from { transform: translateY(0); }
  to { transform: translateY(-250px); }
}
```

### 1.3 Framer Motion `useScroll` Parallax
Declarative, React-friendly, with spring physics.

```tsx
"use client";
import { motion, useScroll, useTransform } from 'framer-motion';

export function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div style={{ y }} className="relative">
      {/* Content that moves with parallax */}
    </motion.div>
  );
}
```

---

## 2. Scroll Reveal Animations

### 2.1 CSS `view()` Timeline (Preferred)
Zero JS. Elements animate as they enter the viewport.

```css
.reveal-up {
  animation: revealUp ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2.2 Framer Motion `whileInView`
For complex orchestration (staggered lists, spring physics).

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ type: "spring", stiffness: 300, damping: 24 }}
>
  {/* Content */}
</motion.div>
```

### 2.3 Staggered Children

```tsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};
```

---

## 3. Micro-Interactions (Mandatory on ALL Interactive Elements)

### Hover + Press + Focus States
```tsx
<button className="
  transition-all duration-200 ease-out
  hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20
  active:scale-[0.98]
  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
">
  Click Me
</button>
```

### Magnetic Pull Effect
See `SKILL.md` Section 4.1 for full implementation.

### Border Glow on Hover
```tsx
<div className="
  relative rounded-xl border border-white/10 bg-white/5 p-6
  transition-all duration-300
  hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]
">
  {/* Card content */}
</div>
```

---

## 4. Page Transition Animations (Next.js App Router)

Use Framer Motion `AnimatePresence` with Next.js `template.tsx`:

```tsx
// app/template.tsx
"use client";
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Infinite Marquee (Social Proof / Logos)

```tsx
<div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
  <motion.div
    className="flex shrink-0 gap-8"
    animate={{ x: [0, "-50%"] }}
    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  >
    {[...logos, ...logos].map((logo, i) => (
      <div key={i} className="flex-shrink-0">{logo}</div>
    ))}
  </motion.div>
</div>
```

---

## 6. Performance & Accessibility

- **`LazyMotion`**: Always wrap Framer Motion usage in `<LazyMotion features={domAnimation}>` to tree-shake unused features.
- **`prefers-reduced-motion`**: Wrap ALL motion in `motion-safe:` (Tailwind) or conditionally disable via `useReducedMotion()` hook.
- **Duration Guidelines**: 150–250ms for micro UI (buttons, toggles), 250–400ms for context switches (modals, page transitions), 500–1000ms for dramatic reveals (hero sections).

---

## 7. Ready-to-Use Components (from NotebookLM Research)

### 7.1 Text Reveal (Staggered Words)
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className = "" }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 },
    },
  };

  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <motion.div ref={ref} style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container} initial="hidden" animate={isInView ? "visible" : "hidden"} className={className}>
      {text.split(" ").map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

### 7.2 Card Hover Lift (Physics-Based)
```tsx
"use client";
import { motion } from "framer-motion";

export function LiftCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-white/10"
    >
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/10 to-transparent" />
      {children}
    </motion.div>
  );
}
```

### 7.3 Scroll-Driven Number Counter
```tsx
"use client";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// Usage: <h2 className="text-4xl font-bold"><Counter value={5000} />+ Users</h2>
```
