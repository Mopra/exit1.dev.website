import { Reveal } from './Reveal';

/**
 * Philosophy beat. A single full-width statement of the product's point of
 * view — calm by design, which is also the differentiator (flap detection,
 * one alert that matters). One soft glow, vast whitespace, nothing else.
 */
export function SignalStatement() {
  return (
    <section className="relative overflow-hidden px-4 py-32 sm:px-6 sm:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            No noise. Just signal.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Flap detection filters the flicker, so the one alert you get is the one
            that matters — delivered by SMS, email, Slack, Discord, Teams, or webhook.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
