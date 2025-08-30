import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Getting Started with Exit1 - 5-Minute Website Monitoring Setup',
  description: 'Get started with Exit1 website monitoring in just 5 minutes. Step-by-step guide to set up uptime monitoring, SSL tracking, and real-time alerts. No complexity, just results.',
  keywords: 'website monitoring setup, uptime monitoring guide, SSL monitoring setup, webhook configuration, monitoring alerts',
  openGraph: {
    title: 'Getting Started with Exit1 - 5-Minute Setup',
    description: 'Stop guessing if your website is down. Start monitoring it properly in 5 minutes.',
    type: 'website',
  },
}

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
