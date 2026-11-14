---
title: "MCP Is Here: Query Your Monitors from Claude, Cursor, VS Code & More"
author: "Morten Pradsgaard"
date: "2026-03-31"
updated: "2026-11-14"
category: "ai"
excerpt: "Connect exit1.dev to your AI assistant via the Model Context Protocol. Let it create monitors and set up alerts, then ask about uptime, failures, and response times in plain English."
readTime: "4 min read"
metaDescription: "exit1.dev supports MCP with 14 tools, read and write. Connect Claude, Cursor, VS Code, Windsurf, Codex, Gemini, and more with one command and no API key."
---

# MCP Is Here: Query Your Monitors from AI

Dashboards are great until you're in the middle of something else and just need a quick answer. "Is anything down?" "What's the uptime this month?" "Show me the last few failures." You shouldn't have to open a new tab and click through three screens for that.

That's why we built an [MCP integration](/mcp) for exit1.dev.

## What Is MCP?

MCP (Model Context Protocol) is an open standard that lets AI assistants talk to external tools. Think of it as a bridge between your AI assistant and your monitoring. Once connected, tools like Claude, Cursor, VS Code, Windsurf, Codex, Gemini, Goose, and ChatGPT can pull live data from exit1.dev, answer questions about your checks, uptime, and incidents, and set monitoring up for you.

No dashboards. No API calls. Just ask.

## What You Can Do

Once connected, your AI assistant has 14 tools: 7 read and 7 write.

The read tools:

- **`get_account`**: your plan and its limits, so the assistant plans within them
- **`list_checks`**: all your monitors and their current status
- **`get_check`**: details for one check
- **`get_check_history`**: timestamps, status codes, and errors for any check
- **`get_check_stats`**: uptime % and response times across time ranges
- **`get_status_page`**: current snapshot of a status page
- **`get_alert_settings`**: where your alerts go today

The write tools are `create_check`, `update_check`, `toggle_check`, `delete_check`, `set_email_alerts`, `add_webhook_alert`, and `send_test_alert`. There is also a `setup_monitoring` prompt that carries the full setup playbook.

Some real prompts you can try:

- "Set up monitoring for this project"
- "Are any of my monitors down right now?"
- "What's the uptime for my API check over the last 30 days?"
- "Show me the last 10 failures for production"
- "Add a check on staging and send alerts to #ops in Slack"

## Setup in 2 Minutes

The hosted server lives at `https://app.exit1.dev/mcp/v1` and uses OAuth 2.1. There is no API key. In Claude Code, run one command:

```bash
claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1
```

Your browser opens, you sign in or sign up, approve the permissions, and you're connected.

If your client doesn't support the hosted server yet, run the `exit1-mcp` npm package locally with an API key. It exposes the same tools.

1. **Create an API key** in your exit1.dev dashboard (Settings > API Keys)
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

3. **Restart your AI assistant**

No account yet? Your agent can create one for you with your email. Checks run right away. Alerts start once you claim the account from the email exit1 sends you.

We have setup instructions for [Claude, Cursor, VS Code, Windsurf, Codex, Gemini, Goose, ChatGPT, and more](https://docs.exit1.dev/integrations/mcp) in the docs.

## What the Write Tools Do

Your assistant can create, update and pause checks. It can set email recipients, connect Slack, Discord or Teams, and fire a real test alert so you see delivery work. That is what lets an agent set monitoring up for you.

Delete is opt-in. The `checks:delete` scope is never granted unless the client asks for it, and the consent screen shows every permission before you approve. You can revoke a connection at any time at [app.exit1.dev/mcp](https://app.exit1.dev/mcp).

## Who Gets It?

MCP is available on **every plan, including Free**. The hosted server has no plan requirement, and every plan can mint an API key for the local package. Normal plan limits still apply: Free covers 50 monitors with 5-minute checks. Paid plans raise the check cadence: 1-minute on Indie, 30-second on Nano, 15-second on Pro.

If you're on the free plan, you already have it. Run the command above and connect.

## What's Next

The first version was read-only. Write tools, alert setup and the hosted OAuth server have shipped since then. If you have ideas for what should come next, [drop by our Discord](https://discord.com/invite/uZvWbpwJZS) and let us know.

Full setup guide: [docs.exit1.dev/integrations/mcp](https://docs.exit1.dev/integrations/mcp)

Feature page: [exit1.dev/mcp](/mcp)
