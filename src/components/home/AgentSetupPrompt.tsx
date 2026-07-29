"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * The second path out of the hero, for developers who'd rather not leave their
 * editor.
 *
 * The pitch isn't "sign up from your terminal" — it's that the AI tool has
 * something the URL field above can never have: the codebase. So the prompt
 * tells it to read the repo and work out what should be monitored, rather than
 * asking the visitor to think of URLs.
 *
 * Deliberately quieter than HeroCTA: muted, smaller type, no filled button.
 * It's an alternative route, not a competing call to action.
 *
 * Keep this text in sync with app.exit1.dev/mcp and the `setup_monitoring` MCP
 * prompt in functions/src/mcp-tools.ts (exit1.dev repo).
 */
const SETUP_PROMPT = `Set up uptime monitoring for this project with Exit1.

1. Add the MCP server:
   claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1
2. Call get_account to see my plan limits.
3. Read this repo to find what should be monitored — deployed URLs in
   vercel.json / next.config / wrangler.toml / .env.production / README,
   and any /health or /api/status route handlers.
4. Show me the checks you plan to create before creating them.
5. Configure email alerts, then send a test alert so I can confirm
   delivery works.`;

export function AgentSetupPrompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SETUP_PROMPT);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Clipboard can be blocked by permissions policy. The text is selectable
      // in the <pre> below, so there's still a way through.
    }
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-2xl px-4 text-left sm:mt-20">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Or set it up without leaving your editor
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="w-full cursor-pointer rounded-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copy prompt
            </>
          )}
        </Button>
      </div>

      <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-left font-mono text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
        <code>{SETUP_PROMPT}</code>
      </pre>

      <p className="mt-3 text-sm text-muted-foreground">
        Paste it into Claude Code, Cursor, Codex or any MCP-capable assistant. It reads your
        repo, creates the checks, and sends you a real test alert. Sign-in happens in your
        browser — no API key to manage.
      </p>

      <span aria-live="polite" className="sr-only">
        {copied ? "Prompt copied to clipboard" : ""}
      </span>
    </div>
  );
}
