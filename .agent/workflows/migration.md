---
description: Create and apply Supabase database migrations safely
---

# Migration Workflow

Purpose: Create, validate, and apply database migrations without data loss.

---

## Step 1 — Plan the migration

- Define what changes: new table, column, index, RLS policy, function
- Check current schema state:

```bash
# Via MCP
# mcp_supabase_list_tables(project_id, schemas=["public"])
# mcp_supabase_list_migrations(project_id)
```

- Identify dependencies (foreign keys, triggers, policies)
- If destructive (DROP, ALTER TYPE) — flag for review

---

## Step 2 — Write the migration

- Use `mcp_supabase_apply_migration()` for DDL
- Use `mcp_supabase_execute_sql()` for data queries only
- Migration naming: `snake_case` descriptive name (e.g., `add_due_date_to_invoices`)

### Rules

- One migration = one logical change
- Always include `IF NOT EXISTS` / `IF EXISTS` guards
- Always add RLS policies for new tables
- Never hardcode generated IDs in data migrations
- Include rollback comment at the top if destructive

---

## Step 3 — Validate

```bash
# Check migration was applied
# mcp_supabase_list_migrations(project_id)

# Verify table structure
# mcp_supabase_execute_sql(project_id, "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'my_table'")

# Run security advisors
# mcp_supabase_get_advisors(project_id, type="security")
```

---

## Step 4 — Generate types

```bash
# Regenerate TypeScript types after schema changes
# mcp_supabase_generate_typescript_types(project_id)
```

- Update local type files if needed
- Verify TypeScript compilation passes

---

## Output

- Migration name and what it changed
- Advisor warnings (if any)
- Type generation status
