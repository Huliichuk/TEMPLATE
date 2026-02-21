# PR Checklist

## Code Quality

- [ ] English-only code, identifiers, comments
- [ ] Files ~300–400 lines; >500 requires refactor/justification
- [ ] No duplicated logic; one responsibility per file
- [ ] No `any` types; no `@ts-ignore` without justification
- [ ] Explicit return types on exported functions

## UI / Styling

- [ ] Tailwind CSS only; shadcn/ui only; no visual drift
- [ ] No inline styles for layout/design
- [ ] Token-compliant colors, spacing, typography

## Security

- [ ] `.env` gitignored; `.env.example` updated
- [ ] No secrets committed, logged, or printed
- [ ] RLS policies on new Supabase tables

## Architecture

- [ ] Business logic is pure and testable
- [ ] Side effects pushed to edges
- [ ] API contracts use types/schemas as source of truth

## Testing

- [ ] Tests cover happy path + edge cases + error cases
- [ ] No skipped tests without explanation

## Google Engineering Principles (GEP)
- [ ] **Hallucination Check**: Checked with docs? No guesses?
- [ ] **"Small Change"**: Is this the minimal correct set of changes?
- [ ] **Naming & Clarity**: Full identifiers used? (e.g. `errorCount` vs `err`)
- [ ] **Reliability**: Result pattern used? Graceful degradation for UI?
- [ ] **Security**: Zod validation at all boundaries? No secrets leaked?

## Documentation (Obsidian)
- [ ] Architecture decisions documented in [[Obsidian notes]]
- [ ] Non-obvious patterns explained in comments (_why_, not _what_)
