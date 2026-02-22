---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends the agent's capabilities with specialized knowledge, workflows, or tool integrations.
---

# Skill Creator

This skill provides guidance for creating effective skills using the Anthropic Skills Framework.

## About Skills

Skills are modular, self-contained folders that extend the agent's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks—they transform a general-purpose agent into a specialized expert.

**What Skills Provide:**
1. **Specialized workflows** - Multi-step procedures for specific domains.
2. **Tool integrations** - Instructions for working with specific file formats or APIs.
3. **Domain expertise** - Company-specific knowledge, schemas, business logic.
4. **Bundled resources** - Scripts, references, and assets for complex and repetitive tasks.

---

## Core Principles

### 1. Concise is Key
The context window is a public good. **Default assumption: The agent is already very smart.** Only add context the agent doesn't already have. Challenge each piece of information: "Does the agent really need this explanation?" and "Does this paragraph justify its token cost?" Prefer concise examples over verbose explanations.

### 2. Set Appropriate Degrees of Freedom
Match the level of specificity to the task's fragility and variability:
- **High freedom (text instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.
- **Medium freedom (pseudocode/parameters)**: Use when a preferred pattern exists, and some variation is acceptable.
- **Low freedom (specific scripts)**: Use when operations are fragile and error-prone, and consistency is critical.

### 3. Keep it Simple
Skills should be easy to read and understand. Avoid overly complex instructions.

---

## Anatomy of a Skill

Every skill consists of a required `SKILL.md` file and optional bundled resources.

```
skill-name/
├── SKILL.md              (required — instructions + metadata)
├── scripts/              (optional — executable automation, e.g., TypeScript/Bash)
├── references/           (optional — docs to be used if needed)
└── assets/               (optional — files used in output, templates, icons)
```

> **IMPORTANT**: A skill should only contain essential files. Do NOT create extraneous documentation like `README.md`, `INSTALLATION_GUIDE.md`, or `CHANGELOG.md`.

---

## Skill Creation Process

Follow these steps to create or update a skill:

### Step 1: Understand & Plan
- Understand the skill functionality with concrete examples. What exact workflows will the agent execute?
- Identify reusable contents: What scripts, references, and assets are needed?

### Step 2: Initialize
Use the scaffolding script to create a template skill directory.

```bash
npx tsx .agent/skills/skill-creator/scripts/create_skill.ts <skill-name>
```

- Target skill name should be **kebab-case**, under 64 characters, preferably verb-led.

### Step 3: Write SKILL.md and Resources
- Implement the reusable `scripts/`, `references/`, and `assets/`.
- Edit `SKILL.md` using **imperative language**.
- **YAML Frontmatter**: The `description` field is the primary triggering mechanism. Be highly specific about *when* the agent should invoke it.
- **Progressive Disclosure**: If files are large (>10k words), include grep search patterns or instructions on exactly when the agent should `view_file` them.

### Step 4: Validate
Validate the directory to catch structural issues:

```bash
npx tsx .agent/skills/skill-creator/scripts/validate_skill.ts .agent/skills/<skill-name>
```

Validation ensures:
- ✅ YAML frontmatter (`name`, `description`) is present.
- ✅ No empty subdirectories exist.
- ✅ File size bounds are respected.

### Step 5: Iterate
Use the skill on real tasks. If the agent struggles, gets confused, or uses too much context, modify `SKILL.md` or move bulky text to the `references/` folder to refine progressive disclosure.
