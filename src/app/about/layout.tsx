import { Metadata } from 'next';

export const metadata: Metadata = {
  // `absolute` — the brand is already in the title, so the root layout's
  // "%s | exit1.dev" template would repeat it.
  title: { absolute: 'About Exit1.dev & The Person Behind It' },
  description: 'Meet Morten Pradsgaard, founder of exit1.dev - the free uptime monitor for people who actually ship. Learn about our mission and no-bullshit approach to monitoring.',
  openGraph: {
    title: 'About Exit1.dev & The Person Behind It',
    description: 'Meet Morten Pradsgaard, founder of exit1.dev - the free uptime monitor for people who actually ship.',
    type: 'website',
    url: 'https://exit1.dev/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Exit1.dev & The Person Behind It',
    description: 'Meet Morten Pradsgaard, founder of exit1.dev - the free uptime monitor for people who actually ship.',
  },
  alternates: {
    canonical: 'https://exit1.dev/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
