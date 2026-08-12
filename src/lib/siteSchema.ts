/**
 * The canonical site entity graph: Organization, WebSite, and the founder.
 *
 * This used to live on `/about` only, with `@id` values written as bare
 * fragments (`#org`). Relative fragments resolve against the *page* URL, so
 * every reference actually pointed at `https://exit1.dev/about#org` — the
 * brand entity was bound to the About page instead of the site, and the
 * `publisher: { @id: "#org" }` references on the other nodes dangled because
 * no node ever declared that id. Absolute `@id`s fix both problems and let
 * any page reference the same entity by id without redefining it.
 *
 * Emitted in full on `/` (see `src/app/page.tsx`). Other pages should
 * reference `ORG_ID` / `WEBSITE_ID` rather than repeat the definitions.
 */

export const SITE_URL = 'https://exit1.dev';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

/** Profiles Google uses to consolidate the brand into one knowledge entity. */
const SAME_AS = [
  'https://github.com/Mopra/exit1.dev',
  'https://github.com/Mopra',
  'https://x.com/m_prads',
  'https://www.linkedin.com/in/mopradk/',
  'https://discord.gg/uZvWbpwJZS',
];

export const siteGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'exit1.dev',
      alternateName: 'Exit1',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/e_-logo-large.png`,
        width: 500,
        height: 500,
        caption: 'exit1.dev',
      },
      image: { '@id': `${SITE_URL}/#logo` },
      description:
        'Free uptime monitoring for websites, APIs and services — instant alerts, SSL and domain expiry tracking, public status pages, a REST API and MCP access.',
      email: 'connect@exit1.dev',
      foundingDate: '2024',
      founder: { '@id': FOUNDER_ID },
      sameAs: SAME_AS,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'connect@exit1.dev',
        url: `${SITE_URL}/contact`,
        availableLanguage: ['en'],
      },
      parentOrganization: {
        '@type': 'Organization',
        name: 'Pradsgaard Labs EMV',
        url: 'https://pradsgaardlabs.com/',
        identifier: 'DK46156153',
      },
    },
    {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: 'Morten Pradsgaard',
      jobTitle: 'Founder & CTO',
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/Morten-Pradsgaard.jpg`,
      email: 'mailto:connect@exit1.dev',
      worksFor: { '@id': ORG_ID },
      sameAs: [
        'https://github.com/Mopra',
        'https://x.com/m_prads',
        'https://www.linkedin.com/in/mopradk/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'exit1.dev',
      url: SITE_URL,
      inLanguage: 'en',
      publisher: { '@id': ORG_ID },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'exit1.dev',
      url: SITE_URL,
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'Website & API Uptime Monitoring',
      operatingSystem: 'Web',
      description:
        'Monitor websites, APIs, TCP/UDP services, WebSockets and ICMP hosts. SSL certificate and domain expiry tracking, flap-resistant alerting over email, SMS, webhooks, Slack, Discord and Teams, plus public status pages and a REST API.',
      publisher: { '@id': ORG_ID },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        url: `${SITE_URL}/pricing`,
        description: 'Free forever: 5 monitors, 5-minute checks, SSL monitoring and a public status page.',
      },
    },
  ],
} as const;
