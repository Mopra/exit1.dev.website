"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * One-line entry point for developers who'd rather not leave their editor.
 *
 * The pitch isn't "sign up from your terminal" — it's that the AI tool has
 * something a URL field never will: the codebase. So the prompt tells the agent
 * to go find what's worth monitoring instead of asking the visitor to think of
 * URLs.
 *
 * Deliberately one line, truncated. It only has to signal "there's a prompt
 * here, take it" — the full text lives on the clipboard, not on the page, and
 * a ten-line code block in the hero would bury the primary CTA.
 *
 * Keep SETUP_PROMPT in sync with app.exit1.dev/mcp and the `setup_monitoring`
 * MCP prompt in functions/src/mcp-tools.ts (exit1.dev repo).
 */
const SETUP_PROMPT = `Set up uptime monitoring for this project with Exit1.

1. Connect the MCP server. In Claude Code:
     claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1
   Other tools: add the same HTTP MCP server however your tool does it.

   Connecting needs a one-time browser sign-in. Most AI tools CANNOT open that
   sign-in from inside a conversation turn. If the connection isn't
   authenticated, don't retry or improvise — stop and tell me to run /mcp (or my
   tool's equivalent), authenticate in the browser, and come back to you. Then
   carry on from step 2.

2. Call get_account to see my plan limits, and list_checks to see what's
   already monitored.

3. Work out what's worth monitoring by reading this project — don't ask me for
   URLs you can find yourself. Depending on the stack, look at deploy and
   infra config, environment files and examples, the README, DNS or domain
   config, container healthchecks, CI/CD workflows, and route or endpoint
   definitions. You're looking for:
     - the production site or app, and staging if there is one
     - health/status endpoints (these are the most valuable — assert on the
       response body, not just a 200, since a 200 with a dead database is
       still a 200)
     - public APIs and webhook receivers other systems depend on
     - scheduled jobs and workers (monitor these as heartbeats)
     - the apex domain, for SSL and registration expiry
   If this project has no deployed URL you can find, ask me for it.

4. Ask me two things in one go: which email address should receive alerts,
   and whether to add a Slack/Discord webhook. Then show me the checks you
   intend to create as one short list and create them when I confirm.

5. Send a test alert to every channel you set up and tell me to check it
   arrived. Don't leave a channel configured but untested.

Be fast and autonomous. Never put API keys, tokens or passwords into a check.
Prefer a few meaningful checks over many shallow ones.`;

/** What the visitor sees — the real thing is on the clipboard. */
const PREVIEW = "Set up uptime monitoring for this project with Exit1…";

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
      // Clipboard can be blocked by permissions policy — nothing useful to do
      // beyond leaving the button in its idle state.
    }
  };

  return (
    <div className="mx-auto mt-16 sm:mt-20 flex w-full max-w-xl flex-col items-center px-4">
      {/* The whole line is the affordance — no field, no submit, just text you take. */}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy prompt"
        className="group flex w-full max-w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-foreground/5"
      >
        <span aria-hidden className="shrink-0 font-mono text-xs text-foreground/30">
          &gt;
        </span>
        {/* min-w-0 is what lets the flex child actually shrink and truncate. */}
        <span className="min-w-0 flex-1 truncate font-mono text-xs sm:text-sm text-foreground/50">
          {PREVIEW}
        </span>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-foreground/60" aria-hidden="true" />
        ) : (
          <Copy
            className="h-3.5 w-3.5 shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/60"
            aria-hidden="true"
          />
        )}
      </button>

      <p className="mt-2 text-xs text-foreground/40">
        Paste into Claude Code, Cursor or VS Code — it sets up monitoring from your repo.
      </p>

      <span aria-live="polite" className="sr-only">
        {copied ? "Prompt copied to clipboard" : ""}
      </span>
    </div>
  );
}
