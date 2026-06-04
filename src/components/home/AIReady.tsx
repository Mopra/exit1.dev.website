import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import { AIChat } from './AIChat';

/**
 * The second differentiator: exit1 is AI-ready over MCP. A short, concrete
 * prompt exchange shows the value better than any description — connect in
 * two minutes, then ask your monitoring questions in plain language.
 */
export function AIReady() {
  return (
    <section className="px-4 sm:px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <Eyebrow dot>AI-ready · MCP</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                Ask your monitoring anything.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Connect exit1 to Claude, Cursor, VS Code, or any MCP client in about
                two minutes. Then just ask — no dashboards, no clicking. Your data
                answers back.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/mcp"
                className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Explore MCP
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <AIChat />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
