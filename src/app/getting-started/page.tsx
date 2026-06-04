import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  Mail,
  MessageSquareText,
  Webhook,
} from "lucide-react";
import { Eyebrow } from "@/components/home/Eyebrow";
import { Reveal } from "@/components/home/Reveal";
import { HeroVideo } from "@/components/getting-started/HeroVideo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Getting Started — Your First Monitor in Five Minutes | exit1.dev",
  description:
    "A calm, step-by-step guide to exit1.dev: create your first check, keep the sensible defaults, switch on alerts, and read the logs. A live monitor watching your URL — in about five minutes.",
  openGraph: {
    title: "Getting Started — Your First Monitor in Five Minutes | exit1.dev",
    description:
      "Create your first check, keep the sensible defaults, switch on alerts, and learn to read the logs. A live monitor watching your URL in about five minutes.",
    type: "article",
    url: "https://exit1.dev/getting-started",
  },
  twitter: {
    title: "Getting Started — Your First Monitor in Five Minutes | exit1.dev",
    description:
      "A calm, step-by-step guide to your first uptime monitor on exit1.dev.",
    card: "summary",
  },
  alternates: {
    canonical: "https://exit1.dev/getting-started",
  },
};

const APP_URL = "https://app.exit1.dev";

/* ---------------------------------------------------------------- data --- */

const OVERVIEW = [
  { n: "01", title: "Create your first check", href: "#create-check" },
  { n: "02", title: "Set the basics", href: "#basics" },
  { n: "03", title: "Confirm real outages", href: "#confirm" },
  { n: "04", title: "Turn on alerts", href: "#alerts" },
  { n: "05", title: "Watch the logs", href: "#logs" },
];

const CHECK_TYPES: { name: string; tag: string; body: string }[] = [
  { name: "Web", tag: "HTTP/S", body: "Website and page availability — the default, and the right pick for most sites." },
  { name: "API", tag: "REST", body: "REST endpoints: assert status codes and response content." },
  { name: "Redirect", tag: "3xx", body: "Verify a URL redirects exactly where it should." },
  { name: "TCP / UDP", tag: "Ports", body: "Port reachability for databases, mail, and game servers." },
  { name: "Ping", tag: "ICMP", body: "Host reachability over ICMP." },
  { name: "WS", tag: "WebSocket", body: "WebSocket handshake checks." },
  { name: "DNS", tag: "Records", body: "Watch DNS records for unexpected changes." },
  { name: "Domain", tag: "WHOIS", body: "Track domain registration expiry — no uptime probing." },
];

const BEHAVIORS: { name: string; tag: string; body: string }[] = [
  {
    name: "Immediate recheck",
    tag: "On by default",
    body: "When a probe fails, exit1 re-checks about 30 seconds later — so a one-off blip never wakes you.",
  },
  {
    name: "Confirm down after",
    tag: "Default: 4",
    body: "Consecutive failed probes required before a check is marked offline. Raise it to quiet noise; lower it to alert sooner.",
  },
  {
    name: "Max response time",
    tag: "Off by default",
    body: "Mark a check down when a response takes longer than your threshold — catches “up, but painfully slow.”",
  },
  {
    name: "Peer confirmation",
    tag: "On by default",
    body: "A suspected outage is double-checked from a second region before alerting. Leave it on unless your endpoint answers differently by geography.",
  },
];

const CHANNELS: { icon: typeof Mail; name: string; avail?: string; body: string }[] = [
  { icon: Mail, name: "Email", avail: "Every plan", body: "Down, up, SSL, and domain alerts straight to your inbox." },
  { icon: MessageSquareText, name: "SMS", avail: "Paid plans", body: "Text-message alerts for the incidents you can’t miss." },
  { icon: Webhook, name: "Webhooks", body: "POST events to your own endpoint, Slack, Discord, or Teams." },
  { icon: Bell, name: "Integrations", body: "Pushover, PagerDuty, and Opsgenie." },
];

const RECAP = [
  "Probes your URL on the interval you chose",
  "Confirms outages before crying wolf",
  "Alerts you by email — and any channel you added",
  "Records every result in the logs for review",
];

const NEXT: { title: string; body: string; href: string; external?: boolean }[] = [
  { title: "Add more checks", body: "APIs, ports, DNS records, or your domain’s expiry date.", href: APP_URL, external: true },
  { title: "Organize with folders", body: "Group checks and apply alert settings in bulk.", href: APP_URL, external: true },
  { title: "Status pages & badges", body: "Share live uptime with your users.", href: "/status-pages" },
  { title: "API & MCP", body: "Automate check management or feed your data to AI assistants.", href: "/mcp" },
];

/* -------------------------------------------------------------- helpers --- */

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 px-4 sm:px-6 py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function StepHead({
  n,
  eyebrow,
  title,
  lead,
}: {
  n: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-primary">{n}</span>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

function NumberedSteps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/[0.05] font-mono text-xs text-muted-foreground">
            {i + 1}
          </span>
          <span className="leading-relaxed text-muted-foreground">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

/* ----------------------------------------------------------------- page --- */

export default function GettingStartedPage() {
  return (
    <>
      {/* ----------------------------------------------------------- Hero -- */}
      <section className="relative overflow-hidden px-4 pt-36 pb-12 sm:px-6 sm:pt-44 sm:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow dot className="justify-center">
              Getting started
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your first monitor,
              <br className="hidden sm:block" /> live in five minutes.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Create a check, keep the sensible defaults, switch on alerts, and learn to
              read what actually happened. By the end you have a live monitor watching one
              of your URLs — and telling you the moment it goes down.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Open the app
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="#create-check"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-3.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Walk me through it
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {["No install", "10 monitors free", "No credit card"].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <HeroVideo
            src="/exit1-add-check-mockup-1.web.mp4"
            poster="/exit1-add-check-mockup-poster.jpg"
            caption="Creating your first check"
          />
        </Reveal>
      </section>

      {/* ------------------------------------------------- Before you begin -- */}
      <Section>
        <Reveal>
          <Eyebrow>Before you begin</Eyebrow>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Sign in",
              body: (
                <>
                  Create a free account at{" "}
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-primary hover:text-primary"
                  >
                    app.exit1.dev
                  </a>
                  . That sign-in is your whole setup.
                </>
              ),
            },
            {
              title: "Nothing to install",
              body: "exit1 runs every check from its own infrastructure. No agent, no script, no server of yours involved.",
            },
            {
              title: "Free to start",
              body: "Watch up to 10 checks free. Upgrade later for faster intervals, more checks, SMS alerts, and multi-region monitoring.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div>
                <h3 className="text-xl font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- The path -- */}
      <Section>
        <Reveal>
          <Eyebrow>The path</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl">
            Five calm steps, start to signal.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OVERVIEW.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.04}>
              <Link
                href={step.href}
                className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.04] hover:ring-white/[0.12]"
              >
                <span className="font-mono text-sm text-primary">{step.n}</span>
                <span className="mt-8 flex items-end justify-between gap-2 text-base font-medium leading-snug text-foreground">
                  {step.title}
                  <ArrowRight className="h-4 w-4 flex-none translate-y-[-2px] text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------- 01 Create a check -- */}
      <Section id="create-check">
        <StepHead
          n="01"
          eyebrow="Step one"
          title="Create your first check"
          lead={
            <>
              A <Strong>check</Strong> is one thing you want to watch — a website, an API
              endpoint, a server port, a DNS record. Open <Strong>Checks</Strong> in the
              sidebar and click <Strong>Add Check</Strong>; a panel slides in from the
              right.
            </>
          }
        />

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5">
            <NumberedSteps
              items={[
                <>
                  <Strong>Pick a check type.</Strong> The icon strip at the top sets what
                  you monitor. <Strong>Web</Strong> is the default and covers most cases.
                </>,
                <>
                  <Strong>Enter the URL.</Strong> For Web and API checks, choose the
                  protocol (<span className="font-mono text-foreground/80">https://</span>{" "}
                  is default) and type the rest, e.g.{" "}
                  <span className="font-mono text-foreground/80">example.com</span>.
                </>,
                <>
                  <Strong>Name it.</Strong> The display name fills in from the URL — edit
                  it to whatever you’ll recognize on your dashboard.
                </>,
                <>
                  Click <Strong>Add Check</Strong>. It goes live immediately, and its
                  online / offline status appears on the Checks page.
                </>,
              ]}
            />

            <Reveal delay={0.1}>
              <div className="mt-8 rounded-2xl bg-primary/[0.05] p-5 ring-1 ring-primary/15">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <Strong>You’re done in four clicks.</Strong> Sensible defaults are
                  applied automatically — the steps below just show you how to fine-tune
                  them.
                </p>
              </div>
            </Reveal>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Check types
              </p>
            </Reveal>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CHECK_TYPES.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.03}>
                  <div className="h-full rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/[0.06]">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-foreground">{t.name}</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
                        {t.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------- 02 Set the basics -- */}
      <Section id="basics">
        <StepHead
          n="02"
          eyebrow="Step two"
          title="Set the basics"
          lead={
            <>
              In the New Check panel — or later, by editing a check — expand{" "}
              <Strong>Settings</Strong> to reveal <Strong>Schedule</Strong>. Three small
              choices, and the defaults are good for almost everyone.
            </>
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              label: "Check every",
              value: "5 min",
              body: (
                <>
                  How often exit1 probes your URL — from a few seconds up to once a day.
                  Shorter catches outages faster; the fastest intervals (down to{" "}
                  <Strong>15 seconds</Strong>) are on paid plans.
                </>
              ),
            },
            {
              label: "Region",
              value: "EU · Frankfurt",
              body: (
                <>
                  Checks run from <Strong>Europe (Frankfurt)</Strong> by default. Paid
                  plans add <Strong>America (Boston)</Strong> to monitor closer to your
                  users or compare regions.
                </>
              ),
            },
            {
              label: "Alert timezone",
              value: "UTC",
              body: (
                <>
                  The timezone used to format timestamps in your notifications. Leave it on{" "}
                  <Strong>UTC</Strong> if you’re not sure.
                </>
              ),
            },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </span>
                <span className="mt-3 text-2xl font-medium tracking-tight text-foreground">
                  {item.value}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Checks run on a shared schedule, so the interval is approximate — a “5 minute”
            check fires roughly every five minutes, not to the exact second.
          </p>
        </Reveal>
      </Section>

      {/* ------------------------------------------ 03 Confirm real outages -- */}
      <Section id="confirm">
        <StepHead
          n="03"
          eyebrow="Step three · optional"
          title="Confirm real outages"
          lead={
            <>
              Still inside <Strong>Settings</Strong>, the <Strong>Alert behavior</Strong>{" "}
              section decides how aggressively exit1 calls something down. Defaults are
              tuned for most people — reach for these only if you see false alarms or want
              stricter checking.
            </>
          }
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {BEHAVIORS.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.04}>
              <div className="flex h-full flex-col rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium tracking-tight text-foreground">
                    {b.name}
                  </h3>
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {b.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              API checks · HTTP configuration
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              For <Strong>API</Strong> checks, an extra HTTP section lets you set the
              request method (<Strong>GET</Strong> is best for uptime — some hosts block
              HEAD), expected status codes (e.g.{" "}
              <span className="font-mono text-foreground/80">200, 201, 301-308</span>),
              request headers and body, and response-text validation. exit1 treats{" "}
              <span className="font-mono text-foreground/80">2xx</span> and{" "}
              <span className="font-mono text-foreground/80">3xx</span> as up — and{" "}
              <span className="font-mono text-foreground/80">401</span>/
              <span className="font-mono text-foreground/80">403</span> count as up for
              protected endpoints.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* --------------------------------------------------- 04 Turn on alerts -- */}
      <Section id="alerts">
        <StepHead
          n="04"
          eyebrow="Step four"
          title="Turn on alerts"
          lead="Monitoring only helps if it tells you when something breaks. exit1 delivers alerts through several channels — each set up from the sidebar."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.name} delay={i * 0.04}>
                <div className="flex h-full flex-col rounded-2xl bg-white/[0.02] p-6 ring-1 ring-white/[0.06]">
                  <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
                  <div className="mt-4 flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{c.name}</h3>
                    {c.avail && (
                      <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                        {c.avail}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                Set up email alerts
              </h3>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6">
                <NumberedSteps
                  items={[
                    <>
                      Open <Strong>Emails</Strong> from the sidebar.
                    </>,
                    <>
                      Your account email is added as a recipient automatically. Add or
                      change recipients as needed.
                    </>,
                    <>
                      Choose which events to hear about — <Strong>Down</Strong>,{" "}
                      <Strong>Up</Strong>, SSL warnings, and domain changes.
                    </>,
                    <>
                      New checks are included automatically, so your first check is already
                      covered. Toggle per check or per folder.
                    </>,
                    <>
                      Click <Strong>Send test</Strong> to confirm a notification reaches
                      your inbox.
                    </>,
                  ]}
                />
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                Good to know
              </h3>
            </Reveal>
            <Reveal delay={0.05}>
              <ul className="mt-6 space-y-4">
                {[
                  "Alerts fire only when a check changes state — up to down, or back again. No status-quo spam.",
                  "Flap detection waits for the consecutive results you choose, so a flickering endpoint doesn’t flood you.",
                  "Each channel has its own hourly budget to keep storms in check.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                    <span className="leading-relaxed text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06]">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Prefer <Strong>Slack</Strong> or <Strong>Discord</Strong>? Open{" "}
                  <Strong>Webhooks</Strong>, paste your webhook URL, and pick the same
                  events. The same per-check controls apply.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- 05 Watch logs -- */}
      <Section id="logs">
        <StepHead
          n="05"
          eyebrow="Step five"
          title="Watch the logs"
          lead="Once your check is running, you can see exactly what exit1 observed on every probe — and why an alert fired."
        />

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <Eyebrow>Logs</Eyebrow>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Each row is a single probe result — status (online, offline, paused,
                unknown), response time and HTTP code, the error reason on failure, and a
                full timing breakdown:
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["DNS", "Connect", "TLS", "First byte"].map((stage) => (
                  <span
                    key={stage}
                    className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {stage}
                  </span>
                ))}
              </div>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Filter by check, time range (last hour up to 60 days), and status to zero
                in on a specific incident.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div>
              <Eyebrow dot>Live</Eyebrow>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                For a real-time view, open <Strong>Live</Strong> to watch a continuously
                scrolling response-time chart for a single check — like a task-manager
                graph for your endpoint. Outages and recoveries land as markers on the
                timeline.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------ You're set -- */}
      <Section>
        <Reveal>
          <Eyebrow dot>You’re set</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            One quiet monitor, fully on watch.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {RECAP.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="leading-relaxed text-muted-foreground">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Where to go next
          </p>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {NEXT.map((item, i) => {
            const inner = (
              <>
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 flex-none text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            );
            const cls =
              "group flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.04] hover:ring-white/[0.12]";
            return (
              <Reveal key={item.title} delay={i * 0.04}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* --------------------------------------------------- Closing CTA -- */}
      <section className="relative overflow-hidden px-4 py-28 sm:px-6 sm:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Put your first URL on watch.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
              It takes about a minute. No credit card — 10 monitors free.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Open the app
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://docs.exit1.dev/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-4 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Read the full docs
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 text-sm text-muted-foreground">
              Questions? Reach us any time at{" "}
              <a
                href="mailto:connect@exit1.dev"
                className="text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-primary hover:text-primary"
              >
                connect@exit1.dev
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
