---
name: orchestrator-patterns
description: Anthropic Cookbook patterns for Orchestrator-Worker and Evaluator-Optimizer workflows. Benchmark 82.4.
source: https://github.com/anthropics/anthropic-cookbook (Official Anthropic)
---

# Agent Orchestration Patterns — Reference

## 1. Orchestrator-Worker Implementation

This pattern uses a central Orchestrator to break down tasks, which are then processed by concurrent Workers.

### Orchestrator Prompt

```xml
<orchestrator_prompt>
Analyze this complex task and break it down into distinct sub-tasks:

Task: {task}

Return your response in this exact format:

<analysis>
Explain your understanding of the task and how you plan to divide it.
</analysis>

<tasks>
    <task>
        <type>research</type>
        <description>Specific research goal</description>
    </task>
    <task>
        <type>implementation</type>
        <description>Specific coding task</description>
    </task>
</tasks>
</orchestrator_prompt>
```

### Worker Prompt

```xml
<worker_prompt>
You are a specialized worker. Complete this specific sub-task based on the original goal.

Original Task Context: {original_task}
Your Specific Sub-Task: {task_type}
Guidelines: {task_description}

Return your response in this format:

<response>
Your detailed content or code here, strictly adhering to your sub-task guidelines.
</response>
</worker_prompt>
```

## 2. Evaluator-Optimizer (Self-Correction Loop)

A continuous loop where an Evaluator critiques the generation until a `PASS` criteria is met.

### Generator Prompt

```xml
<generator_prompt>
Generate a solution for the following task.
Task: {task}

Previous Context & Feedback (if any):
{context}

Provide your reasoning in <thoughts> and your final output in <response>.
</generator_prompt>
```

### Evaluator Prompt

```xml
<evaluator_prompt>
You are a strict evaluator. Review the generated content against the original task requirements.

Original task: {task}
Content to evaluate: {content}

Output your status as either PASS or FAIL inside <evaluation>.
Output specific, actionable feedback inside <feedback>.

<evaluation>FAIL</evaluation>
<feedback>The implementation is sound, but it lacks TypeScript interfaces for the API response.</feedback>
</evaluator_prompt>
```

## 3. The Execution Loop (Example pseudocode)

```typescript
// 1. Generate initial draft
let { thoughts, result } = await generate(generator_prompt, task);
let attempts = 1;
const MaxAttempts = 3;

// 2. Evaluation Loop
while (attempts <= MaxAttempts) {
  const { evaluation, feedback } = await evaluate(evaluator_prompt, result, task);
  
  if (evaluation === "PASS") {
    return result; // Success!
  }
  
  // 3. Formulate new context with feedback
  const context = `Previous Attempt:\n${result}\n\nEvaluator Feedback:\n${feedback}`;
  
  // 4. Regenerate
  const generation = await generate(generator_prompt, task, context);
  result = generation.result;
  attempts++;
}

return result; // Or throw error
```

## Key Rules for Effective LLM Orchestration
- **XML Tagging:** Always use XML tags (`<thoughts>`, `<response>`) to structure inputs and extract outputs deterministically.
- **Fail Gracefully:** Workers can fail. Handle empty or malformed XML outputs so the orchestrator doesn't crash.
- **Context Management:** Only pass the necessary context to workers to save tokens and maintain focus.
