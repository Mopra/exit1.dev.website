import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Exit1.dev & The Person Behind It',
  description: 'Meet Morten Pradsgaard, founder of exit1.dev - the free uptime monitor for people who actually ship. Learn about our mission and no-bullshit approach to monitoring.',
  openGraph: {
    title: 'About Exit1.dev & The Person Behind It',
    description: 'Meet Morten Pradsgaard, founder of exit1.dev - the free uptime monitor for people who actually ship.',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
