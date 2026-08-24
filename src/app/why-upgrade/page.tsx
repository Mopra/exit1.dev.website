import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Reveal } from '@/components/home/Reveal';
import { Eyebrow } from '@/components/home/Eyebrow';

export const metadata: Metadata = {
  title: 'Which plan are you?',
  description:
    'Find yourself first. Free already runs 50 monitors. Indie is for solo makers who need minute-resolution and a branded status page. Nano is for small teams running production. Pro is for teams with paying users and someone on call. Read the moment you outgrow each step, and the pain the next one solves.',
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
    tier: 'Indie',
    cumulative: 'Everything in Free, plus —',
    personaLabel:
      'Solo makers and indie hackers whose work is now something other people see',
    who: 'For the solo maker, indie hacker, or freelancer running things that people actually depend on. Free already gives you fifty monitors and an API key, so this is not about running out of room — it is about resolution and presentation. You want to know in a minute rather than five, and when a client or a user lands on your status page, you want it to carry your name rather than ours.',
    outgrownLabel: 'You have outgrown Free when',
    outgrownSignals: [
      'Five-minute checks are too slow — a short blip can start and finish before your monitor ever looks.',
      'Someone other than you is reading your status page, and it still shows exit1 branding.',
      'Sixty days of history is starting to fall short of the question you are being asked.',
      'You caught an outage from a customer message instead of an alert.',
    ],
    headline: 'When five minutes is long enough to miss it.',
    story:
      'On Free, a check runs every five minutes — which means a two-minute outage can begin and end without your monitor ever noticing. Indie drops that to one minute, so a short blip surfaces as a real event instead of vanishing between polls. It also hands you the status page builder: your logo, your colours, your layout, with the exit1.dev badge gone. The page a client opens stops looking borrowed.',
    solvesLabel: 'How Indie fixes it',
    solves: [
      {
        pain: 'Outages that vanish between checks',
        solvedBy:
          '1-minute checks — five times the resolution of Free, enough to catch the short ones.',
      },
      {
        pain: 'A status page that looks borrowed',
        solvedBy:
          'The full status page builder on your page — your logo, colours and layout, with the exit1.dev badge removed.',
      },
      {
        pain: 'Fifty monitors starting to feel like a ceiling',
        solvedBy:
          '100 monitors, and DNS record monitoring on top of the protocols Free already covers.',
      },
      {
        pain: 'History that runs out mid-question',
        solvedBy:
          '90 days of retention, 3 API keys instead of 1, and 3 webhook integrations alongside email.',
      },
    ],
    signatureValue:
      'Minute-resolution checks and a status page with your name on it, for four dollars a month.',
    statValue: '1',
    statUnit: 'min',
    statLabel: 'between checks',
    statDelta: 'five times the resolution of Free',
  },
  {
    index: '02',
    tier: 'Nano',
    cumulative: 'Everything in Indie, plus —',
    personaLabel:
      'Small teams running production, and freelancers with a real roster of clients',
    who: 'For the small team running something in production, and the freelancer whose client list has become a fleet. Nano is where monitoring stops being a personal habit and starts being infrastructure: half-minute resolution, a page per client, domains watched alongside uptime, and a full year of history to answer questions from last quarter.',
    outgrownLabel: 'You have outgrown Indie when',
    outgrownSignals: [
      'A minute is still long enough to miss the failures you care about.',
      'One status page is not enough — different clients or services need their own.',
      'You once renewed a domain late, or nearly did, and the registrar’s reminder got lost with everything else in your inbox.',
      'You ship planned work and want to stop the alerts firing during a deploy window.',
      'Your users are concentrated in one region and you want checks to run from there, not wherever they land.',
    ],
    headline: 'When monitoring becomes infrastructure, not a habit.',
    story:
      'At some point the questions change. Not “is it up?” but “which client is affected, when does that domain expire, and can you show me last quarter?” Nano answers all three: 250 monitors at thirty-second checks, five branded status pages so each client gets their own, domain expiry tracked next to uptime, maintenance windows that keep deploys from paging anyone, and a full year of retained history. It also lets you pin checks to the US, EU, or Asia rather than accepting the default shard.',
    solvesLabel: 'How Nano fixes it',
    solves: [
      {
        pain: 'A minute is still too coarse',
        solvedBy:
          '30-second checks across up to 250 monitors.',
      },
      {
        pain: 'One page for many clients',
        solvedBy:
          'Up to 5 branded status pages — one per client, each with their own look.',
      },
      {
        pain: 'A domain that quietly lapses',
        solvedBy:
          'Domain Intelligence tracks WHOIS/DNS expiry alongside your uptime and warns you before a domain runs out — the renewal stops depending on memory.',
      },
      {
        pain: 'Deploys that page the whole channel',
        solvedBy:
          'Maintenance mode — instant, scheduled, or recurring windows that suppress alerts during planned work.',
      },
      {
        pain: 'Checks running from the wrong side of the world',
        solvedBy:
          'Region choice — pin checks to the US, EU, or Asia. Plus 10 API keys, 10 webhooks, and a full year of retention.',
      },
    ],
    signatureValue:
      'Half-minute resolution across 250 monitors, a branded page per client, domains watched alongside uptime, and a year of history behind it all.',
    statValue: '30',
    statUnit: 'sec',
    statLabel: 'between checks, across up to 250 monitors',
    statDelta: 'twice the resolution of Indie, with region choice',
  },
  {
    index: '03',
    tier: 'Pro',
    cumulative: 'Everything in Nano, plus —',
    focal: true,
    personaLabel: 'Teams with paying users, someone on call, and a fleet to cover',
    who: 'For product teams, startups, SaaS companies, agencies, and MSPs — anywhere the site going down means paying users notice first, and where uptime is part of what you deliver. Monitoring is no longer one person’s browser tab: a few people share responsibility, someone is on call, and a failure at 3am has to reach a human.',
    outgrownLabel: 'You have outgrown Nano when',
    outgrownSignals: [
      'An email alert isn’t enough anymore — you need a text or a Slack ping to reach whoever is on call.',
      'Thirty seconds is still slower than your error budget tolerates.',
      'You’re hand-rolling webhook glue to get alerts into Slack, Discord, or Teams, when those channels could just be native.',
      'A client or auditor has asked you to prove uptime from more than a year ago.',
      'Your fleet has outgrown 250 monitors, or five status pages.',
    ],
    headline: 'When an outage has to wake someone, not just fill an inbox.',
    story:
      'On the smaller plans, a failed check at 3am is an email read at 9am — and your incident channel hears nothing. On Pro, the same failure is a text on the on-call phone and a ping in your Slack channel as soon as the next fifteen-second check confirms it, so someone is on it before the support queue moves. Afterward you pull the full timeline from three years of retained logs to write the postmortem, and your REST keys and MCP connection mean the next question — “what broke last night?” — gets answered straight from your editor.',
    solvesLabel: 'How Pro fixes it',
    solves: [
      {
        pain: 'A 3am alert no one sees until morning',
        solvedBy:
          'SMS alerts (25/hr, 50/mo) put it on the on-call phone, plus native Slack, Discord, and Microsoft Teams.',
      },
      {
        pain: 'Thirty seconds is still too slow',
        solvedBy:
          '15-second checks — the fastest interval exit1 runs — across up to 1,000 monitors.',
      },
      {
        pain: 'Proof of uptime that expires before the contract',
        solvedBy:
          '3-year log retention, plus CSV export for analysis outside the app.',
      },
      {
        pain: 'One branded page per client, past five',
        solvedBy:
          '50 custom-branded status pages — one per client, their look, no exit1 badge.',
      },
      {
        pain: 'Running the whole fleet across a team',
        solvedBy:
          '100 API keys to script per-client setup, 100 webhooks, per-log comments, and extra email recipients per check and per folder. Named team members and roles are on the roadmap, not shipped yet.',
      },
    ],
    signatureValue:
      'Fifteen-second checks across a thousand monitors, alerts that reach the person on call by text and in your team channel, and three years of retention so your proof of uptime outlives the client contract.',
    statValue: '15',
    statUnit: 'sec',
    statLabel: 'between checks, across up to 1,000 monitors',
    statDelta: 'the fastest interval exit1 runs, at the highest limits',
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
                  You&rsquo;re already covered.
                </h2>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Fifty monitors, five-minute checks, SSL tracking, a status page,
                  the real-time Live view, and an API key with MCP access, free
                  forever, no card, no clock. That is a real setup, not a countdown.
                  You&rsquo;ll know you&rsquo;ve crossed the starting line when you
                  need to see faster, or when someone else starts reading the page
                  you built. That&rsquo;s where the three steps below begin.
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
                          {`This is me · start ${t.tier} free for 7 days`}
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
              Every plan builds on the one below it. Paid plans open with 7 days
              free. Cancel anytime, change tiers whenever the moment comes.
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
