---
title: "MCP Is Here: Query Your Monitors from Claude, Cursor, VS Code & More"
author: "Morten Pradsgaard"
date: "2026-03-31"
category: "ai"
excerpt: "Connect exit1.dev to your AI assistant via the Model Context Protocol. Ask about uptime, failures, and response times in plain English."
readTime: "4 min read"
metaDescription: "exit1.dev now supports MCP. Connect to Claude, Cursor, VS Code, Windsurf, Codex, Gemini, and more. Query your monitoring data in natural language."
---

# MCP Is Here: Query Your Monitors from AI

Dashboards are great until you're in the middle of something else and just need a quick answer. "Is anything down?" "What's the uptime this month?" "Show me the last few failures." You shouldn't have to open a new tab and click through three screens for that.

That's why we built an [MCP integration](/mcp) for exit1.dev.

## What Is MCP?

MCP — Model Context Protocol — is an open standard that lets AI assistants talk to external tools. Think of it as a bridge between your AI assistant and your monitoring data. Once connected, tools like Claude, Cursor, VS Code, Windsurf, Codex, Gemini, Goose, and ChatGPT can pull live data from exit1.dev and answer questions about your checks, uptime, and incidents.

No dashboards. No API calls. Just ask.

## What You Can Do

Once connected, your AI assistant has access to 5 read-only tools:

- **List checks** — see all your monitors and their current status
- **Get check details** — response time, SSL info, maintenance windows
- **Pull history** — timestamps, status codes, and errors for any check
- **Query stats** — uptime %, average/min/max response times across time ranges
- **View status pages** — current snapshot of any public status page

Some real prompts you can try:

- "Are any of my monitors down right now?"
- "What's the uptime for my API check over the last 30 days?"
- "Show me the last 10 failures for production"
- "Compare response times this week vs last week"

## Setup in 2 Minutes

1. **Create an API key** in your exit1.dev dashboard (Settings > API Keys) with `checks:read` scope
2. **Add the MCP config** to your AI assistant:

```json
{
  "mcpServers": {
    "exit1": {
      "command": "npx",
      "args": ["-y", "exit1-mcp"],
      "env": {
        "EXIT1_API_KEY": "ek_live_your_key_here"
      }
    }
  }
}
```

3. **Restart your AI assistant** — that's it

We have setup instructions for [Claude, Cursor, VS Code, Windsurf, Codex, Gemini, Goose, ChatGPT, and more](https://docs.exit1.dev/integrations/mcp) in the docs.

## Why Read-Only?

The MCP server only reads data. It can't create, modify, or delete checks. Your API key only needs `checks:read` scope. This is intentional — your AI assistant should be able to answer questions, not accidentally delete your production monitors.

## Who Gets It?

MCP is available on the **Nano plan** ($5/month) and above. It joins unlimited monitors, SMS alerts, domain intelligence, maintenance mode, and everything else that makes Nano the plan for professionals.

If you're on the free plan, [upgrade to Nano](https://app.exit1.dev/billing) to start using it.

## What's Next

This is v1 — read-only access to your monitoring data. We're already thinking about what comes next: write operations, alert management, and deeper integrations with AI workflows. If you have ideas, [drop by our Discord](https://discord.com/invite/uZvWbpwJZS) and let us know.

Full setup guide: [docs.exit1.dev/integrations/mcp](https://docs.exit1.dev/integrations/mcp)

Feature page: [exit1.dev/mcp](/mcp)
