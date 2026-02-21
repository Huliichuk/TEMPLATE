---
name: Supabase Operations
description: Skills for interacting with Supabase database, auth, and storage
---

# Supabase Operations Skill

## When to Use
- Database schema changes (migrations)
- Data queries and debugging
- Auth troubleshooting
- RLS policy management
- Edge Function deployment

## Key Patterns

### Database Migrations
Always use `mcp_supabase_apply_migration` for DDL operations:
- CREATE/ALTER/DROP TABLE
- CREATE/ALTER/DROP INDEX
- RLS policies
- Functions/Triggers

Use `mcp_supabase_execute_sql` for data queries only:
- SELECT, INSERT, UPDATE, DELETE
- Data debugging

### Migration Naming Convention
Use descriptive snake_case names:
```
add_invoice_status_column
create_company_settings_table
add_rls_policy_for_invoices
```

### Security Best Practices
- Always enable RLS on new tables
- Run `mcp_supabase_get_advisors` with type `"security"` after DDL changes
- Never expose service role key in client code
- Use publishable (anon) key for client-side operations

### Type Generation
After schema changes, generate fresh TypeScript types:
```
mcp_supabase_generate_typescript_types(project_id)
```

### Debugging
1. Check logs: `mcp_supabase_get_logs(project_id, service="postgres")`
2. For auth issues: `mcp_supabase_get_logs(project_id, service="auth")`
3. For API issues: `mcp_supabase_get_logs(project_id, service="api")`

### Common Gotchas
- UUID columns require `gen_random_uuid()` default
- `timestamptz` preferred over `timestamp`
- Always add `created_at` and `updated_at` columns
- Foreign keys need indexes for JOIN performance
- RLS policies must handle both `SELECT` and `INSERT`/`UPDATE`/`DELETE`

## Discovery Commands
- Project ID: `mcp_supabase_list_projects()`
- Tables: `mcp_supabase_list_tables(project_id, schemas=["public"])`
- Migrations history: `mcp_supabase_list_migrations(project_id)`
- Edge Functions: `mcp_supabase_list_edge_functions(project_id)`
