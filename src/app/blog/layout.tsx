import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Free Uptime Monitoring Insights',
  description: 'Insights, comparisons, and best practices on website monitoring, uptime checking, and site reliability.',
  openGraph: {
    title: 'Blog - Free Uptime Monitoring Insights',
    description: 'Insights, comparisons, and best practices on website monitoring, uptime checking, and site reliability.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
