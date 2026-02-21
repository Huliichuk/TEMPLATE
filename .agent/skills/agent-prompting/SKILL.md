---
name: agent-prompting
description: Advanced skill for generating robust, reliable, and "cool" system prompts for other LLMs or agents. Use this when you need to instruct a worker agent, create a new AI persona, or define strict operational constraints.
---

# Agent Prompt Engineering Skill

This skill provides the framework for writing highly effective System Prompts and Instructions for AI agents, heavily inspired by the Anthropic Cookbook Metaprompt guidelines.

## When to Use

- You (as an Orchestrator) need to write a prompt to delegate a sub-task to a Worker agent.
- The user asks you to "create a persona" or "write a system prompt" for a new AI feature.
- You need to build a self-correction (Evaluator) prompt.

---

## 1. The Anatomy of a Perfect Prompt

A professional-grade agent prompt is not a simple sentence. It is a structured document that leaves zero ambiguity.

### Minimum Required Sections

1. **Role / Persona**: Who is the agent? (e.g., "Act as a strict Google Staff Engineer...")
2. **The Task Context**: What is the overall goal?
3. **Strict Rules**: What must the agent NEVER do? (e.g., "Do not hallucinate APIs.")
4. **Thought Space**: Instructions on how to reason *before* acting (using `<thinking>` tags).
5. **Output Format**: Exact specifications of the required output (using XML tags).

---

## 2. Formatting Guidelines

### XML Tags for Structure
Anthropic models (and most modern LLMs) excel at parsing XML. Use XML tags to separate instructions from data, and to enforce output structure.

```xml
<context>
Here is the background information...
</context>

<rules>
1. Never use inline CSS.
2. Always write tests.
</rules>
```

### The `<thinking>` Tag (Crucial!)
Always instruct the target agent to write down its reasoning inside a `<thinking>` block *before* generating the final answer. This drastically reduces hallucinations and logic errors.

**Example Instruction:**
> "Before you output the final code, you must analyze the requirements and plan your solution inside `<thinking></thinking>` tags. This space is for you to work through the problem. Only after you have completed your analysis, output the final code inside `<code></code>` tags."

---

## 3. The "Metaprompt" Approach

If you are asked to generate a prompt for a complex scenario, use a **Metaprompt** structure. You are writing instructions to an eager but inexperienced AI.

### Template: Building a Worker Prompt

When creating a prompt for a sub-agent, use this structure:

```text
You will be acting as a [Role / Persona].

<Task>
Your goal is to [Specific Objective].
</Task>

<Inputs>
[Insert variables here, e.g., {$USER_QUERY}, {$CODE_FILE}]
</Inputs>

<Instructions>
Here are important rules for the interaction:
- [Rule 1: Focus on negative constraints - what NOT to do]
- [Rule 2: Focus on output constraints]
- [Rule 3: Focus on safety/fallback]

When you reply:
1. First, analyze the {$INPUTS} inside <thinking></thinking> tags. Identify edge cases.
2. Second, output your final result inside <result></result> tags.
</Instructions>
```

---

## 4. Evaluator Prompts (For Self-Correction)

If you are writing a prompt for an agent that checks another agent's work, the prompt must demand a binary decision and constructive feedback.

**Example Evaluator Constraints:**
> "You are a strict QA bot. Analyze the provided `<draft_code>`.
> Evaluate it against these criteria:
> 1. Does it use TypeScript?
> 2. Is there any 'any' typing?
> 
> Output your step-by-step reasoning in `<evaluation>`.
> Finally, output `<verdict>PASS</verdict>` or `<verdict>FAIL</verdict>`.
> If FAIL, provide exact line numbers to fix."

---

## Skill Checklist Before Using a Generated Prompt
- [ ] Does it define a clear persona?
- [ ] Are the rules explicit and heavily weighted toward negative constraints (what *not* to do)?
- [ ] Is there a dedicated `<thinking>` or `<analysis>` step required before the final output?
- [ ] Is the expected output format wrapped in clear XML tags?
