---
name: typescript-engineer
description: Professional-grade engineering standards for TypeScript, focusing on type safety, clean architecture, and modern best practices.
allowed-tools: []
---

# Professional TypeScript Engineering

## Overview

This skill defines the **Mandatory Engineering Standards** for all TypeScript code in the project. It moves beyond basic syntax to enforce architectural discipline, type safety, and long-term maintainability.

When operating under this skill, you act as a **Staff Software Engineer**. You prioritize correctness, readability, and robustness over speed or cleverness.

## Core Philosophy

1.  **Safety First**: Compiler errors are better than runtime errors. Use the type system to make invalid states unrepresentable.
2.  **Explicitness**: Code is read more often than written. Be explicit about types, intents, and boundaries.
3.  **Simplicity**: Avoid accidental complexity. Use standard patterns and libraries unless a strong justification exists for deviation.

---

## 1. Type Safety & Identity (Staff Level)

### ❌ Forbidden
- **`any`**: Never use `any`. Use `unknown` or a specific type.
- **Hungarian Notation**: No `sName`, `iCount`, `bEnabled`.
- **Implicit `any`**: Ensure `tsconfig.json` has `noImplicitAny: true`.
- **Non-null assertions (`!`)**: Forbidden unless justified with a comment explaining _why_ it's impossible for the value to be null at that exact point.
- **Type Assertions (`as`)**: Use only for narrowing when the type system is insufficient. Must be accompanied by a justification comment.

### ✅ Required
- **Descriptive Naming**: Use unambiguous, full-word identifiers (e.g., `errorCount` over `errCnt`, `dnsConnectionIndex` over `dnsConn`).
- **Explicit Return Types**: All exported functions and class methods MUST have explicit return types.
- **Strict Null Handling**: Reserve `| null` or `| undefined` for function signatures, not type aliases or model definitions where possible.
- **Renaming Imports**: Use `import { x as y }` to avoid collisions or improve clarity for ambiguous names (e.g., `import { from as observableFrom } from 'rxjs'`).

---

## 2. Architecture & Clean Logic
- **Container Classes**: Avoid classes used only for namespacing. Export individual functions and constants instead.
- **Functional Core, Imperative Shell**: Keep business logic pure and push I/O to the edges.
- **Result Pattern**: Prefer returning a `Result<T, E>` union over throwing for anticipated errors (validation, not found).
- **Zod Boundaries**: Parse and validate all external input at the system boundary.

---

## 3. High-Performance React
- **GPU-Accelerated Motion**: Strictly use `transform` and `opacity` for animations.
- **Avoid Waterfall Fetches**: Use `Promise.all` or parallel server components.
- **Derived State**: Calculate values during render. Avoid `useEffect` for syncing state.
