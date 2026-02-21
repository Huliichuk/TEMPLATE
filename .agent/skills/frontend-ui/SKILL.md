---
name: frontend-ui
description: Guides the creation of premium, high-quality frontend interfaces with advanced motion, distinctive aesthetics, and NanoBanana asset generation.
---

# Frontend UI Skill — Awwwards-Level Design Blueprint

## Overview

This skill is the **definitive guide** for creating production-grade, **Zero-Slop** frontend interfaces that feel like Awwwards-winning websites. It transforms standard UI components into premium experiences using advanced typography, spatial composition, cinematic motion, interactive cursors, and high-end graphical assets generated via NanoBanana.

Every interface must feel **premium, alive, and deliberately designed**. No generic layouts, no default shadows, no placeholder images. Ever.

> [!CAUTION]
> **Mobile-First is MANDATORY.** Every page MUST look and work perfectly on mobile BEFORE desktop enhancements are applied. Violation of Zero-Slop or Mobile-First standards is a critical error.

## When to Use

- Building **any** new page, landing page, or significant UI feature.
- Implementing complex motion effects (parallax, scroll-driven, magnetic cursors).
- When high-quality custom imagery is needed (NanoBanana).
- **Mandatory for all new frontend development.**

---

## 1. Design Decision Framework

Before writing any code, the agent MUST make conscious design decisions for the page:

| Decision | Options | Default |
|---|---|---|
| **Theme** | `dark-luxury` · `light-minimal` · `vibrant-bold` · `editorial` | `dark-luxury` |
| **Motion Level** | `cinematic` (heavy parallax/scroll) · `refined` (micro-interactions) · `subtle` (hover/fade only) | `refined` |
| **Hero Strategy** | `full-bleed-media` · `split-layout` · `text-centric` · `interactive-3d` | `split-layout` |
| **Color Approach** | `monochromatic-accent` · `mesh-gradient` · `duotone` · `brand-palette` | `mesh-gradient` |
| **Typography** | `serif-display` · `geometric-sans` · `mixed-contrast` | `geometric-sans` |
| **Mobile Layout** | `stack-reflow` · `drawer-nav` · `bottom-nav` · `swipe-cards` | `stack-reflow` |

The agent documents these choices in a brief comment at the top of the main page component.

### 1.1 UI Implementation Plan (MANDATORY)

> [!CAUTION]
> Before writing ANY UI code, the agent MUST create a **detailed UI Implementation Plan** in `implementation_plan.md`. This is NOT optional — coding without a visual plan is a Zero-Slop violation.

The UI Implementation Plan MUST include:

**A. Visual Mockups (NanoBanana)**
- Generate **at least 1 mockup image** via `generate_image` showing the target design
- Prompt should describe the exact page layout, color scheme, and aesthetic
- Example prompt: `"Modern SaaS landing page, dark theme, glassmorphism navbar, hero with gradient mesh background, split layout with text left and 3D illustration right, bento grid features section below, purple-indigo color palette, premium aesthetic"`
- Embed the mockup in the plan: `![Landing page mockup](/path/to/mockup.png)`

**B. Style Specification**
```markdown
## Visual Style
- **Theme**: dark-luxury
- **Primary Colors**: `#6366f1` (indigo-500), `#8b5cf6` (violet-500)
- **Background**: `hsl(224 71% 4%)` → `hsl(222 47% 11%)`
- **Typography**: Inter (body) + Cal Sans (display)
- **Border Radius**: `rounded-xl` (cards), `rounded-2xl` (hero sections)
- **Glassmorphism**: `bg-white/5 backdrop-blur-xl border border-white/10`
```

**C. Component Structure**
```markdown
## Page Structure
1. `<Navbar />` — sticky, glassmorphism, mobile hamburger
2. `<HeroSection />` — split layout, gradient mesh, CTA buttons
3. `<FeaturesGrid />` — bento grid, 3 columns desktop → 1 col mobile
4. `<TestimonialsCarousel />` — swipeable on mobile
5. `<CTASection />` — full-bleed gradient, centered text
6. `<Footer />` — 4-column grid → stacked on mobile
```

**D. Responsive Behavior**
- Describe how EACH section adapts from mobile (375px) → tablet (768px) → desktop (1280px)
- Specify which elements hide/show/reflow at each breakpoint

**E. Motion Specification**
- List which sections have scroll animations and what type
- Specify hover effects for interactive elements
- Note any elements with parallax or special effects

The user MUST review and approve this plan before coding begins.

---

## 2. Aesthetic Foundation (Zero-Slop Rules)

### 2.1 Typography & Hierarchy

- **Font Pairing**: Always pair a bold display font (e.g., `outfit`, `space-grotesk`, `cal-sans`) with a clean body font (e.g., `inter`, `geist`). Use `next/font` for zero CLS.
- **Letter Spacing**: `tracking-tighter` for large headings (≥ `text-4xl`). `tracking-wide` and `uppercase` for small labels/eyebrows.
- **Hierarchy through Contrast**: Use weight, opacity (`text-white/60`), and color — not just font size.
- **Oversized Display Text**: Hero headings should be `text-6xl` to `text-9xl` on desktop. Use `clamp()` or responsive Tailwind classes for fluid scaling.

### 2.2 Advanced Color Systems

- **Mesh Gradients**: Use complex multi-stop radial gradients for backgrounds to create depth. Never use flat solid backgrounds for hero sections.
  ```tsx
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
  ```
- **Dark Glassmorphism**: Layer semi-transparent surfaces over deep gradients. `bg-black/20 backdrop-blur-xl border border-white/10`.
- **Glow Effects**: Use colored `box-shadow` or pseudo-elements with large blur radii (`blur-3xl`) for ambient glow behind key elements.
- **Noise Texture**: Add a subtle SVG noise overlay (`opacity-[0.03]`) to gradients to prevent banding and add premium "organic" feel.

### 2.3 Spatial Composition

- **Overlapping Elements**: Sections should overlap slightly (negative margins, `absolute` positioned decorative elements) to create depth.
- **Asymmetrical Layouts**: Offset columns, uneven padding, grid-breaking components for editorial feel.
- **Floating Decorative Elements**: Gradient blobs, geometric shapes, or lines that "float" behind content using `absolute` positioning and large `blur` values.
- **Bento Grids**: For feature showcases, use a bento-style grid with varying cell sizes (`col-span-2`, `row-span-2`).

---

## 3. Motion & Animation System

### 3.1 CSS-First Performance Rules

> [!IMPORTANT]
> **GPU-Only Properties**: ALL animations MUST only animate `transform` (`translate`, `scale`, `rotate`) and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.

- **`prefers-reduced-motion`**: ALL motion MUST be wrapped in `motion-safe:` (Tailwind) or checked via `window.matchMedia`. This is non-negotiable for accessibility.

### 3.2 CSS Scroll-Driven Animations (Native Performance)

The **preferred method** for scroll-linked effects. Runs off the main thread for maximum performance.

```css
/* Reading progress bar */
.progress-bar {
  animation: scaleProgress linear;
  animation-timeline: scroll();
  transform-origin: left;
}
@keyframes scaleProgress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Element reveal on scroll */
.reveal-on-scroll {
  animation: fadeSlideIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3.3 Framer Motion (Complex Orchestration)

Use for: staggered reveals, `AnimatePresence` exit animations, layout animations, spring physics, and magnetic cursors.

**Performance Rules for Framer Motion:**
- Use `LazyMotion` + `domAnimation` to tree-shake unused features.
- Prefer `whileInView` over manual `IntersectionObserver`.
- Use `variants` and `staggerChildren` for parent-child orchestration.
- Keep durations short: 150–250ms for micro UI, 250–400ms for context switches.

```tsx
// Staggered list reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

<motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* ... */}
    </motion.div>
  ))}
</motion.div>
```

### 3.4 Parallax

- **CSS-Only (`perspective`)**: For simple depth layers. Use `perspective` on parent, `translateZ` on children.
- **Scroll-Driven API**: For modern browsers, use `animation-timeline: scroll()` with different `animation-range` values for each layer.
- **Framer Motion `useScroll`**: For declarative parallax with spring physics. Use `useTransform` to map scroll progress to `y` values.

### 3.5 Micro-Interactions (Mandatory)

Every interactive element MUST have at minimum:
- **Hover**: Scale (`scale-[1.02]`), brightness shift, or border glow.
- **Active/Press**: Subtle scale-down (`scale-[0.98]`).
- **Focus**: Visible focus ring for accessibility (`ring-2 ring-offset-2`).
- **Transition**: `transition-all duration-200 ease-out` on all interactive elements.

---

## 4. Cursor Effects

### 4.1 Magnetic Cursor

Elements subtly "pull" toward the cursor when nearby. Implemented via Framer Motion's `useMotionValue` and `useSpring`.

```tsx
"use client";
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouse(event: MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function reset() { x.set(0); y.set(0); }

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }}
      onMouseMove={handleMouse} onMouseLeave={reset}>
      {children}
    </motion.div>
  );
}
```

### 4.2 Custom Cursor (Global)

A custom cursor that morphs on hover over interactive elements. Implemented as a client-side `<CursorFollower />` component in the root layout.

- **Default**: Small dot with subtle trail.
- **On Link/Button Hover**: Expands, changes blend mode (`mix-blend-difference`).
- **On Image Hover**: Shows "View" text or magnifying glass icon.

### 4.3 Cursor Skew / Momentum

Add momentum/skew to the cursor follower based on movement velocity for a premium "physics" feel.

---

## 5. Page Section Blueprints

### 5.1 Hero Section

| Element | Guideline |
|---|---|
| Heading | `text-6xl` to `text-9xl`, `font-black`, `tracking-tighter` |
| Subheading | `text-lg` to `text-xl`, `text-muted-foreground` or `text-white/60` |
| CTA | Primary button with glow/magnetic effect. Secondary text link. |
| Background | Mesh gradient, animated gradient, or full-bleed NanoBanana image with overlay |
| Motion | Text reveal animation (staggered words), floating decorative blobs |

### 5.2 Feature Grid (Bento)

- Use CSS Grid with `grid-cols-3` and varying `col-span` / `row-span`.
- Each card: glassmorphism + hover scale + subtle border glow.
- Include a small icon or NanoBanana illustration per card.

### 5.3 Social Proof / Testimonials

- Infinite horizontal marquee using CSS `@keyframes` and `translateX`.
- Glassmorphism cards with avatar, name, role.
- `pause` on hover.

### 5.4 CTA / Footer

- Large display text with gradient text effect (`bg-gradient-to-r bg-clip-text text-transparent`).
- Magnetic button for primary action.
- Subtle animated background.

---

## 6. Asset Generation (NanoBanana)

> [!IMPORTANT]
> **NEVER use placeholders, stock photos, or generic icons.** Every visual MUST be generated via `generate_image`.

### 6.1 Prompting Strategy

Be hyper-specific. Include:
- **Medium**: "3D render", "clay render", "isometric vector", "editorial photograph", "watercolor illustration"
- **Style**: "minimalist", "luxury tech aesthetic", "grainy film look", "cyberpunk neon"
- **Lighting**: "soft studio lighting", "cinematic rim light", "golden hour"
- **Composition**: "centered subject", "extreme close-up", "floating in zero gravity"
- **Color Palette**: Explicitly state HEX codes or color names from the design system.

### 6.2 Style Consistency

All assets for a single project MUST share a visual DNA:
- Same color palette reference in every prompt.
- Same medium/style descriptor.
- Same lighting direction.

### 6.3 Anti-Patterns

- ❌ **"AI Slop"**: Overly smooth, generic AI renders. Be specific about medium.
- ❌ **Resolution Mismatch**: Small images in hero sections.
- ❌ **Style Drift**: Mixing flat vectors with photorealistic 3D in the same interface.

---

## 7. Technical Constraints

- **TypeScript**: Mandatory. All components typed. All props via `interface`.
- **Tailwind CSS**: Primary styling. Custom CSS only for `@keyframes` and scroll-driven animations.
- **shadcn/ui**: Base for all UI primitives (Button, Card, Dialog, etc.).
- **`next/font`**: For all custom fonts. Zero CLS.
- **`next/image`**: For all images. `priority` on hero images. Proper `sizes` attribute.
- **Server Components Default**: Only add `"use client"` for components that genuinely need interactivity or browser APIs.

---

## 8. Quality Checklist (Before Submission)

- [ ] Does the page pass the "screenshot test"? (Would this look good on Awwwards?)
- [ ] Are ALL interactive elements animated (hover, press, focus)?
- [ ] Is `prefers-reduced-motion` respected?
- [ ] Are all images generated via NanoBanana (no placeholders)?
- [ ] Is the typography hierarchy clear (display → heading → body → caption)?
- [ ] Is there at least ONE scroll-driven or parallax effect on the page?
- [ ] Are decorative elements (blobs, gradients, noise) present for depth?
- [ ] Does the dark mode / light mode look premium in both states?
- [ ] Are touch/mobile states handled? (no hover-only interactions)
- [ ] Is WCAG contrast met on all glassmorphism surfaces?
- [ ] Are premium loading skeletons shown during data fetches?
- [ ] Is `text-wrap: balance` applied to dynamic headings?

---

## 9. Mobile & Touch Strategy (CRITICAL)

> [!CAUTION]
> **Mobile-First is a HARD REQUIREMENT, not an afterthought.** ~60% of web traffic is mobile. Every page, component, and interaction MUST be designed for mobile FIRST, then enhanced for desktop.

### 9.1 Mobile-First Development Rules
- **Build mobile layout FIRST** — desktop is the enhancement, not the other way around
- **Test at 375px width** as the baseline — this is iPhone SE / smallest common viewport
- **ALL Tailwind classes start mobile** — only add `md:` / `lg:` / `xl:` for desktop enhancements
- **No horizontal scroll** — ever. Test every component at 320px width

### 9.2 Responsive Typography
ALL oversized display text MUST scale fluidly. Never let text overflow on mobile.

```tsx
{/* MANDATORY for all hero/display headings */}
<h1 className="text-4xl font-black tracking-tighter leading-none md:text-6xl lg:text-8xl xl:text-9xl">
  Hero Title
</h1>

{/* Alternative: clamp() for ultra-smooth scaling */}
<h1 style={{ fontSize: "clamp(2rem, 6vw + 1rem, 8rem)" }} className="font-black tracking-tighter leading-none">
  Hero Title
</h1>
```

### 9.3 Responsive Grid Patterns
```tsx
{/* Feature grid: 1 col mobile → 2 col tablet → 3 col desktop */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {features.map(f => <FeatureCard key={f.id} {...f} />)}
</div>

{/* Bento grid: stack on mobile, bento on desktop */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <div className="md:col-span-2 md:row-span-2">{/* Featured */}</div>
  <div>{/* Small 1 */}</div>
  <div>{/* Small 2 */}</div>
</div>

{/* Split hero: stack on mobile, side-by-side on desktop */}
<section className="flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:gap-16">
  <div className="flex-1">{/* Text content */}</div>
  <div className="flex-1">{/* Image/visual */}</div>
</section>
```

### 9.4 Touch Interaction Rules
- **Touch Targets**: ALL interactive elements MUST be at least **44×44px** (Apple HIG / WCAG 2.5.8)
- **Cursor Effects**: Wrap in `@media (hover: hover) and (pointer: fine)`. Disable on touch.
- **Hover → Active**: Every `hover:scale-[1.02]` needs a matching `active:scale-[0.98]`
- **Swipe gestures**: Consider swipeable carousels for image galleries on mobile
- **Bottom Navigation**: For app-like experiences, use bottom nav on mobile (`fixed bottom-0`)

```tsx
{/* Touch-safe button: min 44px target */}
<button className="min-h-[44px] min-w-[44px] px-6 py-3 text-base
  transition-all duration-200
  hover:scale-[1.02] active:scale-[0.98]
  focus-visible:ring-2 focus-visible:ring-primary">
  Action
</button>
```

### 9.5 Mobile-Specific Rules
- **`100dvh` not `100vh`**: Use dynamic viewport height to account for mobile browser chrome
- **No `position: fixed` abuse**: Mobile Safari handles fixed positioning poorly with keyboard open
- **Drawer instead of Modal**: On mobile, prefer slide-up drawers over centered modals (thumb-friendly)
- **Lazy Load Below Fold**: Only `priority` the hero image, lazy-load everything else
- **Parallax on Mobile**: Disable CSS `perspective` parallax on touch. Use simple opacity fades
- **Font sizes**: Minimum `text-sm` (14px) for body text on mobile. Never go below 12px

### 9.6 Image Responsiveness
```tsx
import Image from 'next/image';

{/* Responsive hero image */}
<Image
  src="/hero.webp"
  alt="Hero visual"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>

{/* Responsive card image — no stretch */}
<div className="relative aspect-video w-full overflow-hidden rounded-xl">
  <Image src="/card.webp" alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
</div>
```

### 9.7 Mobile Navigation Pattern
```tsx
{/* Desktop: horizontal nav. Mobile: hamburger + sheet */}
<nav className="hidden md:flex md:items-center md:gap-8">
  {links.map(link => <NavLink key={link.href} {...link} />)}
</nav>

{/* Mobile: hamburger button + Sheet/Drawer from shadcn */}
<Sheet>
  <SheetTrigger className="md:hidden">
    <MenuIcon className="h-6 w-6" />
  </SheetTrigger>
  <SheetContent side="left">
    {links.map(link => <NavLink key={link.href} {...link} />)}
  </SheetContent>
</Sheet>
```

---

## 10. Loading States & Perceived Performance

> [!IMPORTANT]
> A blank space while data loads is a Zero-Slop violation. Premium UIs have premium loading states.

### 10.1 Premium Skeleton Strategy
Instead of generic grey boxes, use animated gradient pulses matching the theme:

```tsx
<div className="animate-pulse rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 h-64" />
```

### 10.2 Blur-Up Image Loading (LQIP)
For NanoBanana hero images, use a Low-Quality Image Placeholder (dominant color or tiny blurred version) via `next/image`'s `placeholder="blur"` with `blurDataURL`.

### 10.3 Skeleton-to-Content Transition
When real content loads, animate the transition from skeleton to real content using `AnimatePresence` or a CSS `fade-in` animation.

---

## 11. Defensive CSS & Edge Cases

### Typography Safety
```tsx
{/* Prevent layout blowouts with dynamic content */}
<h1 className="text-wrap-balance break-words hyphens-auto">
  {dynamicTitle}
</h1>
```

### Glassmorphism Accessibility
- **Contrast Rule**: If `text-white/60` is used, the background MUST be solid or `bg-black/80` minimum.
- **High-Contrast Fallback**: Provide a `@media (prefers-contrast: more)` query that replaces glass effects with solid backgrounds and borders.

### NanoBanana Fallback
If `generate_image` fails or is unavailable, use a pre-generated theme-compliant gradient placeholder — never a broken image icon.

### Container Queries (Bento Grid)
Use `@container` queries for Bento Grid cards to adapt layout based on parent width, not viewport:
```tsx
<div className="@container">
  <div className="@lg:flex-row flex flex-col gap-4">
    {/* Adapts to container, not viewport */}
  </div>
</div>
```

---

## References

- [[references/motion.md]] — Parallax and Animation patterns.
- [[references/aesthetics.md]] — Typography, Composition, and Glassmorphism.
- [[references/nanobanana.md]] — Image generation workflow.
