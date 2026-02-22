---
description: Systematic Debugging
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find the root cause before attempting fixes.  
Fixing symptoms is failure.

**Violating the letter of this process is violating the spirit of debugging.**

---

## The Iron Law

NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

If Phase 1 is not complete, proposing fixes is forbidden.

---

## Enforcement Rules (Mandatory)

- If Phase 1 is incomplete, do not propose fixes.
- If required evidence is missing, use tools to gather it.
- If multiple root causes are plausible, test them systematically.

---

## When to Use

Use for ANY technical issue:

- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

Use this ESPECIALLY when:

- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

Don't skip when:

- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Manager wants it fixed NOW (systematic is faster than thrashing)

---

## The Four Phases

You MUST complete each phase before proceeding to the next.

---

## Phase 1: Root Cause Investigation

NO FIXES ALLOWED IN THIS PHASE.

1. Read Error Messages Carefully
   - Read full error messages and warnings
   - Read entire stack traces
   - Note line numbers, file paths, error codes
   - Do not reinterpret errors yet

2. Reproduce Consistently
   - Can the issue be triggered reliably?
   - Exact steps to reproduce
   - Always / intermittent / environment-specific
   - If not reproducible → gather more data and STOP

3. Check Recent Changes
   - What changed since last known good state?
   - Commits, diffs
   - Dependency changes
   - Configuration or environment changes

4. Gather Evidence in Multi-Component Systems

   WHEN system spans multiple components (CI → build → signing, API → service → database):

   For EACH component boundary:
   - Log data entering the component
   - Log data exiting the component
   - Log environment/configuration
   - Log state assumptions

   Run once.
   Identify WHERE divergence begins.
   Investigate ONLY that component.

5. Trace Data Flow Backward

   WHEN error is deep in call stack:
   - Where does the bad value originate?
   - What called this with the bad value?
   - Continue tracing upward until the source
   - Fix at the source, never at the symptom

### Phase 1 Completion Criteria

You may proceed ONLY if you can explicitly state:

- What fails
- Where it fails first
- Why it fails (mechanism, not correlation)

If any cannot be stated → Phase 1 is NOT complete.

---

## Phase 2: Pattern Analysis

Do NOT fix yet.

1. Find Working Examples
   - Similar working code paths
   - Prefer same codebase

2. Compare Against References
   - Read reference implementations COMPLETELY
   - Do not skim
   - Understand assumptions

3. Identify Differences
   - List identical elements
   - List ALL differences, even trivial
   - Do not label any difference as irrelevant

4. Understand Dependencies
   - Required configuration
   - Required environment
   - Implicit assumptions
   - Violated assumptions in broken case

---

## Phase 3: Hypothesis and Testing

Apply the scientific method.

1. Form a Single Hypothesis

Mandatory format:

I believe <specific mechanism> is failing  
because <observed evidence>  
which explains <exact symptom>.

If this cannot be written precisely, the hypothesis is invalid.

2. Test Minimally
   - Smallest possible change
   - One variable only
   - No bundled fixes

3. Verify Before Continuing
   - If it works → proceed to Phase 4
   - If it fails → discard hypothesis and return to Phase 1 or 2

4. When You Don’t Know
   - Explicitly say what you don’t understand
   - Do not pretend
   - Ask for help or research further

---

## Phase 4: Implementation

Fix the root cause, not the symptom.

1. Create a Failing Test Case
   - Minimal reproduction
   - Automated if possible
   - Must fail before fix

2. Implement a Single Fix
   - Address only the identified root cause
   - ONE change
   - No refactoring
   - No “while I’m here” changes

3. Verify Fix
   - Test passes
   - No regressions
   - Original issue resolved

4. If Fix Doesn’t Work
   - STOP
   - Count attempts:
     - < 3 → return to Phase 1
     - ≥ 3 → STOP and question architecture



---

## Red Flags — STOP and Follow Process

- “Quick fix for now”
- “Just try changing X”
- “Probably caused by X”
- “Skip the test”
- “One more fix attempt”
- Proposing fixes before tracing data flow

ALL indicate failure of process.

---

## When No Root Cause Is Found

If investigation shows the issue is environmental or external:

- Document investigation
- Implement defensive handling
- Add monitoring/logging

95% of “no root cause” cases are incomplete investigation.
