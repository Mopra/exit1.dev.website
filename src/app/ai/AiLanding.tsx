"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonitorForm } from "@/components/MonitorForm";
import { Eyebrow } from "@/components/home/Eyebrow";
import { Reveal } from "@/components/home/Reveal";
import { TrustedBy } from "@/components/home/TrustedBy";
import { LazyAIChat } from "@/components/home/LazyAIChat";
import { buildSignupUrl } from "@/lib/cta";
import { COPY_PROMPT_EVENT, trackEvent } from "@/lib/analytics";
import {
  MCP_CONNECT_COMMANDS,
  MCP_CONNECT_COMMANDS_COPY,
  SETUP_PROMPT,
} from "@/lib/setupPrompt";
import { AgentSetupDemo } from "./AgentSetupDemo";

const CAMPAIGN = "kickbacks_ai";

/**
 * Ad surface, passed as `?s=` so one landing page can serve every placement and
 * still be measurable per surface.
 *
 * It matters here more than on a normal campaign: the terminal surface renders an
 * ambient, unclickable status line, so its visitors arrive by *typing*
 * exit1.dev/ai from memory and carry no referrer at all. Without an explicit
 * token those sessions are indistinguishable from organic direct traffic.
 */
const SURFACE_MEDIUM: Record<string, string> = {
  ext: "cli_extension",
  term: "cli_terminal",
};

const DEFAULT_MEDIUM = "cli_ad";

// Voice note for future edits: this page is read by developers who recognise
// marketing cadence instantly. Short declaratives. No "X, not Y" antithesis, no
// clause after an em dash re-explaining the first half, no five-item parallel
// lists. State the thing and stop. Don't explain arithmetic they can do.
const STEPS = [
  {
    title: "Connect it",
    body: "One paste in your terminal. The login opens your browser to sign in. No API key, no config file. No account yet? You get one here.",
  },
  {
    title: "Paste it",
    body: "Claude Code, Cursor, Codex, VS Code, whatever you use. The agent reads the repo and proposes the checks.",
  },
  {
    title: "Read what it built",
    body: "It lists the checks, the alert channels, and the test alert it sent. Argue with it if it got something wrong.",
  },
];

// The demo panel already *shows* what the agent does — it names the files it read
// and prints the checks, the alert channels and the test alert. A feature grid
// restating that in prose was pure repetition, so this replaces it with the one
// question the panel raises and nothing else on the page answered: pasting that
// prompt hands an agent write access to your monitoring, so what does it get?
const CAN = [
  "Create, update and pause checks",
  "Read uptime, history and stats",
  "Set who gets alert email",
  "Wire up Slack, Discord, Teams, webhooks",
  "Send a test alert",
];

const CANNOT = [
  "Delete anything. checks:delete isn't granted unless a client asks for it.",
  "Get around your plan limits. Every tool hits the same REST API, checked server-side.",
  "Keep working after you revoke it. That kills every token for that client.",
  "Act without your editor getting a chance to warn you. delete_check is flagged destructive.",
];

const FREE_INCLUDES = [
  "50 monitors",
  "5-minute checks",
  "MCP access + 1 API key",
  "300 alert emails / month",
  "1 public status page",
  "60-day history",
];

export function AiLanding() {
  const [medium, setMedium] = useState(DEFAULT_MEDIUM);

  // Read the surface client-side rather than via searchParams so the route stays
  // static. The CTA href is correct from first paint either way — this only
  // refines which surface gets the credit.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("s");
    if (s && SURFACE_MEDIUM[s]) setMedium(SURFACE_MEDIUM[s]);
  }, []);

  const signupUrl = buildSignupUrl({ campaign: CAMPAIGN, medium });

  return (
    <>
      {/* ---- Hero: the argument is a picture — paste this, get that ---- */}
      <section className="px-5 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* "Synthetic monitoring" is the term this audience already has a mental
              model for — probes from outside on a schedule, as opposed to RUM.
              "Uptime monitoring" reads as ping-checking and undersells the
              assertions. Note the site only used the word in blog posts before. */}
          <Eyebrow dot>Synthetic monitoring · MCP</Eyebrow>
          <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.05] tracking-tight sm:text-6xl sm:leading-[0.98]">
            You&rsquo;ll set up monitoring
            <br />
            later. You won&rsquo;t.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            It&rsquo;s forty minutes of forms, which is why it&rsquo;s still on your list. Paste
            this instead. Your agent reads the repo and does it.
          </p>
        </div>

        {/* Side by side, the two panels make the whole pitch without a headline:
            the thing you paste, and the thing you get back. */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-2">
          <div>
            <CopyPrompt campaign={CAMPAIGN} medium={medium} />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Connect, then paste this.
            </p>
          </div>
          <div>
            <AgentSetupDemo />
            <p className="mt-3 text-center text-sm text-muted-foreground">Get this.</p>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4">
          <Button asChild variant="outline" size="lg" className="cursor-pointer rounded-full px-7">
            <a href={signupUrl}>
              Or sign up the normal way
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">50 monitors free. No card.</p>
        </div>
      </section>

      {/* ---- What the thing actually is. Cold traffic arrives knowing only that
              an agent will set *something* up; naming the category does the work
              a feature grid was doing badly. ---- */}
      <section className="px-5 pt-24 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              It&rsquo;s synthetic monitoring
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Boring term, precise one. Real requests hitting your endpoints from outside your
              infra, on a schedule. A 200 with a dead database is still a 200, so the checks
              assert on the response body with JSONPath. TCP ports, ICMP, SSL expiry and cron
              heartbeats as well.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Three steps ---- */}
      <section className="px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              Three things happen
            </h2>
          </Reveal>
          <ol className="mt-10 space-y-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={0.05 * i}>
                <li className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 font-mono text-sm font-bold text-primary"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* The session-restart cliff is where this flow actually stalls. Naming
              it costs a paragraph and saves the visitor deciding we shipped
              something broken. */}
          <Reveal delay={0.15}>
            <p className="mt-12 rounded-xl bg-warning/[0.07] p-5 leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Where this breaks.</span> AI tools
              load MCP servers at startup and can&rsquo;t open a browser sign-in
              mid-conversation. That&rsquo;s why you connect before you paste. Pasted first
              anyway? The prompt tells the agent to stop, hand you the connect commands, and
              have you resume with <code className="font-mono">claude --continue</code> rather
              than guess.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- The objection the demo creates: what am I actually handing over? ---- */}
      <section className="px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="max-w-3xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              Yes, it can write to your account
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Here&rsquo;s the blast radius. Every permission is on the consent screen before you
              approve, and you can revoke any client at{" "}
              <span className="font-mono text-base text-foreground/80">app.exit1.dev/mcp</span>.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12">
            <Reveal delay={0.1}>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-success">
                It can
              </h3>
              <ul className="mt-5 space-y-3">
                {CAN.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                It can&rsquo;t
              </h3>
              <ul className="mt-5 space-y-3">
                {CANNOT.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                    <X
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cold traffic from an ambient ad has never heard of us. The homepage's
          calm logo band is the cheapest available "this is a real product". */}
      <TrustedBy />

      {/* ---- Second act: life after setup. Reuses the homepage's MCP chat. ---- */}
      <section className="px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Reveal>
                <Eyebrow dot>After setup</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
                  Then stop opening dashboards
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Same connection, read side. Ask in the editor you&rsquo;re already sitting in.
                  What&rsquo;s down, what&rsquo;s flaky, what broke last Tuesday.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <LazyAIChat />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Free is the on-ramp. Indie gets a real pitch, not a grey footnote. ---- */}
      <section className="px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              Free is 50 monitors. Not a trial.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              The MCP server has no plan requirement at all. Nothing to pay to find out whether
              this works.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {FREE_INCLUDES.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Indie gets its own block and the pricing page's tier accent rather
              than a trailing grey sentence. Leading with free shouldn't mean
              arguing nobody should pay. */}
          <Reveal delay={0.15}>
            <div className="mt-12 rounded-xl bg-tier-indie/[0.06] p-6">
              <div className="flex items-center gap-2.5">
                <Rocket className="h-4 w-4 text-tier-indie" aria-hidden="true" />
                <h3 className="font-semibold text-foreground">
                  Got users? Get 1-minute checks
                </h3>
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Free checks every 5 minutes. That&rsquo;s a 5-minute outage nobody told you
                about. Indie drops it to 1 minute, doubles you to 100 monitors, keeps 90 days of
                history. <span className="font-semibold text-foreground">$3/mo</span> on annual,
                after 7 days free.
              </p>
              <a
                href="/pricing"
                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-tier-indie transition-colors hover:text-tier-indie/80"
              >
                Compare every plan
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Closing. The prompt again, plus the one-field on-ramp for anyone
              who isn't at their editor. Deliberately below the prompt, not
              beside it — a URL field argues against the whole pitch. ---- */}
      <section className="px-5 pb-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
              Go paste it
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              You&rsquo;ve read enough.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <CopyPrompt campaign={CAMPAIGN} medium={`${medium}_closing`} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14">
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Not at your editor? Drop a URL.
              </p>
              <MonitorForm
                campaign={CAMPAIGN}
                medium={`${medium}_form`}
                submitLabel="Monitor it"
                helperText={null}
              />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              <a
                href="https://docs.exit1.dev/integrations/mcp"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Setup reference
              </a>{" "}
              ·{" "}
              <a href="/mcp" className="underline underline-offset-4 hover:text-foreground">
                All 14 tools
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * The connect-then-paste block. Copying the prompt is the conversion event on
 * this page: the account is created later, during `claude mcp login`, where no
 * tagged link can reach.
 *
 * The connect commands sit above the prompt because MCP clients load servers at
 * startup; an agent handed the prompt in a session without the server can't fix
 * that from inside the conversation.
 *
 * Height matches AgentSetupDemo so the two hero panels line up.
 */
function CopyPrompt({ campaign, medium }: { campaign: string; medium: string }) {
  const [copied, setCopied] = useState<"commands" | "prompt" | null>(null);

  const handleCopy = async (target: "commands" | "prompt") => {
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(
        target === "commands" ? MCP_CONNECT_COMMANDS_COPY : SETUP_PROMPT,
      );
      setCopied(target);
      window.setTimeout(() => setCopied(null), 2000);
      trackEvent(COPY_PROMPT_EVENT, { campaign, medium, target });
    } catch {
      // Clipboard can be blocked by permissions policy; leave the button idle
      // rather than claiming a copy that didn't happen.
    }
  };

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl bg-white/[0.03] p-4 sm:h-[440px] sm:p-5">
      <div className="flex items-center justify-between gap-4 pb-3">
        <span className="font-mono text-xs text-muted-foreground">1 · connect</span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleCopy("commands")}
          className="cursor-pointer rounded-full px-4 font-semibold"
        >
          {copied === "commands" ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-foreground/65">
        <code>{MCP_CONNECT_COMMANDS}</code>
      </pre>

      <div className="my-4 h-px shrink-0 bg-white/[0.06]" />

      <div className="flex items-center justify-between gap-4 pb-3">
        <span className="font-mono text-xs text-muted-foreground">2 · paste the prompt</span>
        <Button
          type="button"
          size="sm"
          onClick={() => handleCopy("prompt")}
          className="cursor-pointer rounded-full px-4 font-semibold"
        >
          {copied === "prompt" ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Enough of the real text to prove it's substantial, faded out at the
          bottom rather than scrollable so it never steals the page's scroll.
          Masked rather than overlaid with a gradient so the fade doesn't have to
          know the panel's tinted background colour; same approach as AIChat. */}
      <div className="min-h-0 flex-1">
        <pre className="h-full overflow-hidden font-mono text-xs leading-relaxed text-foreground/65 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
          <code>{SETUP_PROMPT}</code>
        </pre>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied === "prompt"
          ? "Setup prompt copied to clipboard"
          : copied === "commands"
            ? "Connect commands copied to clipboard"
            : ""}
      </span>
    </div>
  );
}
