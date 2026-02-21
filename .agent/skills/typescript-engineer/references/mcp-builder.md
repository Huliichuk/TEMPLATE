---
name: mcp-builder
description: Build MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Covers full development lifecycle from research to evaluation. Use this skill when building or configuring MCP servers.
source: https://github.com/anthropics/skills/blob/main/skills/mcp-builder/SKILL.md
---

# MCP Server Development Guide

Create MCP servers that enable LLMs to interact with external services through well-designed tools. Quality is measured by how well it enables LLMs to accomplish real-world tasks.

## Recommended Stack

- **Language**: TypeScript (high-quality SDK, AI-friendly, static typing)
- **Transport**: Streamable HTTP for remote, stdio for local
- **Schema**: Zod (TypeScript) or Pydantic (Python)

## Phase 1: Deep Research and Planning

### 1.1 MCP Design Principles

**API Coverage vs. Workflow Tools**: Balance comprehensive API endpoint coverage with specialized workflow tools. When uncertain, prioritize comprehensive API coverage.

**Tool Naming**: Clear, descriptive, consistent prefixes:
```
github_create_issue
github_list_repos
stripe_create_customer
```

**Context Management**: Concise tool descriptions, filter/paginate results, return focused data.

**Actionable Error Messages**: Guide agents toward solutions with specific suggestions.

### 1.2 MCP Protocol Documentation

- Sitemap: `https://modelcontextprotocol.io/sitemap.xml`
- Fetch pages with `.md` suffix: `https://modelcontextprotocol.io/specification/draft.md`
- Key: Specification overview, transport mechanisms, tool/resource/prompt definitions

### 1.3 SDK Documentation

- **TypeScript SDK**: `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- **Python SDK**: `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`

## Phase 2: Implementation

### 2.1 Core Infrastructure

- API client with authentication
- Error handling helpers
- Response formatting (JSON/Markdown)
- Pagination support

### 2.2 Tool Implementation

For each tool:

**Input Schema** (Zod/Pydantic):
```typescript
const CreateIssueSchema = z.object({
  title: z.string().describe("Issue title"),
  body: z.string().optional().describe("Issue body in Markdown"),
  labels: z.array(z.string()).optional().describe("Label names")
});
```

**Tool Annotations**:
```typescript
{
  readOnlyHint: true,       // Does not modify state
  destructiveHint: false,    // Does not destroy data
  idempotentHint: true,      // Same input = same result
  openWorldHint: false       // Closed set of possible results
}
```

**Output Schema**: Define `outputSchema` for structured data. Use `structuredContent` in responses.

**Error Handling**: Async/await for I/O, actionable error messages, pagination support.

## Phase 3: Review and Test

- Validate all tools against the API
- Test edge cases and error paths
- Verify pagination and filtering
- Check authentication flows

## Phase 4: Create Evaluations

- Create question-answer pairs for tool evaluation
- Verify answers against real API responses
- Use XML format for evaluation specifications

## MCP Server Configuration (`.mcp.json`)

```json
{
  "mcpServers": {
    "my-service": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/my-service/index.js"],
      "env": {
        "API_KEY": "${MY_SERVICE_API_KEY}"
      }
    }
  }
}
```

### Server Types

| Type | Use Case |
|---|---|
| `stdio` | Local execution, same machine |
| `sse` | Hosted/OAuth, server-sent events |
| `http` | RESTful communication |
| `websocket` | Real-time applications |

## Quality Checklist

- [ ] Clear, descriptive tool names with consistent prefixes
- [ ] Comprehensive input schemas with descriptions and examples
- [ ] Output schemas defined for structured data
- [ ] Actionable error messages
- [ ] Pagination support for list operations
- [ ] Proper authentication handling
- [ ] Tool annotations (readOnly, destructive, idempotent)
- [ ] Concise tool descriptions
