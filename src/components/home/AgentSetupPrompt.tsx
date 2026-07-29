"use client"

import { Button } from '@/components/ui/button'
import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

/**
 * The agent-onboarding entry point.
 *
 * The whole pitch is that the AI tool has something a signup form never will —
 * the codebase. So the prompt tells it to read the repo and work out what should
 * be monitored, rather than asking the developer to type URLs into a box.
 *
 * Keep this text in sync with the copy on app.exit1.dev/mcp and the
 * `setup_monitoring` MCP prompt in functions/src/mcp-tools.ts.
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
   delivery works.`

export default function AgentSetupPrompt() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SETUP_PROMPT)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // Clipboard can be blocked by permissions policy — the text is selectable
      // in the <pre> below, so there's still a way through.
    }
  }

  return (
    <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-foreground/80">
          <Terminal className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">Or set it up without leaving your editor</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="backdrop-blur-md border-foreground/30 hover:bg-foreground/10 text-foreground cursor-pointer shrink-0 self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Copy prompt
            </>
          )}
        </Button>
      </div>

      <pre className="overflow-x-auto rounded-lg border border-foreground/20 bg-foreground/10 backdrop-blur-md p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-foreground/90">
        <code>{SETUP_PROMPT}</code>
      </pre>

      <p className="text-xs text-foreground/60 mt-2">
        Paste it into Claude Code, Cursor, Codex or any MCP-capable assistant. It reads your repo,
        creates the checks, and sends you a real test alert. Sign-in happens in your browser — no
        API key to manage.
      </p>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Prompt copied to clipboard' : ''}
      </span>
    </div>
  )
}
