import Image from 'next/image';
import { Eyebrow } from './home/Eyebrow';
import { Reveal } from './home/Reveal';

type Testimonial = {
  quote: string;
  name: string;
  avatar: string;
  company: string;
  companyLogo: string;
  href: string;
  featured?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Exit1 is a fantastic tool that performs exactly as advertised, but the level of support behind it is what makes it world-class. When I reached out via Discord for a custom modification, the developer responded immediately. Not only was the work finished in a matter of hours, but they went above and beyond by adding extra touches I hadn’t even asked for. It’s rare to find this level of dedication and speed.',
    name: 'Nick Frame',
    avatar: '/testimonials/SEOVERSE Nick Frame.jpeg',
    company: 'SEOVERSE',
    companyLogo: '/testimonials/SEROVERSE Logo.png',
    href: 'https://seoverse.co.uk/',
    featured: true,
  },
  {
    quote:
      'The support at exit1.dev is absolutely absurd—I’ve never felt so backed by a tool, and the product itself is fabulous, delivering 10x the performance of our old stack at a mere fraction of the cost.',
    name: 'Nicholas Schibuola',
    avatar: '/testimonials/Kerners Nicholas Schibuola.jpeg',
    company: 'Kerners',
    companyLogo: '/testimonials/Kerners Logo.jpeg',
    href: 'https://kerners.co/',
  },
  {
    quote:
      'We’ve loved using Exit1 to provide distributed & worldwide monitoring to our clients websites and critical business applications, with lightning fast SMS, Webhook and email alerts, reasonable no-nonsense pricing, and friendly support who will always lend a helping hand. There’s not really a better choice.',
    name: 'Kai Randles',
    avatar: '/testimonials/4u Entertainment Kai Randles.jpg',
    company: '4u Entertainment',
    companyLogo: '/testimonials/4u Entertainment Logo.png',
    href: 'https://4umediagroup.co.uk/',
  },
];

function Attribution({
  testimonial,
  size = 'md',
}: {
  testimonial: Testimonial;
  size?: 'md' | 'lg';
}) {
  const { name, avatar, company, companyLogo, href } = testimonial;
  const avatarSize = size === 'lg' ? 52 : 44;
  return (
    <figcaption className="mt-8 flex items-center gap-4">
      <Image
        src={avatar}
        alt={name}
        width={avatarSize}
        height={avatarSize}
        className="rounded-full object-cover"
      />
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground/80"
        >
          <Image
            src={companyLogo}
            alt={company}
            width={18}
            height={18}
            className="rounded-sm"
          />
          {company}
        </a>
      </div>
    </figcaption>
  );
}

export function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section
      aria-label="Customer testimonials"
      className="px-4 sm:px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Eyebrow>Teams who can&rsquo;t afford downtime</Eyebrow>
        </Reveal>

        {/* Featured — a large editorial pull-quote */}
        <Reveal delay={0.05}>
          <figure className="mt-10 sm:mt-12">
            <blockquote className="max-w-4xl text-2xl font-medium leading-snug tracking-tight text-foreground/90 sm:text-3xl">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <Attribution testimonial={featured} size="lg" />
          </figure>
        </Reveal>

        {/* Supporting — two quieter quotes */}
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          {rest.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={0.05 + i * 0.05}>
              <figure>
                <blockquote className="text-lg leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <Attribution testimonial={testimonial} />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
