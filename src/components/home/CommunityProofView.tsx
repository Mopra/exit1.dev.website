'use client';

import Link from 'next/link';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

type Avatar = { id: string; name: string; avatarUrl: string };

type Props = {
  inviteUrl: string;
  /** Total human members, or null if the count couldn't be resolved. */
  memberCount: number | null;
  /** Avatars to stack; may be empty (count-only / offline fallback). */
  avatars: Avatar[];
};

function DiscordGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

/**
 * Calm social-proof section. A stacked row of real Discord member avatars leads
 * into an honest "Join N builders" headline and a single Discord CTA. Matches
 * the below-fold rhythm (mono eyebrow, Reveal, generous whitespace, no rules).
 */
export function CommunityProofView({ inviteUrl, memberCount, avatars }: Props) {
  const extra =
    memberCount != null ? Math.max(0, memberCount - avatars.length) : 0;

  const headline =
    memberCount != null
      ? `Join ${memberCount} builders in our Discord`
      : 'Join the builders in our Discord';

  return (
    <section
      aria-label="Community"
      className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal className="flex justify-center">
          <Eyebrow dot>Active community</Eyebrow>
        </Reveal>

        {avatars.length > 0 && (
          <Reveal delay={0.05} className="mt-10 flex justify-center sm:mt-12">
            <ul className="flex items-center -space-x-3 sm:-space-x-4">
              {avatars.map((a) => (
                <li
                  key={a.id}
                  className="relative transition-transform duration-300 hover:z-10 hover:-translate-y-1"
                >
                  <img
                    src={a.avatarUrl}
                    alt={a.name}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    title={a.name}
                    className="h-8 w-8 select-none rounded-full bg-muted object-cover ring-2 ring-background sm:h-12 sm:w-12"
                  />
                </li>
              ))}
              {extra > 0 && (
                <li className="relative flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[0.65rem] font-medium text-muted-foreground ring-2 ring-background sm:h-12 sm:w-12 sm:text-sm">
                  +{extra}
                </li>
              )}
            </ul>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <h2 className="mt-10 text-4xl font-medium leading-[1.05] tracking-tight sm:mt-12 sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Real people running real monitors. Get support, ask questions, share
            feedback, and see what we&rsquo;re shipping next — straight from the team.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <Link
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card px-6 py-3 text-base font-medium text-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <DiscordGlyph className="h-5 w-5 text-brand-discord" />
            Join the community
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
