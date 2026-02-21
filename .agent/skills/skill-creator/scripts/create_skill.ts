#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

/**
 * Skill Initializer - Creates a new skill from template
 * Adheres to Anthropic Skills Framework principles.
 *
 * Creates only the SKILL.md file — no empty subdirectories.
 * Add scripts/, references/, etc. only when needed.
 */

const USAGE = `
Usage: npx tsx create_skill.ts <skill-name> [target-parent-dir]

Arguments:
  skill-name         Name of the skill (kebab-case recommended)
  target-parent-dir  Optional. Parent directory to create the skill in.
                     Defaults to ".agent/skills" in the current workspace.
`;

async function initSkill(): Promise<void> {
  const args = process.argv.slice(2);
  const skillName = args[0];
  let parentDir = args[1];

  if (!skillName || args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    process.exit(0);
  }

  if (!/^[a-z][a-z0-9-]*$/.test(skillName)) {
    console.error("❌ Error: Skill name must be kebab-case (e.g., my-skill-name)");
    process.exit(1);
  }

  if (!parentDir) {
    parentDir = path.join(process.cwd(), ".agent", "skills");
  }

  const skillDir = path.resolve(parentDir, skillName);

  if (fs.existsSync(skillDir)) {
    console.error(`❌ Error: Skill directory already exists: ${skillDir}`);
    process.exit(1);
  }

  console.log(`Creating skill '${skillName}' at ${skillDir}...`);

  try {
    fs.mkdirSync(skillDir, { recursive: true });

    const skillTitle = skillName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const skillMdContent = `---
name: ${skillName}
description: [TODO: Add a concise description of what this skill does and when to use it.]
---

# ${skillTitle}

## Overview

[TODO: Provide a high-level summary of the skill's purpose.]

## When to Use

[TODO: Describe the trigger conditions — when should this skill be activated?]

## Instructions

[TODO: Step-by-step instructions for the agent to follow.]

## Examples

[TODO: Provide concrete examples of input/output or usage patterns.]
`;

    fs.writeFileSync(path.join(skillDir, "SKILL.md"), skillMdContent);

    console.log("✅ Skill created successfully!");
    console.log(`\nNext steps:`);
    console.log(`1. Edit ${path.join(skillDir, "SKILL.md")} — fill in all [TODO] sections`);
    console.log(`2. Add scripts/ or references/ directories only if needed`);
  } catch (error) {
    console.error(`❌ Failed to create skill: ${error}`);
    process.exit(1);
  }
}

initSkill().catch((err) => {
  console.error(err);
  process.exit(1);
});
