"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  MCP_ADD_COMMAND,
  MCP_CONNECT_COMMANDS_COPY,
  SETUP_PROMPT,
  SETUP_PROMPT_PREVIEW,
} from "@/lib/setupPrompt";

/**
 * Two-line entry point for developers who'd rather not leave their editor.
 *
 * The pitch isn't "sign up from your terminal": it's that the AI tool has
 * something a URL field never will: the codebase. So the prompt tells the agent
 * to go find what's worth monitoring instead of asking the visitor to think of
 * URLs.
 *
 * Connect-first on purpose. MCP clients load servers at startup, so an agent
 * that adds the server mid-session can't use it until a restart; a real
 * onboarding run cost two restarts before this was reordered. Line 1 copies
 * both terminal commands (add + `claude mcp login`, which does the browser
 * sign-in with no session running). Line 2 is the prompt, which still carries
 * a bounce path for people who paste first anyway.
 *
 * Deliberately two truncated lines. They only have to signal "run this, take
 * this": the full text lives on the clipboard, not on the page, and a
 * ten-line code block in the hero would bury the primary CTA.
 *
 * The /ai campaign landing page is the same idea given the whole page, and
 * shares SETUP_PROMPT from lib/setupPrompt.
 */

function CopyLine({
  step,
  display,
  copyText,
  title,
  announce,
}: {
  step: string;
  display: string;
  copyText: string;
  title: string;
  announce: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Clipboard can be blocked by permissions policy; nothing useful to do
      // beyond leaving the button in its idle state.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      className="group flex w-full max-w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-foreground/5"
    >
      <span aria-hidden className="shrink-0 font-mono text-xs text-foreground/30">
        {step}
      </span>
      {/* min-w-0 is what lets the flex child actually shrink and truncate. */}
      <span className="min-w-0 flex-1 truncate font-mono text-xs sm:text-sm text-foreground/50">
        {display}
      </span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-foreground/60" aria-hidden="true" />
      ) : (
        <Copy
          className="h-3.5 w-3.5 shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/60"
          aria-hidden="true"
        />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? announce : ""}
      </span>
    </button>
  );
}

export function AgentSetupPrompt() {
  return (
    <div className="mx-auto mt-16 sm:mt-20 flex w-full max-w-xl flex-col items-center px-4">
      {/* Each whole line is the affordance: no field, no submit, just text you take. */}
      <CopyLine
        step="1"
        display={MCP_ADD_COMMAND}
        copyText={MCP_CONNECT_COMMANDS_COPY}
        title="Copy connect commands"
        announce="Connect commands copied to clipboard"
      />
      <CopyLine
        step="2"
        display={SETUP_PROMPT_PREVIEW}
        copyText={SETUP_PROMPT}
        title="Copy prompt"
        announce="Prompt copied to clipboard"
      />

      <p className="mt-2 text-xs text-foreground/40">
        Connect once in your terminal, then paste the prompt into Claude Code, Cursor or VS
        Code. It sets up monitoring from your repo.
      </p>
    </div>
  );
}
