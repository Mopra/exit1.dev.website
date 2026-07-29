import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Reveal } from '@/components/home/Reveal';
import { Eyebrow } from '@/components/home/Eyebrow';

export const metadata: Metadata = {
  title: 'Which plan are you? | exit1.dev',
  description:
    'Find yourself first. Indie is for solo makers who need a few things watched closely. Nano is for freelancers running many sites at a normal cadence. Pro is for teams with paying users and someone on call. Read the moment you outgrow each step, and the pain the next one solves.',
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
    cumulative: 'Everything in Free, plus \u2014',
    personaLabel:
      'Solo makers and indie hackers with a few things that really matter',
    who: 'For the solo maker, indie hacker, or freelancer running a small number of things that people actually depend on. You don\u2019t need a hundred monitors \u2014 you need the handful you have watched properly, and you\u2019d rather find out in seconds than in five minutes. The point isn\u2019t volume; it\u2019s that the few things you do run are watched closely.',
    outgrownLabel: 'You have outgrown Free when',
    outgrownSignals: [
      'Five-minute checks are too slow \u2014 a blip can start and finish before your monitor ever looks.',
      'Five monitors no longer covers it: the site, the API, and a job or two.',
      'You want to ask your editor \u201cis anything down?\u201d and get a real answer \u2014 Free has no API and no MCP.',
      'You caught an outage from a customer message instead of an alert.',
    ],
    headline: 'When five minutes is long enough to miss it.',
    story:
      'On Free, a check runs every five minutes \u2014 which means a two-minute outage can begin and end without your monitor ever noticing. Indie drops that to fifteen seconds, the fastest interval exit1 runs, so a short blip surfaces as a real event instead of vanishing between polls. And because Indie ships an API key, the same data is available to Claude, Cursor, or Windsurf over MCP \u2014 you ask what\u2019s happening and get an answer, without opening a dashboard.',
    solvesLabel: 'How Indie fixes it',
    solves: [
      {
        pain: 'Outages that vanish between checks',
        solvedBy:
          '15-second checks \u2014 the fastest interval exit1 runs, down from five minutes on Free.',
      },
      {
        pain: 'Running out of room at five monitors',
        solvedBy:
          '10 monitors \u2014 the site, the API, staging, and the jobs that matter.',
      },
      {
        pain: 'Monitoring stranded behind a login',
        solvedBy:
          '1 API key, which also unlocks MCP \u2014 query your checks from Claude, Cursor, or Windsurf.',
      },
      {
        pain: 'Alerts that only reach an inbox',
        solvedBy:
          '3 webhook integrations alongside email, so a failure can reach whatever you already use.',
      },
    ],
    signatureValue:
      'The fastest checks exit1 runs, on the handful of things you actually care about \u2014 plus API and MCP access, for four dollars a month.',
    statValue: '15',
    statUnit: 'sec',
    statLabel: 'between checks, the fastest exit1 runs',
    statDelta: 'down from 5-minute checks on Free',
  },
  {
    index: '02',
    tier: 'Nano',
    cumulative: 'A different shape to Indie \u2014 volume, not speed',
    personaLabel:
      'Freelancers and agencies-of-one running many sites at a normal cadence',
    who: 'For the freelancer or agency-of-one whose clients now open the status page you set up, and for the solo maker running a lot of properties rather than a few critical ones. Nano is not \u201cIndie plus more\u201d \u2014 it is the other shape. Indie watches a few things very closely; Nano watches many things at a normal cadence, and adds the client-facing polish: your branding, your status pages, domain expiry tracking, planned maintenance.',
    outgrownLabel: 'Choose Nano over Indie when',
    outgrownSignals: [
      'You are counting sites, not seconds \u2014 ten monitors is the constraint, and two-minute checks are perfectly fine.',
      'A client now sees your status page \u2014 and it still carries the exit1.dev badge and a status.exit1.dev/abc123 URL instead of your brand.',
      'You once renewed a domain late, or nearly did, and the registrar\u2019s reminder got lost with everything else in your inbox.',
      'You ship planned work and want to stop the alerts firing during a deploy window.',
    ],
    headline: 'When one site becomes fifty, and clients start looking.',
    story:
      'A client opens the status page you set up and asks why it shows status.exit1.dev/abc123 and another company\u2019s logo. In that one question, the whole setup reads as borrowed, not built. Nano makes the page yours \u2014 your logo, your colours, arranged in the drag-and-drop builder, with the exit1.dev badge gone \u2014 and gives you room for a hundred sites at two-minute checks, with domain expiry tracked alongside uptime and maintenance windows that keep planned work from paging anyone.',
    solvesLabel: 'How Nano fixes it',
    solves: [
      {
        pain: 'A status page that looks borrowed',
        solvedBy:
          'Up to 5 status pages with your own logo and colours, built in a drag-and-drop builder, with the exit1.dev badge removed.',
      },
      {
        pain: 'Counting sites instead of monitoring them',
        solvedBy:
          '100 monitors \u2014 room for the site, the API, staging, and a whole roster of client properties.',
      },
      {
        pain: 'A domain that quietly lapses',
        solvedBy:
          'Domain Intelligence tracks WHOIS/DNS expiry alongside your uptime and warns you before a domain runs out \u2014 the renewal stops depending on memory.',
      },
      {
        pain: 'Deploys that page the whole channel',
        solvedBy:
          'Maintenance mode \u2014 instant, scheduled, or recurring windows that suppress alerts during planned work.',
      },
    ],
    signatureValue:
      'Room for a hundred sites, a status page that\u2019s yours rather than ours, and domain expiry watched alongside uptime. If you need speed instead of volume, Indie is the cheaper answer.',
    statValue: '100',
    statUnit: 'sites',
    statLabel: 'watched at 2-minute intervals',
    statDelta: 'up from 5 on Free \u2014 Indie is faster, Nano is bigger',
  },
  {
    index: '03',
    tier: 'Pro',
    cumulative: 'Everything in Indie and Nano, plus \u2014',
    focal: true,
    personaLabel: 'Teams with paying users, someone on call, and a fleet to cover',
    who: 'For product teams, startups, SaaS companies, agencies, and MSPs \u2014 anywhere the site going down means paying users notice first, and where uptime is part of what you deliver. Monitoring is no longer one person\u2019s browser tab: a few people share responsibility, someone is on call, and a failure at 3am has to reach a human. Pro is the only plan that gives you both shapes at once \u2014 fifteen-second checks and a thousand monitors.',
    outgrownLabel: 'You have outgrown Indie and Nano when',
    outgrownSignals: [
      'An email alert isn\u2019t enough anymore \u2014 you need a text or a Slack ping to reach whoever is on call.',
      'You want speed and volume together: fifteen-second checks across far more than ten monitors.',
      'You\u2019re hand-rolling webhook glue to get alerts into Slack, Discord, or Teams, when those channels could just be native.',
      'A client or auditor has asked you to prove uptime from more than a year ago, and sixty days of logs can\u2019t reach it.',
      'You need checks pinned to a region \u2014 US, EU, or Asia \u2014 rather than wherever they land.',
    ],
    headline: 'When an outage has to wake someone, not just fill an inbox.',
    story:
      'On the smaller plans, a failed check at 3am is an email read at 9am \u2014 and your incident channel hears nothing. On Pro, the same failure is a text on the on-call phone and a ping in your Slack channel as soon as the next fifteen-second check confirms it, so someone is on it before the support queue moves. Afterward you pull the full timeline from three years of retained logs to write the postmortem, and your REST keys and MCP connection mean the next question \u2014 \u201cwhat broke last night?\u201d \u2014 gets answered straight from your editor.',
    solvesLabel: 'How Pro fixes it',
    solves: [
      {
        pain: 'A 3am alert no one sees until morning',
        solvedBy:
          'SMS alerts (25/hr, 50/mo) put it on the on-call phone, plus native Slack, Discord, and Microsoft Teams.',
      },
      {
        pain: 'Having to choose between speed and scale',
        solvedBy:
          '15-second checks across up to 1,000 monitors \u2014 the only plan that gives you both.',
      },
      {
        pain: 'Proof of uptime that expires before the contract',
        solvedBy:
          '3-year log retention, plus CSV export for analysis outside the app.',
      },
      {
        pain: 'One branded page per client, past five',
        solvedBy:
          '50 custom-branded status pages \u2014 one per client, their look, no exit1 badge.',
      },
      {
        pain: 'Running the whole fleet across a team',
        solvedBy:
          '25 API keys to script per-client setup, 50 webhooks, and region choice so checks run from the US, EU, or Asia. Named team members and roles are on the roadmap, not shipped yet.',
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
                  You&rsquo;re kicking the tyres.
                </h2>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  A personal project, a side build, or a first look at exit1. Five
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
