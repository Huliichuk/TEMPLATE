---
description: Systematic code refactoring workflow with safety checks
---

# Refactoring Workflow

Structured approach to refactoring code while maintaining correctness.

## Pre-Refactoring Checks

// turbo
1. Ensure clean build before starting:
```bash
npx tsc --noEmit --pretty 2>&1 | tail -5
```

2. Identify the refactoring target:
   - Check file size (target 300-400 lines, max 500)
   - Identify single-responsibility violations
   - Look for duplicated logic
   - Check for god-files or multi-purpose modules

## Refactoring Steps

3. **Plan the split**:
   - Map out responsibilities in the file
   - Identify logical groupings (types, interfaces, constants, hooks, components)
   - Plan new file names following existing conventions
   - Plan re-exports for backward compatibility

4. **Execute the split**:
   - Create new files with extracted code
   - Add proper imports in new files
   - Replace extracted code with re-exports in original file
   - Verify all consumers still work

// turbo
5. **Verify after refactoring**:
```bash
npx tsc --noEmit --pretty 2>&1 | head -20
```

6. **Validate file sizes**:
```bash
wc -l <refactored files>
```

## Refactoring Patterns

### Component → Component + Hook
- Extract state management, data fetching, and complex logic into custom hook
- Component focuses purely on JSX rendering
- Hook named `use-<component-name>.ts`

### Large Type File → Multiple Modules
- Core types remain in original file
- Interfaces → `<name>-interfaces.ts`
- Constants/Labels → `<name>-constants.ts` or `<name>-labels.ts`
- Form/Input types → `<name>-inputs.ts`

### Large Action File → Feature Modules
- Split by domain responsibility
- Use barrel file (index.ts) for re-exports
- Each module ≤ 500 lines

## Rules
- Always maintain backward compatibility via re-exports
- Zero new TypeScript errors after refactoring
- File target: 300-400 lines, max 500
- One file = one clear responsibility
- Test build after EVERY split
