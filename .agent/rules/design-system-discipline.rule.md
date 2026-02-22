---
trigger: always_on
---

# Design System Discipline Rule

All UI must follow a single, consistent design system. Consistency is mandatory.
Never create a “new style” per page, feature, or mood.

---

## Source of Truth

- Design tokens live in:
  - `src/styles/tokens.css` (CSS variables) OR `src/styles/tokens.ts` (if needed)
- UI primitives MUST use **shadcn/ui** components
- Styling MUST use **Tailwind CSS** only
- No ad-hoc CSS frameworks or custom styling systems

---

## Token Rules (Strict)

All UI must reference tokens, not hard-coded values:

- Colors via CSS variables (e.g. `--background`, `--foreground`, `--primary`, etc.)
- Spacing via Tailwind scale (no random px unless justified)
- Typography via Tailwind utility classes and agreed scale
- Radius/shadows must be consistent across the app

Forbidden:

- Introducing new color palettes per page
- Inline styles (`style={{...}}`) for layout/visual styling
- Random hex colors, random font sizes, random shadows

---

## Component Rules (Strict)

- Prefer composition via shadcn primitives (Button, Input, Card, Dialog, etc.)
- New UI elements must be created as reusable components when repeated
- A component must have one responsibility and predictable API

---

## Visual & Brand Consistency

Before creating new UI:

- Reuse existing patterns (forms, tables, cards, modals)
- Follow existing spacing, typography, and layout conventions
- If a new pattern is required, define it once and reuse it everywhere



## Output Discipline

If the request asks for a new page or UI:

- First ensure design tokens and primitives exist
- Then implement using the system
- Do not “invent” styling outside the system

Violation of this rule is an error.
