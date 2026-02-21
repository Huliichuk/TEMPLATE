---
name: vercel-web-interface-guidelines
description: 100+ web UI best practices from Vercel Labs for accessibility, performance, and UX auditing. The gold standard for UI quality.
source: https://github.com/vercel-labs/web-interface-guidelines (score 9.6)
---

# Vercel Web Interface Guidelines — UI Audit Checklist

## Focus States
- Interactive elements need visible focus: `focus-visible:ring-*`
- Never `outline-none` without focus replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)
- Group focus with `:focus-within` for compound controls

## Forms
- Inputs need `autocomplete` and meaningful `name`
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels clickable (`htmlFor` or wrapping control)
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- Checkboxes/radios: label + control share single hit target
- Submit button stays enabled until request starts; spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern
- Warn before navigation with unsaved changes (`beforeunload` or router guard)

## Animation
- Honor `prefers-reduced-motion`
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all` — list properties explicitly
- Animations interruptible — respond to user input mid-animation

## Typography
- `…` not `...`
- Curly quotes `"` `"` not straight `"`
- Non-breaking spaces: `10 MB`, `⌘ K`, brand names
- Loading states end with `…`: `"Loading…"`, `"Saving…"`
- `font-variant-numeric: tabular-nums` for number columns
- `text-wrap: balance` or `text-pretty` on headings (prevents widows)

## Content Handling
- Text containers: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` to allow text truncation
- Handle empty states — don't render broken UI for empty data
- Anticipate short, average, and very long user inputs

## Images
- `<img>` needs explicit `width` and `height` (prevents CLS)
- Below-fold: `loading="lazy"`
- Above-fold critical: `priority` or `fetchpriority="high"`

## Performance
- Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`)
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`)
- Batch DOM reads/writes; avoid interleaving
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- `<link rel="preconnect">` for CDN/asset domains
- Critical fonts: `<link rel="preload">` with `font-display: swap`

## Navigation & State
- URL reflects state — filters, tabs, pagination in query params
- Links use `<Link>` (Cmd/Ctrl+click, middle-click support)
- Deep-link all stateful UI (consider URL sync via `nuqs`)
- Destructive actions need confirmation or undo — never immediate

## Touch & Interaction
- `touch-action: manipulation` (prevents double-tap zoom delay)
- `overscroll-behavior: contain` in modals/drawers/sheets
- During drag: disable text selection, `inert` on dragged elements
- `autoFocus` sparingly — desktop only, single primary input

## Safe Areas & Layout
- Full-bleed layouts: `env(safe-area-inset-*)` for notches
- Avoid unwanted scrollbars: fix content overflow
- Flex/grid over JS measurement for layout

## Dark Mode & Theming
- `color-scheme: dark` on `<html>` (fixes scrollbar, inputs)
- `<meta name="theme-color">` matches page background
- Native `<select>`: explicit `background-color` and `color`

## Locale & i18n
- Dates/times: `Intl.DateTimeFormat` — not hardcoded formats
- Numbers/currency: `Intl.NumberFormat` — not hardcoded formats
- Detect language via `Accept-Language` / `navigator.languages`, not IP

## Hydration Safety
- Inputs with `value` need `onChange` (or `defaultValue` for uncontrolled)
- Date/time rendering: guard against hydration mismatch
- `suppressHydrationWarning` only where truly needed

## Hover & Interactive States
- Buttons/links need `hover:` state (visual feedback)
- Interactive states increase contrast: hover/active/focus more prominent

## Content & Copy
- Active voice: "Install the CLI" not "The CLI will be installed"
- Title Case for headings/buttons (Chicago style)
- Numerals for counts: "8 deployments" not "eight"
- Specific button labels: "Save API Key" not "Continue"
- Error messages include fix/next step
- Second person; avoid first person

## Anti-patterns (FLAG THESE)

| Anti-pattern | Why |
|---|---|
| `user-scalable=no` or `maximum-scale=1` | Disabling zoom |
| `onPaste` + `preventDefault` | Blocking paste |
| `transition: all` | Performance |
| `outline-none` without focus-visible | Accessibility |
| Inline `onClick` navigation without `<Link>` | Broken Cmd+click |
| `<div>` or `<span>` with click handlers | Should be `<button>` |
| Images without dimensions | CLS |
| Large arrays `.map()` without virtualization | Performance |
| Form inputs without labels | Accessibility |
| Icon buttons without `aria-label` | Accessibility |
| Hardcoded date/number formats | Use `Intl.*` |
| `autoFocus` without justification | Mobile UX |
