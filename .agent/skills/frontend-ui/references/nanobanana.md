# NanoBanana — Asset Generation Workflow

NanoBanana is the agent's mandatory workflow for generating high-end, custom graphical assets using the `generate_image` tool. It ensures that every UI element is supported by professional visuals — **never placeholders**.

> [!CAUTION]
> Using placeholder images, stock photos, or generic icons is a critical violation of Zero-Slop standards.

---

## 1. Prompting Strategy

### The Structure of a Good Prompt

Every `generate_image` prompt MUST include:

| Component | Description | Examples |
|---|---|---|
| **Medium** | The artistic technique | "3D render", "clay render", "isometric vector", "editorial photograph", "watercolor illustration", "metallic sculpture" |
| **Subject** | What the image depicts | "a floating translucent sphere", "a dashboard interface", "abstract geometric shapes" |
| **Style** | The overall aesthetic | "minimalist luxury", "cyberpunk neon", "soft pastel", "dark moody editorial", "grainy vintage film" |
| **Lighting** | How the scene is lit | "soft studio lighting", "cinematic rim light", "dramatic side lighting", "golden hour warmth", "cool blue ambient" |
| **Composition** | Camera angle and framing | "centered subject", "extreme close-up", "wide-angle architectural", "floating in negative space", "bird's eye view" |
| **Color Palette** | Explicit colors from the design system | "primary purple (#7C3AED) and teal (#14B8A6) accents on dark background (#0A0A0A)" |
| **Background** | Background treatment | "transparent background", "deep black void", "soft gradient", "white studio" |

### Prompt Template
```
A [medium] of [subject], [style] aesthetic, [lighting], [composition], [color palette], [background]. High resolution, professional quality.
```

### Example Prompts

**Hero Visual (Dark Luxury)**:
```
A high-end 3D render of floating translucent glass shapes with internal vibrant purple and teal mesh gradients, soft studio lighting with subtle rim light, centered composition with negative space, on a deep dark background (#0A0A0A). Ultra-minimalist luxury tech aesthetic. 4K resolution.
```

**Feature Card Illustration (Isometric)**:
```
An isometric vector illustration of a modern dashboard with analytics charts and data visualization, clean geometric style, flat lighting, purple (#7C3AED) and white color scheme on transparent background. Minimalist and professional.
```

**Empty State Illustration**:
```
A soft watercolor illustration of a peaceful empty desk with a notebook and coffee cup, pastel tones with light purple accents, warm natural lighting, centered composition. Gentle and inviting mood.
```

---

## 2. Style Consistency Rules

When generating multiple assets for the same project, they MUST share visual DNA:

1. **Same Medium**: If hero uses "3D render", features should use "3D render" too.
2. **Same Color Palette**: Reference exact HEX codes in every single prompt.
3. **Same Lighting**: Keep direction and temperature consistent.
4. **Same Background Treatment**: All on dark, or all on light, or all transparent.

### Project Style Token
Before generating the first asset, define a **Style Token** — a reusable descriptor:

```
Style Token: "dark luxury tech aesthetic, soft studio lighting with purple rim light, deep #0A0A0A background, primary purple #7C3AED, minimalist 3D render"
```

Append this token to every prompt for the project.

---

## 3. Integration Workflow

1. **Identify Need**: Detect where a visual would enhance UX:
   - Hero sections (MANDATORY)
   - Feature cards
   - Empty states
   - Testimonial backgrounds
   - CTA sections
   - 404 / Error pages

2. **Generate**: Call `generate_image` with a detailed prompt using the style token.

3. **Implement**:
   - Use `next/image` with `priority` for hero images.
   - Add descriptive `alt` text for accessibility.
   - Apply CSS `object-cover` or `object-contain` for proper framing.
   - Use `mix-blend-mode` or gradient overlays for integration with text.

```tsx
import Image from 'next/image';

<div className="relative h-[600px] overflow-hidden">
  <Image
    src="/generated/hero-visual.webp"
    alt="Abstract 3D shapes representing innovation"
    fill
    className="object-cover"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
  <div className="relative z-10 flex h-full items-end p-12">
    <h1 className="text-8xl font-black tracking-tighter text-white">Title</h1>
  </div>
</div>
```

---

## 4. Anti-Patterns (VIOLATIONS)

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| Using `placeholder.svg` or grey boxes | Generate with NanoBanana |
| Generic "AI art" look (overly smooth, symmetrical) | Specify exact medium ("clay render", not "3D image") |
| Mixing flat vectors with photorealistic 3D | Stick to one medium per project |
| Small, blurry images in hero sections | Generate at high resolution, use `fill` + `priority` |
| No `alt` text on generated images | Always add descriptive, accessible alt text |
| Different lighting/colors across assets | Use the Style Token consistently |
