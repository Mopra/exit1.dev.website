import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Reveal } from '@/components/home/Reveal';
import { Eyebrow } from '@/components/home/Eyebrow';

export const metadata: Metadata = {
  title: 'Which plan are you? | exit1.dev',
  description:
    'Find yourself first. Nano is for solo makers and agencies-of-one whose work people now pay for. Pro is for teams with paying users and someone on call. Agency is for fleets where uptime is what you bill for. Read the moment you outgrow each step, and the pain the next one solves.',
  openGraph: {
    title: 'Which plan are you? | exit1.dev',
    description:
      'A calm, self-diagnostic guide: the persona each plan is for, the moment you outgrow the step below, and the exact pain the next tier solves.',
  },
};

/** One pain, paired with the capability that answers it. The pain leads;
 *  the fix is the answer beneath it — never a bare spec. */
type Solve = { pain: string; solvedBy: string };

type Tier = {
  index: string;
  tier: string;
  /** Cumulative note shown next to the tier name. */
  cumulative: string;
  /** Who recognises themselves here — the lead, most scannable line. */
  personaLabel: string;
  /** The persona paragraph, beneath the label. */
  who: string;
  /** Self-diagnostic: the signals you've outgrown the step below. PRIMARY. */
  outgrownLabel: string;
  outgrownSignals: string[];
  /** Calm pain/promise headline that opens the relief turn. */
  headline: string;
  /** The narrative beat: inadequacy, then resolution. */
  story: string;
  solvesLabel: string;
  solves: Solve[];
  /** One-line distillation that closes the tier. */
  signatureValue: string;
  /** Signature check interval, split for the big-number stat. */
  statValue: string;
  statUnit: string;
  statLabel: string;
  statDelta: string;
  /** Gives Pro a quiet focal marker — where most teams settle. */
  focal?: boolean;
};

const TIERS: Tier[] = [
  {
    index: '01',
    tier: 'Nano',
    cumulative: 'Everything in Free, plus —',
    personaLabel:
      'Freelancers, agencies-of-one, and solo makers with a site people pay for',
    who: 'For the freelancer or agency-of-one whose client now opens the status page you set up — and for the solo maker whose own customers depend on the thing you built. The site stopped being a side project the moment someone other than you started counting on it. The point isn’t more dashboards; it’s that your monitoring stops looking like a hobby in front of the people paying you.',
    outgrownLabel: 'You have outgrown Free when',
    outgrownSignals: [
      'A client now sees your status page — and it still carries the exit1.dev badge and a status.exit1.dev/abc123 URL instead of your brand.',
      'The last time you went down, a client noticed before your monitor did — five-minute checks are too slow for something people pay for.',
      'Ten monitors no longer covers a real setup: the site, the API, a staging box, and a couple of client properties.',
      'You once renewed a domain late, or nearly did, and the registrar’s reminder got lost with everything else in your inbox.',
    ],
    headline: 'When someone else starts depending on your site.',
    story:
      'A client opens the status page you set up and asks why it shows status.exit1.dev/abc123 and another company’s logo. In that one question, the whole setup reads as borrowed, not built. With Nano the page is yours — your logo, your colours, arranged in the drag-and-drop builder, with the exit1.dev badge gone — and checks run every two minutes from the US and EU, so a regional outage surfaces on your monitor in about two minutes instead of waiting for a client to notice first.',
    solvesLabel: 'How Nano fixes it',
    solves: [
      {
        pain: 'A status page that looks borrowed',
        solvedBy:
          'Up to 5 status pages with your own logo and colours, built in a drag-and-drop builder, with the exit1.dev badge removed.',
      },
      {
        pain: 'Hearing about downtime from a client',
        solvedBy:
          '2-minute checks from the US and EU (down from 5), so a regional outage surfaces in about two minutes — you tell the client, not the other way round.',
      },
      {
        pain: 'Outgrowing ten monitors',
        solvedBy:
          '50 monitors — room for the site, the API, a staging box, and a few client properties.',
      },
      {
        pain: 'A domain that quietly lapses',
        solvedBy:
          'Domain Intelligence tracks WHOIS/DNS expiry alongside your uptime and warns you before a domain runs out — the renewal stops depending on memory.',
      },
    ],
    signatureValue:
      'A status page that’s yours, not ours — branded, badge-free, and backed by 2-minute checks from the US and EU. Plus headroom for 50 monitors when one site becomes several.',
    statValue: '2',
    statUnit: 'min',
    statLabel: 'between checks, from the US and EU',
    statDelta: 'down from 5-minute checks on Free',
  },
  {
    index: '02',
    tier: 'Pro',
    cumulative: 'Everything in Nano, plus —',
    focal: true,
    personaLabel: 'Software teams with paying users and someone on call',
    who: 'For product teams, startups, and SaaS companies where the site going down means paying users notice first. Monitoring is no longer one person’s browser tab — a few people share responsibility, someone is on call, and a failure at 3am has to reach a human, not sit in an inbox until morning.',
    outgrownLabel: 'You have outgrown Nano when',
    outgrownSignals: [
      'An email alert isn’t enough anymore — you need a text or a Slack ping to reach whoever is on call, and Nano sends only email and webhooks.',
      'You’re hand-rolling webhook glue to get alerts into Slack, Discord, or Teams, when those channels could just be native.',
      'Someone asks what broke last night, and the only answer is locked in a dashboard nobody is logged into — Nano has no API and no MCP.',
      'Two-minute checks feel slow when paying users notice a gap before you do.',
      'Sixty days of logs runs out right when you need history for a trend or a postmortem.',
    ],
    headline: 'When an outage has to wake someone, not just fill an inbox.',
    story:
      'On Nano, a failed check at 3am is an email read at 9am — and your incident channel hears nothing. On Pro, the same failure is a text on the on-call phone and a ping in your Slack channel as soon as the next 30-second check confirms it, so someone is on it before the support queue moves. Afterward you pull the full timeline from a year of retained logs to write the postmortem, and your REST keys and MCP connection mean the next question — “what broke last night?” — gets answered straight from your editor, not from a dashboard nobody’s logged into.',
    solvesLabel: 'How Pro fixes it',
    solves: [
      {
        pain: 'A 3am alert no one sees until morning',
        solvedBy:
          'SMS alerts (25/hr, 50/mo) put it on the on-call phone, plus native Slack, Discord, and Microsoft Teams.',
      },
      {
        pain: 'Detection that lags behind your users',
        solvedBy:
          '30-second checks catch and confirm a failure in seconds, not the two minutes Nano takes.',
      },
      {
        pain: 'Monitoring stranded in a dashboard',
        solvedBy:
          'A REST API with 10 keys, plus MCP to query monitors from Claude, Cursor, and Windsurf.',
      },
      {
        pain: 'History that runs out before the postmortem',
        solvedBy:
          '365-day log retention, plus CSV export for analysis outside the app.',
      },
      {
        pain: 'Outgrowing fifty monitors',
        solvedBy: '500 monitors, and 25 custom-branded status pages.',
      },
    ],
    signatureValue:
      'When a check fails, it reaches the person on call — by text and in your team channel — instead of sitting in an inbox until morning. And a year of logs and a live API mean the postmortem answers itself.',
    statValue: '30',
    statUnit: 'sec',
    statLabel: 'between checks, confirmed in seconds',
    statDelta: 'down from 2-minute checks on Nano',
  },
  {
    index: '03',
    tier: 'Agency',
    cumulative: 'Everything in Pro, plus —',
    personaLabel: 'Agencies, MSPs & large fleets',
    who: 'For agencies, MSPs, and consultancies where uptime is part of what you deliver and bill for. And for in-house teams whose fleet has simply grown past a few hundred sites. At this scale the monitoring itself has become something you have to stand behind.',
    outgrownLabel: 'You have outgrown Pro when',
    outgrownSignals: [
      'You are bumping against 500 monitors — new client sites, APIs, and SSL certs are competing for slots, and you have started deciding what not to watch.',
      'A client or auditor has asked you to prove uptime from more than a year ago, and Pro’s 365-day retention can’t reach it.',
      'You are running 25 status pages and still need more — one per client, with their branding, not yours.',
      'A client SLA or a postmortem has made you wish the gap between checks were tighter than 30 seconds — when you are accountable for the number, the measurement window is something you think about.',
    ],
    headline: 'Room for the whole fleet, three years deep.',
    story:
      'You sign your fourteenth client, go to add their sites, and find you are rationing slots against the 500 cap. A month later a renewal meeting turns into “show us last year’s uptime,” and your logs stop at 365 days. Agency clears both: 1,000 monitors so you stop choosing what to leave unwatched, and three years of history so the number is there whenever a client asks.',
    solvesLabel: 'How Agency fixes it',
    solves: [
      {
        pain: 'Rationing monitors against the 500 cap',
        solvedBy:
          '1,000 monitors — double Pro’s ceiling, real headroom to keep onboarding clients and cover every site, API, and cert without choosing what to leave unwatched.',
      },
      {
        pain: 'Proof of uptime that expires before the contract',
        solvedBy:
          '3-year log retention (up from 365 days) — history that outlives a typical client contract and any audit.',
      },
      {
        pain: 'One branded page per client, past twenty-five',
        solvedBy:
          '50 custom-branded status pages — one per client, their look, no exit1 badge.',
      },
      {
        pain: 'Accountable for the number, yet capped at 30s',
        solvedBy:
          '15-second checks (down from 30s) — the fastest interval exit1 runs.',
      },
      {
        pain: 'Running the whole fleet across a team',
        solvedBy:
          '25 API keys to script per-client setup, plus 50 webhooks, SMS doubled (50/hr, 100/mo), and 50,000 emails/mo. Named team members and roles are on the roadmap, not shipped yet.',
      },
    ],
    signatureValue:
      '1,000 monitors so you stop rationing what you watch, and three years of retention so your proof of uptime outlives the client contract — at the fastest 15-second checks exit1 offers.',
    statValue: '15',
    statUnit: 'sec',
    statLabel: 'between checks, the fastest exit1 runs',
    statDelta: 'down from 30-second checks on Pro',
  },
];

export default function WhyUpgradePage() {
  return (
    <>
      {/* ── Hero — the self-diagnostic framing, Free as the starting line ── */}
      <section className="px-4 pt-32 pb-16 sm:px-6 sm:pt-44 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <Reveal y={0}>
            <Link
              href="/pricing"
              className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to pricing
            </Link>
          </Reveal>

          <div className="mt-10 max-w-3xl sm:mt-12">
            <Reveal>
              <Eyebrow dot>Which one are you?</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Don&rsquo;t pick a plan.
                <br />
                Find yourself in one.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Each plan is written around a person, not a feature list. Read
                the signals that you&rsquo;ve{' '}
                <span className="font-medium text-primary">
                  outgrown the step below
                </span>{' '}
                — when one sounds like you, that&rsquo;s your plan. The upgrades
                show up only as answers to a pain you already feel.
              </p>
            </Reveal>
          </div>

          {/* Free = the starting line. A light persona, not a chapter. */}
          <Reveal delay={0.15}>
            <div className="mt-16 grid gap-y-6 sm:mt-20 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Start here · Free · $0
                </span>
                <h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
                  You&rsquo;re kicking the tyres.
                </h2>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  A personal project, a side build, or a first look at exit1. Ten
                  monitors and five-minute checks are free forever — no card, no
                  clock. You&rsquo;ll know you&rsquo;ve crossed the starting line
                  the moment someone else starts depending on what you watch.
                  That&rsquo;s where the three steps below begin.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The three personas — recognition → relief, persona-forward ──── */}
      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div>
            {TIERS.map((t) => (
              <article
                key={t.tier}
                className="py-20 sm:py-28 lg:py-32"
                aria-labelledby={`tier-${t.tier}`}
              >
                {/* — Identity row: index, tier, cumulative note — */}
                <Reveal>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {t.index}
                      </span>
                      <h2
                        id={`tier-${t.tier}`}
                        className="text-3xl font-medium tracking-tight sm:text-4xl"
                      >
                        {t.tier}
                      </h2>
                      {t.focal && (
                        <Eyebrow dot className="text-primary">
                          Where most teams settle
                        </Eyebrow>
                      )}
                    </div>
                    <span className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground">
                      {t.cumulative}
                    </span>
                  </div>
                </Reveal>

                {/* — PRIMARY scannable block: who you are + the outgrown signals — */}
                <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-10">
                  {/* Left: who this is for, stated plainly first. */}
                  <div className="md:col-span-5">
                    <Reveal>
                      <Eyebrow>This is you if</Eyebrow>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <p className="mt-6 text-xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-2xl">
                        {t.personaLabel}
                      </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                        {t.who}
                      </p>
                    </Reveal>
                  </div>

                  {/* Right: the moment you outgrew the step below — the most
                      scannable, self-selecting element on the page. */}
                  <div className="md:col-span-6 md:col-start-7">
                    <Reveal>
                      <Eyebrow>{t.outgrownLabel}</Eyebrow>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground/60">
                        Any one of these sounds familiar? That&rsquo;s the signal.
                      </p>
                    </Reveal>
                    <Reveal delay={0.08}>
                      <ul className="mt-6 space-y-5">
                        {t.outgrownSignals.map((signal, si) => (
                          <li
                            key={signal}
                            className="flex items-baseline gap-4"
                          >
                            <span
                              aria-hidden="true"
                              className="shrink-0 font-mono text-xs text-primary/70"
                            >
                              {String(si + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[15px] leading-relaxed text-foreground/90">
                              {signal}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </div>

                {/* — Recognition → relief: the headline, big stat, story turn — */}
                <div className="mt-20 grid gap-10 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-5">
                    <Reveal>
                      <h3 className="text-2xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-3xl">
                        {t.headline}
                      </h3>
                    </Reveal>

                    {/* Big-number stat moment — the tier's signature interval. */}
                    <Reveal delay={0.05}>
                      <div className="mt-10">
                        <span className="flex items-baseline gap-1.5 leading-none">
                          <span className="text-7xl font-medium tracking-tight text-foreground sm:text-8xl">
                            {t.statValue}
                          </span>
                          <span className="text-3xl font-medium tracking-tight text-primary sm:text-4xl">
                            {t.statUnit}
                          </span>
                        </span>
                        <p className="mt-4 text-sm text-muted-foreground">
                          {t.statLabel}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                          {t.statDelta}
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  <div className="md:col-span-6 md:col-start-7">
                    <Reveal delay={0.05}>
                      <p className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
                        {t.story}
                      </p>
                    </Reveal>
                  </div>
                </div>

                {/* — Deltas demoted to answers: each pain paired with its fix — */}
                <div className="mt-20 grid gap-10 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-5">
                    <Reveal>
                      <Eyebrow>{t.solvesLabel}</Eyebrow>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <p className="mt-6 max-w-xs text-base leading-relaxed text-muted-foreground">
                        Each upgrade below is the answer to a pain above — never a
                        spec for its own sake.
                      </p>
                    </Reveal>
                  </div>

                  <dl className="md:col-span-6 md:col-start-7 space-y-8">
                    {t.solves.map((s) => (
                      <Reveal key={s.pain}>
                        <div>
                          {/* Pain leads — foreground. */}
                          <dt className="text-[15px] leading-relaxed text-muted-foreground/70">
                            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground/50">
                              The pain ·{' '}
                            </span>
                            {s.pain}
                          </dt>
                          {/* Fix is the answer beneath. */}
                          <dd className="mt-3 flex items-start gap-2.5">
                            <Check
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            />
                            <span className="text-[15px] leading-relaxed text-foreground">
                              {s.solvedBy}
                            </span>
                          </dd>
                        </div>
                      </Reveal>
                    ))}
                  </dl>
                </div>

                {/* — Signature value + the self-selecting per-tier CTA — */}
                <Reveal delay={0.05}>
                  <div className="mt-16 grid md:grid-cols-12 md:gap-10">
                    <div className="md:col-span-6 md:col-start-7">
                      <Eyebrow>In one line</Eyebrow>
                      <p className="mt-5 text-lg leading-relaxed text-foreground sm:text-xl">
                        {t.signatureValue}
                      </p>
                      <div className="mt-6">
                        <a
                          href="https://app.exit1.dev/billing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary outline-none transition-colors duration-200 hover:text-primary/80 focus-visible:underline"
                        >
                          {`This is me — start with ${t.tier}`}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-32 sm:px-6 sm:py-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <Eyebrow dot className="justify-center">
              Found yourself?
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Start where you are.
              <br />
              Move up when it stops fitting.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
              Every plan builds on the one below it. Cancel anytime, change tiers
              whenever the moment comes.
            </p>
          </Reveal>
          <Reveal
            delay={0.15}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="https://app.exit1.dev/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_14px_40px_-12px] shadow-primary/50 outline-none transition-all duration-200 hover:scale-[1.03] hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/pricing"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/[0.05] px-7 py-3.5 text-base font-medium text-foreground outline-none transition-colors duration-200 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Compare all plans
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
