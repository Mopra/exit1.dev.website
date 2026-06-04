import type { CSSProperties } from 'react';
import { Mail, MessageSquare, Webhook, type LucideIcon } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import { NotificationPhone } from './NotificationPhone';

type Channel =
  | { name: string; src: string }
  | { name: string; icon: LucideIcon };

const NATIVE: Channel[] = [
  { name: 'Slack', src: '/slack.svg' },
  { name: 'Discord', src: '/discord.svg' },
  { name: 'Microsoft Teams', src: '/integrations/teams.svg' },
  { name: 'Email', icon: Mail },
  { name: 'SMS', icon: MessageSquare },
  { name: 'Webhooks', icon: Webhook },
];

const VIA_WEBHOOK: { name: string; src: string }[] = [
  { name: 'PagerDuty', src: '/integrations/pagerduty.svg' },
  { name: 'Opsgenie', src: '/integrations/opsgenie.svg' },
  { name: 'Telegram', src: '/integrations/telegram.svg' },
  { name: 'Zapier', src: '/integrations/zapier.svg' },
];

const maskStyle = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
});

/**
 * Alert destinations. A live lock-screen phone shows alerts actually landing
 * (SMS, Slack, Discord), while the channel grid lists the full set. Logos are
 * tinted to the foreground for a calm, uniform look; native channels lead and
 * everything else reaches you through webhooks.
 */
export function Integrations() {
  return (
    <section
      aria-label="Alert integrations"
      className="px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Alerting</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              Alerts land where you already work.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The moment a check fails, the right people hear about it — a text on
              your phone, a ping in your team channel, in the tools you already live
              in.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid items-center gap-12 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Phone — leads on mobile, sits right on desktop */}
          <Reveal className="order-1 lg:order-2">
            <NotificationPhone />
          </Reveal>

          {/* Channel grid */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                {NATIVE.map((ch) => (
                  <li
                    key={ch.name}
                    className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-7 transition-colors hover:bg-white/[0.06]"
                  >
                    {'src' in ch ? (
                      <span
                        role="img"
                        aria-label={ch.name}
                        className="block h-7 w-7 bg-foreground/70 transition-colors duration-300 group-hover:bg-foreground"
                        style={maskStyle(ch.src)}
                      />
                    ) : (
                      <ch.icon
                        className="h-7 w-7 text-foreground/70 transition-colors duration-300 group-hover:text-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm text-muted-foreground">{ch.name}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Also via webhooks
                </span>
                <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {VIA_WEBHOOK.map((ch) => (
                    <li key={ch.name} className="flex items-center gap-2.5">
                      <span
                        role="img"
                        aria-label={ch.name}
                        className="block h-5 w-5 bg-foreground/45 transition-colors duration-300 hover:bg-foreground/80"
                        style={maskStyle(ch.src)}
                      />
                      <span className="text-sm text-muted-foreground">{ch.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
