"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SETUP_PROMPT, SETUP_PROMPT_PREVIEW } from "@/lib/setupPrompt";

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
 * The /ai campaign landing page is the same idea given the whole page, and
 * shares SETUP_PROMPT from lib/setupPrompt.
 */

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
          {SETUP_PROMPT_PREVIEW}
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
