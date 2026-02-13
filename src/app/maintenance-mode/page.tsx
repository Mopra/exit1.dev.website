import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Wrench,
  Clock,
  Calendar,
  Repeat,
  ShieldCheck,
  BarChart3,
  Bell,
  BellOff,
  Globe,
  FileText,
  Code,
  Eye,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Maintenance Mode — Suppress Alerts During Planned Downtime | exit1.dev",
  description: "Schedule maintenance windows to suppress alerts and protect uptime stats during planned deployments. Immediate, scheduled, and recurring windows. No false alarms, no polluted uptime data.",
  keywords: "maintenance mode, maintenance window, suppress alerts, planned downtime, uptime monitoring, scheduled maintenance, recurring maintenance, alert suppression",
  openGraph: {
    title: "Maintenance Mode — Suppress Alerts During Planned Downtime | exit1.dev",
    description: "Schedule maintenance windows to suppress alerts and protect uptime stats during planned deployments. Immediate, scheduled, and recurring windows. No false alarms, no polluted uptime data.",
    type: "website",
    url: "https://exit1.dev/maintenance-mode",
  },
  twitter: {
    title: "Maintenance Mode — Suppress Alerts During Planned Downtime | exit1.dev",
    description: "Schedule maintenance windows to suppress alerts and protect uptime stats during planned deployments. No false alarms, no polluted uptime data.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/maintenance-mode",
  },
};

const MaintenanceModePage = () => {
  const features = [
    {
      title: "Immediate Maintenance",
      description: "Enter maintenance right now with a single click. Pick a duration — 5 minutes, 15 minutes, 30 minutes, or 1 hour — and get to work without worrying about alerts.",
      icon: <Wrench className="w-6 h-6 text-white" />,
    },
    {
      title: "Scheduled Windows",
      description: "Plan ahead. Set a future maintenance window with a specific date, time, and duration. The check enters and exits maintenance automatically.",
      icon: <Calendar className="w-6 h-6 text-white" />,
    },
    {
      title: "Recurring Schedules",
      description: "Weekly deploys? Nightly backups? Set a recurring window on specific days and it repeats automatically. Handles DST changes correctly.",
      icon: <Repeat className="w-6 h-6 text-white" />,
    },
    {
      title: "Clean Uptime Stats",
      description: "Planned maintenance counts as uptime, not downtime. Your uptime percentage reflects real incidents, not scheduled work you already know about.",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
    },
    {
      title: "Alert Suppression",
      description: "All alerts are suppressed during maintenance — email, webhook, SMS, SSL, and domain expiry. No false alarms. No 3 AM wake-up calls for planned work.",
      icon: <BellOff className="w-6 h-6 text-white" />,
    },
    {
      title: "Checks Keep Running",
      description: "Unlike disabling a check, maintenance mode keeps collecting data. Response times and status codes are recorded so you can verify your deployment worked.",
      icon: <Eye className="w-6 h-6 text-white" />,
    },
  ];

  const comparisonTable = [
    {
      feature: "Immediate maintenance mode",
      exit1: true,
      competitors: "Manual pause/unpause",
    },
    {
      feature: "Scheduled maintenance windows",
      exit1: true,
      competitors: "Enterprise plans only",
    },
    {
      feature: "Recurring maintenance schedules",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Data collection during maintenance",
      exit1: true,
      competitors: "Check paused entirely",
    },
    {
      feature: "Uptime stats protected",
      exit1: true,
      competitors: "Counts as downtime",
    },
    {
      feature: "Verification check on exit",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Bulk maintenance for multiple checks",
      exit1: true,
      competitors: "One at a time",
    },
    {
      feature: "Maintenance reason logging",
      exit1: true,
      competitors: false,
    },
    {
      feature: "BigQuery maintenance tagging",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Available at $3/mo",
      exit1: true,
      competitors: "$29+/mo plans",
    },
  ];

  const faq = [
    {
      question: "What happens to my checks during maintenance?",
      answer: "Checks keep running normally — response times and status codes are still recorded. The difference is that alerts are suppressed, status transitions are frozen, and planned downtime doesn't count against your uptime percentage. You get full data for debugging without the noise.",
    },
    {
      question: "How do I enter maintenance mode?",
      answer: "Open the actions menu (three-dot menu) on any check and click \"Enter Maintenance\". Choose Immediate, Scheduled, or Recurring. Set your duration, optionally add a reason, and confirm. You can also enter maintenance on multiple checks at once using bulk actions.",
    },
    {
      question: "Can I exit maintenance early?",
      answer: "Yes. Open the actions menu on the check and click \"Exit Maintenance\". The check immediately returns to normal operation and a verification check runs right away to establish the real status.",
    },
    {
      question: "Does maintenance mode affect my uptime percentage?",
      answer: "No. Maintenance periods count as uptime in all calculations. Planned maintenance is a good operational practice — it shouldn't penalize your uptime stats.",
    },
    {
      question: "What happens when a maintenance window ends?",
      answer: "An immediate verification check runs to establish the real status. If the service didn't come back up, alerts fire as normal. This ensures you know right away if something went wrong during maintenance.",
    },
    {
      question: "How do recurring windows handle timezone changes?",
      answer: "Recurring windows use your IANA timezone (e.g., \"America/New_York\"). The scheduler converts to local time on each run, so your maintenance windows stay at the right time even across daylight saving changes.",
    },
    {
      question: "Is maintenance mode available on the free tier?",
      answer: "Maintenance mode is a Nano tier feature. Free-tier users can see the menu option but will be prompted to upgrade. It's available starting at $3/month.",
    },
    {
      question: "Can I use maintenance mode via the API?",
      answer: "The maintenanceMode field is included in check API responses as a read-only field. API-triggered maintenance toggling is planned for a future release.",
    },
  ];

  const technicalDetails = {
    architecture:
      "Maintenance mode integrates with the core check scheduler. When active, checks execute normally but alert evaluation and status transitions are bypassed. Status is frozen at the pre-maintenance state. All check results are tagged with a maintenance flag in storage and BigQuery exports.",
    performance:
      "Maintenance state is evaluated in the hot path of every check cycle with zero additional latency. Scheduled and recurring windows are managed by the scheduler with ~2-minute precision per region. Verification checks on exit run immediately with no queue delay.",
    api:
      "The maintenanceMode boolean is included in all check API responses. Maintenance events (start, end, scheduled, cancelled) appear in the logs endpoint. BigQuery exports include a maintenance flag for filtering. Full API control of maintenance windows is on the roadmap.",
  };

  const relatedFeatures = [
    {
      title: "Smart Alerting",
      description: "Configure webhooks, email, and SMS alerts. Maintenance mode suppresses all of them during planned work.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-white" />,
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends and response times. Maintenance periods are clearly separated from real incidents.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
    {
      title: "Comprehensive Logs",
      description: "Maintenance start, end, and cancellation events all appear in your logs with full context.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-white" />,
    },
    {
      title: "Global Monitoring",
      description: "Monitor from multiple regions worldwide. Maintenance mode applies consistently across all check regions.",
      href: "/global-monitoring",
      icon: <Globe className="w-6 h-6 text-white" />,
    },
    {
      title: "Real-Time Monitoring",
      description: "Live status updates for websites and APIs. Maintenance mode keeps data flowing without the alert noise.",
      href: "/real-time-monitoring",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
    {
      title: "API & Webhooks",
      description: "Integrate maintenance status into your workflows. The API exposes maintenance state on every check.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Maintenance Mode",
          description:
            "Schedule maintenance windows to suppress alerts and protect uptime stats during planned deployments. Immediate, scheduled, and recurring windows.",
          url: "https://exit1.dev/maintenance-mode",
          brand: {
            "@type": "Brand",
            name: "exit1.dev",
          },
          offers: {
            "@type": "Offer",
            price: "3",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          category: "Uptime Monitoring",
          features: features.map((f) => f.title),
        }}
      />

      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <ProductPage
        title="Maintenance Mode"
        subtitle="Deploy without the 3 AM wake-up call"
        description="Suppress alerts and protect uptime stats during planned maintenance. Checks keep running, data keeps flowing, but your phone stays silent. Immediate, scheduled, or recurring — you choose."
        features={features}
        ctaText="Start Using Maintenance Mode"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Maintenance Mode — Suppress Alerts During Planned Downtime | exit1.dev"
        seoDescription="Schedule maintenance windows to suppress alerts and protect uptime stats during planned deployments. No false alarms, no polluted uptime data."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Maintenance Mode is a Nano Feature",
          description:
            "Suppress alerts during planned work, schedule recurring windows, and keep your uptime stats clean. Available on the Nano plan starting at $3/month.",
        }}
      />
    </>
  );
};

export default MaintenanceModePage;
