---
name: frontend-ui
description: Guides the creation of clean, high-quality frontend interfaces.
---

# Frontend UI Skill — Clean & Consistent Design System

## Overview

This skill is the guide for creating production-grade, functional frontend interfaces. 
The absolute highest priority is **Consistency**. Every new element must perfectly match the existing design tokens, Tailwind spacing, and shadcn/ui components.

Every interface must feel clean and deliberately designed. 
DO NOT "invent" new styles, colors, or complex animations unless explicitly asked.

> [!CAUTION]
> **Adhere strictly to existing code.** If a grid exists, do not break it. If styling exists, copy it. Never introduce new visual patterns (like mesh gradients or glassmorphism) unless the user requests it.

## When to Use

- Building any new page, landing page, or UI feature.
- Fixing layout or styling bugs.

---

## 1. Design Decision Framework

Before writing any code, the agent MUST review the existing project structure and determine the correct shadcn/ui components and Tailwind utility classes to use.

The agent documents its component structure choices in a brief comment at the top of the main page component before implementation.

### 1.1 UI Implementation Plan

> [!CAUTION]
> Before writing ANY UI code, the agent MUST create a **UI Implementation Plan** in `implementation_plan.md`.

The UI Implementation Plan MUST include:

**B. Style Specification**
```markdown
## Visual Style
- **Colors**: Strictly adhere to `tailwind.config.ts` (e.g., `bg-background`, `text-primary`)
- **Typography**: Existing fonts only
- **Components**: Re-use existing shadcn blocks
```

**C. Component Structure**
```markdown
## Page Structure
1. `<Navbar />` — mobile hamburger, standard layout
2. `<HeroSection />` — standard layout, primary CTA
3. `<FeaturesGrid />` — 3 columns desktop → 1 col mobile
4. `<Footer />` — stacked on mobile
```

**D. Responsive Behavior**
- Describe how EACH section adapts from mobile (375px) → tablet (768px) → desktop (1280px)
- Specify which elements hide/show/reflow at each breakpoint

**E. Motion Specification**
- List which sections have scroll animations and what type
- Specify hover effects for interactive elements

The user MUST review and approve this plan before coding begins.

---

## 2. Aesthetic Foundation & Style Adherence

### 2.1 Typography & Hierarchy
- Use the existing typography scales defined by Tailwind.
- Do not introduce new fonts or drastically different tracking/leading unless it's an established pattern in the project.

### 2.2 Color Systems (Strict)
- Use ONLY the colors defined in the project's Tailwind config or CSS variables (e.g., `bg-primary`, `text-muted-foreground`).
- **NEVER** use raw hex codes (e.g., `#6366f1`) unless explicitly adding a new token requested by the user.
- **NEVER** generate mesh gradients or complex blurred backgrounds unless instructed. Stick to clean, solid, or subtle gradient backgrounds that exist in the project.

### 2.3 Spatial Composition
- **Consistency is key**: Copy the padding and margin structures of adjacent components.
- Do not create asymmetrical layouts or overlapping elements indiscriminately. Clean, predictable grids are preferred.

---

## 3. Motion & Animation System

- **Subtle is Better**: Only use animations if they serve a clear UX purpose (e.g., hover states, simple fade-ins).
- Do not add Framer Motion or complex scroll-driven animations to standard UI elements unless explicitly requested.
- If hover states are needed, stick to standard Tailwind transitions (e.g., `transition-colors duration-200 hover:bg-accent`).

---

## 5. Page Section Blueprints

### 5.1 Hero Section

| Element | Guideline |
|---|---|
| Heading | Clear typography hierarchy |
| Subheading | Subdued text color |
| CTA | Primary button |
| Background | Subtle background matching the theme |

### 5.2 Feature Grid (Bento)

- Use CSS Grid for layout.
- Include a small icon per card if needed.

### 5.3 Social Proof / Testimonials

- Standard cards with avatar, name, role.

### 5.4 CTA / Footer

- Clear layout matching existing design system.

---

## 6. Asset Generation

- **Placeholders**: Default to standard UI patterns or layout placeholders.
- **Image Generation**: Only use `generate_image` if explicitly required by the user to build a polished mockup.

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

- [ ] Does the page match the existing design tokens and spacing?
- [ ] Is `prefers-reduced-motion` respected where relevant?
- [ ] Is the typography hierarchy clear (display → heading → body → caption)?
- [ ] Are touch/mobile states handled?
- [ ] Is WCAG contrast met?
- [ ] Are simple loading skeletons shown during data fetches?

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
> A blank space while data loads is jarring. Provide simple loading skeletons.

### 10.1 Skeleton Strategy
Use standard pulse animations or skeleton components from shadcn.

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

