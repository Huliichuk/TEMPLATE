#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

/**
 * Skill Validator - Validates a skill against the Anthropic Skills Framework.
 *
 * Checks:
 * - SKILL.md exists
 * - YAML frontmatter has name and description
 * - Description is not a placeholder
 * - Required sections present
 * - No empty subdirectories
 * - File size under 300 lines
 */

const USAGE = `
Usage: npx tsx validate_skill.ts <skill-directory>

Arguments:
  skill-directory    Path to the skill directory to validate.

Example:
  npx tsx .agent/skills/skill-creator/scripts/validate_skill.ts .agent/skills/my-skill
`;

interface ValidationResult {
    pass: boolean;
    message: string;
}

function validateSkill(skillDir: string): ValidationResult[] {
    const results: ValidationResult[] = [];
    const skillMdPath = path.join(skillDir, "SKILL.md");

    // 1. Check SKILL.md exists
    if (!fs.existsSync(skillMdPath)) {
        results.push({ pass: false, message: "SKILL.md not found" });
        return results; // Can't continue without it
    }
    results.push({ pass: true, message: "SKILL.md exists" });

    const content = fs.readFileSync(skillMdPath, "utf-8");
    const lines = content.split("\n");

    // 2. Check YAML frontmatter
    if (!content.startsWith("---")) {
        results.push({ pass: false, message: "Missing YAML frontmatter (must start with ---)" });
    } else {
        const endIndex = content.indexOf("---", 3);
        if (endIndex === -1) {
            results.push({ pass: false, message: "Unclosed YAML frontmatter" });
        } else {
            const frontmatter = content.substring(3, endIndex);

            // Check name field
            if (/^name:\s*.+/m.test(frontmatter)) {
                results.push({ pass: true, message: "Has 'name' field" });
            } else {
                results.push({ pass: false, message: "Missing 'name' field in frontmatter" });
            }

            // Check description field
            if (/^description:\s*.+/m.test(frontmatter)) {
                const descMatch = frontmatter.match(/^description:\s*(.+)/m);
                const desc = descMatch?.[1]?.trim() ?? "";

                if (desc.includes("[TODO") || desc.length < 10) {
                    results.push({ pass: false, message: `Description is placeholder or too short: "${desc}"` });
                } else {
                    results.push({ pass: true, message: "Has valid 'description' field" });
                }
            } else {
                results.push({ pass: false, message: "Missing 'description' field in frontmatter" });
            }
        }
    }

    // 3. Check required sections
    const requiredSections = ["## Overview"];
    const recommendedSections = ["## When to Use", "## Instructions", "## Examples"];

    for (const section of requiredSections) {
        if (content.includes(section)) {
            results.push({ pass: true, message: `Has required section: ${section}` });
        } else {
            results.push({ pass: false, message: `Missing required section: ${section}` });
        }
    }

    let hasAtLeastOneRecommended = false;
    for (const section of recommendedSections) {
        if (content.includes(section)) {
            hasAtLeastOneRecommended = true;
        }
    }
    if (hasAtLeastOneRecommended) {
        results.push({ pass: true, message: "Has at least one of: When to Use, Instructions, Examples" });
    } else {
        results.push({
            pass: false,
            message: "Missing all recommended sections (need at least one of: When to Use, Instructions, Examples)",
        });
    }

    // 4. Check file size
    if (lines.length > 300) {
        results.push({
            pass: false,
            message: `SKILL.md is ${lines.length} lines (max 300). Move content to references/`,
        });
    } else {
        results.push({ pass: true, message: `SKILL.md is ${lines.length} lines (under 300)` });
    }

    // 5. Check for empty subdirectories
    const entries = fs.readdirSync(skillDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const subDirPath = path.join(skillDir, entry.name);
            const subEntries = fs.readdirSync(subDirPath);
            if (subEntries.length === 0) {
                results.push({ pass: false, message: `Empty directory: ${entry.name}/` });
            }
        }
    }

    // 6. Check for TODO placeholders in content (outside frontmatter)
    const bodyContent = content.substring(content.indexOf("---", 3) + 3);
    const todoMatches = bodyContent.match(/\[TODO[^\]]*\]/g);
    if (todoMatches && todoMatches.length > 0) {
        results.push({
            pass: false,
            message: `Found ${todoMatches.length} unfilled [TODO] placeholder(s)`,
        });
    } else {
        results.push({ pass: true, message: "No unfilled [TODO] placeholders" });
    }

    return results;
}

// Main
const args = process.argv.slice(2);
const skillDir = args[0];

if (!skillDir || args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    process.exit(0);
}

const resolvedDir = path.resolve(skillDir);
if (!fs.existsSync(resolvedDir)) {
    console.error(`❌ Directory not found: ${resolvedDir}`);
    process.exit(1);
}

console.log(`\n🔍 Validating skill: ${path.basename(resolvedDir)}\n`);

const results = validateSkill(resolvedDir);
const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass).length;

for (const r of results) {
    console.log(`  ${r.pass ? "✅" : "❌"} ${r.message}`);
}

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    console.log("⚠️  Fix the issues above before using this skill.");
    process.exit(1);
} else {
    console.log("🎉 Skill is valid and ready to use!");
    process.exit(0);
}
