"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The proof shot for /ai: what actually happens after you paste the prompt.
 *
 * Everything else on the page *asserts* that an agent will read your repo and
 * build the right checks. A developer reads that and thinks "sure it will." This
 * shows it — named files it inspected, and the specific, varied checks that fall
 * out of them (body assertion, TCP, SSL, heartbeat). The concreteness is the
 * persuasion; keep the filenames and check types plausible for a real project.
 *
 * Built on plain state + CSS transitions rather than motion/react on purpose:
 * this sits above the fold on a page where every visitor is a click we paid for,
 * and framer-motion is ~50KB gz. The homepage's AIChat (lazy, below the fold)
 * is the right place for that cost — see LazyAIChat.
 */

type DemoLine =
  | { kind: "user"; text: string }
  | { kind: "status"; text: string }
  | { kind: "found"; text: string; detail: string }
  | { kind: "label"; text: string }
  | { kind: "check"; text: string; detail: string }
  | { kind: "done"; text: string };

const LINES: DemoLine[] = [
  { kind: "user", text: "Set up uptime monitoring for this project with Exit1." },
  { kind: "status", text: "Reading the repo…" },
  { kind: "found", text: "vercel.json", detail: "production domain" },
  { kind: "found", text: "app/api/health/route.ts", detail: "health endpoint" },
  { kind: "found", text: ".env.example", detail: "API base URL" },
  { kind: "found", text: ".github/workflows/nightly.yml", detail: "scheduled job" },
  { kind: "label", text: "6 checks to create:" },
  { kind: "check", text: "acme.com", detail: "HTTP" },
  { kind: "check", text: "api.acme.com/health", detail: 'JSONPath $.status = "ok"' },
  { kind: "check", text: "staging.acme.com", detail: "HTTP" },
  { kind: "check", text: "db.acme.com:5432", detail: "TCP" },
  { kind: "check", text: "acme.com", detail: "SSL + domain expiry" },
  { kind: "check", text: "nightly-billing", detail: "heartbeat" },
  { kind: "done", text: "Created 6 checks · alerts to you@acme.com and #ops" },
  { kind: "done", text: "Test alert sent — confirm it arrived." },
];

// Must stay above FADE_MS below, or more than one line is mid-fade at a time and
// the reveal reads as half-drawn text rather than a sequence.
const LINE_MS = 260;
const HOLD_MS = 4600;

export function AgentSetupDemo() {
  // Starts empty and fills in on mount, matching AIChat. The panel is decorative
  // proof — the page's prose carries the same claims — so a no-JS visitor losing
  // it costs nothing.
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(LINES.length);
      return;
    }

    let timer: number | undefined;

    // The hold belongs on the *finished* transcript. Holding after the reset
    // instead — which is what this did first — left the panel blank for most of
    // the cycle and flashed the completed log for a single step before wiping it.
    const schedule = (shown: number) => {
      const complete = shown >= LINES.length;
      timer = window.setTimeout(
        () => {
          const next = complete ? 0 : shown + 1;
          setVisible(next);
          schedule(next);
        },
        complete ? HOLD_MS : LINE_MS,
      );
    };

    schedule(0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="flex h-[420px] flex-col overflow-hidden rounded-2xl bg-white/[0.03] p-4 sm:h-[440px] sm:p-5"
    >
      {/* Window header — same grammar as the homepage's MCP chat panel. */}
      <div className="flex items-center gap-2 pb-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-xs text-muted-foreground">exit1 · MCP</span>
        {/* Mid-sequence the lower half of the panel is still empty. Labelling that
            state "working" is what makes it read as a log still printing rather
            than a panel that failed to render. */}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
          {visible >= LINES.length ? "done" : "working"}
        </span>
      </div>

      {/* Every line is rendered from the start and only faded in, so the panel
          never reflows as the sequence plays — no layout shift, no scroll jump.
          Opacity only, and quicker than LINE_MS: animating a transform here made
          the text look like it was being redrawn mid-paint. */}
      <div className="flex min-h-0 flex-1 flex-col justify-start gap-[7px] font-mono text-xs leading-relaxed">
        {LINES.map((line, i) => (
          <div
            key={i}
            className={cn(
              "transition-opacity duration-150 ease-out",
              i < visible ? "opacity-100" : "opacity-0",
            )}
          >
            <DemoRow line={line} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoRow({ line }: { line: DemoLine }) {
  switch (line.kind) {
    case "user":
      return (
        <div className="mb-1 rounded-lg bg-white/[0.06] px-3 py-2 text-foreground/90">
          <span className="text-foreground/40">&gt; </span>
          {line.text}
        </div>
      );

    case "status":
      return <p className="text-muted-foreground">{line.text}</p>;

    case "found":
      return (
        <div className="flex items-baseline gap-2 pl-3">
          <span className="text-primary">✓</span>
          <span className="text-foreground/80">{line.text}</span>
          <span className="truncate text-muted-foreground/70">{line.detail}</span>
        </div>
      );

    case "label":
      return <p className="pt-2 text-muted-foreground">{line.text}</p>;

    case "check":
      return (
        <div className="flex items-baseline gap-2 pl-3">
          <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-success" />
          <span className="text-foreground/90">{line.text}</span>
          <span className="ml-auto shrink-0 pl-3 text-muted-foreground/70">{line.detail}</span>
        </div>
      );

    case "done":
      return <p className="pt-1.5 text-success">{line.text}</p>;
  }
}
