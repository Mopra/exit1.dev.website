import type { Metadata } from 'next';

// `page.tsx` is a client component (it assembles the email address at runtime
// to dodge scrapers), so it cannot export `metadata`. Without this the page
// inherited the root layout's title and description verbatim.
export const metadata: Metadata = {
  // `absolute` — brand already in the title, no template suffix wanted.
  title: { absolute: 'Contact exit1.dev — Support, Feedback & Questions' },
  description:
    'Get in touch with exit1.dev. Reach the founder directly by email, join the Discord community for fast help, or open an issue on GitHub. Real answers from the person who builds the product.',
  openGraph: {
    title: 'Contact exit1.dev — Support, Feedback & Questions',
    description:
      'Reach the founder directly by email, join the Discord community, or open an issue on GitHub.',
    type: 'website',
    url: 'https://exit1.dev/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact exit1.dev — Support, Feedback & Questions',
    description:
      'Reach the founder directly by email, join the Discord community, or open an issue on GitHub.',
  },
  alternates: {
    canonical: 'https://exit1.dev/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
