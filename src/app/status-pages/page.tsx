import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import { PageSection, SectionContent } from '@/components/PageLayout';
import {
  Globe,
  Calendar,
  LayoutGrid,
  Lock,
  GripVertical,
  Maximize2,
  Volume2,
  Bell,
  Clock,
  BarChart3,
  FileText,
  Shield,
  Code,
  Link2
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Public Status Pages",
  description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, and drag & drop builder.",
  keywords: "public status page, uptime status page, service status page, status page builder, status page hosting, uptime monitoring status page, customer status page, SaaS status page, website status page",
  openGraph: {
    title: "Public Status Pages | exit1.dev",
    description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, and drag & drop builder.",
    type: "website",
    url: "https://exit1.dev/status-pages",
  },
  twitter: {
    title: "Public Status Pages | exit1.dev",
    description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, and drag & drop builder.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/status-pages",
  },
};

const StatusPages = () => {
  const features = [
    {
      title: "Real-Time Status Updates",
      description: "Your status page automatically refreshes every 60 seconds, showing live status for all your monitored services. No manual updates needed.",
      icon: <Globe className="w-6 h-6 text-foreground" />
    },
    {
      title: "30-Day Heartbeat History",
      description: "Every check displays a visual 30-day history showing daily status. Your customers can see at a glance how reliable your services have been.",
      icon: <Calendar className="w-6 h-6 text-foreground" />
    },
    {
      title: "Multiple Layout Options",
      description: "Choose from 2-column grid, 3-column grid, or single column layouts. Pick what fits your needs and number of services best.",
      icon: <LayoutGrid className="w-6 h-6 text-foreground" />
    },
    {
      title: "Public or Private",
      description: "Set your status page as public for customers to access, or keep it private for internal team visibility only.",
      icon: <Lock className="w-6 h-6 text-foreground" />
    },
    {
      title: "Drag & Drop Builder",
      description: "Arrange your monitors exactly how you want them. Drag and drop to reorder, group by service, and create the perfect layout for your audience (Nano and above).",
      icon: <GripVertical className="w-6 h-6 text-foreground" />
    },
    {
      title: "Fullscreen Mode",
      description: "Perfect for NOC displays, office dashboards, or TV monitors. One click expands to a clean, distraction-free view.",
      icon: <Maximize2 className="w-6 h-6 text-foreground" />
    },
    {
      title: "Sound Alerts",
      description: "Enable audio alerts and get an audible notification when any service goes offline. Ideal for keeping a status page open while you work.",
      icon: <Volume2 className="w-6 h-6 text-foreground" />
    },
    {
      title: "Browser Tab Alerts",
      description: "When a service goes down, the page title changes and the favicon pulses with a red indicator. Notice issues even when the tab is in the background.",
      icon: <Bell className="w-6 h-6 text-foreground" />
    },
    {
      title: "Your Own Domain",
      description: "Put a status page on status.yourcompany.com. Add two DNS records and we issue the HTTPS certificate for you. Up to 10 custom domains on Pro.",
      icon: <Link2 className="w-6 h-6 text-foreground" />
    }
  ];

  const domainSteps = [
    {
      title: "Enter your subdomain",
      description: "Open the status page in the editor and type the address you want, like status.acme.com."
    },
    {
      title: "Add two DNS records",
      description: "A TXT record proves you own the domain. A CNAME to domains.exit1.dev routes visitors to your page. Both are shown in the editor with copy buttons."
    },
    {
      title: "HTTPS, done for you",
      description: "Once the records resolve, the certificate is issued and renewed automatically. Using Cloudflare? Keep the record proxied."
    }
  ];

  const comparisonTable = [
    {
      feature: "Real-time updates",
      exit1: true,
      competitors: "Manual refresh"
    },
    {
      feature: "30-day history visualization",
      exit1: true,
      competitors: "Limited history"
    },
    {
      feature: "Multiple layout options",
      exit1: true,
      competitors: "Single layout"
    },
    {
      feature: "Group by folder",
      exit1: true,
      competitors: false
    },
    {
      feature: "Fullscreen mode",
      exit1: true,
      competitors: false
    },
    {
      feature: "Sound alerts",
      exit1: true,
      competitors: false
    },
    {
      feature: "Browser tab alerts",
      exit1: true,
      competitors: false
    },
    {
      feature: "Drag & drop builder",
      exit1: "Nano and above",
      competitors: false
    },
    {
      feature: "Custom domain with HTTPS",
      exit1: "Pro, up to 10",
      competitors: "Extra cost"
    },
    {
      feature: "SSL included",
      exit1: true,
      competitors: "Extra cost"
    },
    {
      feature: "Free tier",
      exit1: "1 status page",
      competitors: "No free tier"
    },
    {
      feature: "Multiple status pages",
      exit1: "5 on Nano, 50 on Pro",
      competitors: "Per-page pricing"
    }
  ];

  const faq = [
    {
      question: "How often does the status page update?",
      answer: "The status page automatically refreshes every 60 seconds, showing the latest status from your monitors. No manual refresh needed: your customers always see current data."
    },
    {
      question: "Can I use my own domain for the status page?",
      answer: "Yes, on Pro. Each status page can have one custom subdomain, like status.yourcompany.com, with up to 10 per account. Add a TXT record to prove ownership and a CNAME to domains.exit1.dev, and we issue the HTTPS certificate automatically. Apex domains (yourcompany.com without a subdomain) are not supported."
    },
    {
      question: "I use Cloudflare for DNS. Does a custom domain still work?",
      answer: "Yes. You can keep the CNAME proxied (orange cloud). If your domain has CAA records, make sure they allow letsencrypt.org and pki.goog so the certificate can be issued."
    },
    {
      question: "Can I show different checks to different audiences?",
      answer: "Yes, you can create multiple status pages with the builder on Nano (5 pages) and Pro (50 pages) with different selections of checks for different audiences. Show customer-facing services while keeping internal infrastructure private."
    },
    {
      question: "What happens if a check goes down?",
      answer: "The status page immediately reflects the current status with a clear visual indicator. Online services show green, degraded services show amber, and offline services show red. If you have alerts configured, you'll also receive notifications via your preferred channels."
    },
    {
      question: "Can I embed the status page on my website?",
      answer: "The status page is designed as a standalone page, but you can link to it from your website, documentation, or app. Share the URL with customers or add it to your support resources."
    },
    {
      question: "What are the status indicators?",
      answer: "We show five status states: Online (green) for normal operation, Degraded (amber) for slow or partial availability, Offline (red) for not responding, Redirect (blue) for URL redirects, and Paused (yellow) for paused monitoring."
    },
    {
      question: "How do I set up a status page?",
      answer: "Create a status page in minutes: give it a name, select which monitors to display, and use the drag & drop builder to customize your layout. Then share the link with your customers."
    }
  ];

  const technicalDetails = {
    architecture: "Status pages are served from our global edge network for fast loading worldwide. Real-time data is pulled from our monitoring infrastructure with intelligent caching.",
    performance: "Status pages load in under 1 second globally. Auto-refresh every 60 seconds with minimal bandwidth usage. Snapshot data cached for 1 minute, uptime history cached for 5 minutes for optimal performance.",
    api: "Full API access to manage status pages programmatically. Create, update, and delete status pages via REST endpoints. Configure visibility, branding, and monitor selection through the API."
  };

  const relatedFeatures = [
    {
      title: "Live Checks",
      description: "Streamed probes paint in your browser the moment they finish. Drag-to-zoom chart and per-stage DNS / Connect / TLS / TTFB phases.",
      href: "/live-checks",
      icon: <Clock className="w-6 h-6 text-foreground" />
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends, response times, and performance metrics with detailed analytics.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-foreground" />
    },
    {
      title: "Comprehensive Logs",
      description: "View detailed monitoring history with advanced search, filtering, and export capabilities.",
      href: "/logs",
      icon: <FileText className="w-6 h-6 text-foreground" />
    },
    {
      title: "Smart Alerting",
      description: "Get notified via webhooks and email when issues occur. Prevent alert fatigue with smart suppression.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-foreground" />
    },
    {
      title: "SSL Monitoring",
      description: "Monitor SSL certificate validity, expiration dates, and security issues automatically.",
      href: "/ssl-monitoring",
      icon: <Shield className="w-6 h-6 text-foreground" />
    },
    {
      title: "API Integration",
      description: "Integrate monitoring and status pages into your workflows with our comprehensive REST API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-foreground" />
    }
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "Public Status Pages",
          description: "Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, and drag & drop builder.",
          url: "https://exit1.dev/status-pages",
          brand: {
            "@type": "Brand",
            name: "exit1.dev"
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          },
          category: "Status Page Hosting",
          features: features.map(f => f.title),
        }}
      />
      
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: faq.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }}
      />
      
      <ProductPage
        title="Keep Your Customers Informed"
        subtitle="Beautiful public status pages"
        description="Create real-time status pages that show your customers exactly what's up and what's down. Build trust through transparency with 30-day history and a drag & drop builder."
        heroExtra={
          <PageSection id="custom-domain" className="py-16 scroll-mt-20">
            <SectionContent size="lg">
              <div className="text-center mb-12">
                <p className="text-sm text-foreground/50 uppercase tracking-wide font-medium mb-3">Pro</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                  Your status page, on your domain
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  Serve any status page from status.yourcompany.com. Your customers stay on your brand,
                  and HTTPS is handled for you.
                </p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {domainSteps.map((step, index) => (
                  <li key={step.title} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6">
                    <span className="text-sm font-mono text-foreground/50">Step {index + 1}</span>
                    <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{step.description}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 font-mono text-sm overflow-x-auto">
                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 min-w-max">
                  <span className="text-foreground/50">TXT</span>
                  <span>_exit1-verify.status.acme.com</span>
                  <span className="text-foreground/50">CNAME</span>
                  <span>status.acme.com &rarr; domains.exit1.dev</span>
                </div>
              </div>
              <p className="mt-6 text-center text-foreground/60">
                Full setup guide in the{' '}
                <a href="https://docs.exit1.dev/status-pages/custom-domain" className="underline underline-offset-4 hover:text-foreground">
                  docs
                </a>
                .
              </p>
            </SectionContent>
          </PageSection>
        }
        features={features}
        ctaText="Create Your Status Page"
        ctaHref="https://app.exit1.dev/"
        seoTitle="Public Status Pages | exit1.dev"
        seoDescription="Create beautiful public status pages to share your service health with customers. Real-time updates, 30-day history, and drag & drop builder."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "Need more status pages?",
          description: "Nano ($9/mo) unlocks the drag & drop builder and 5 pages. Pro gives you 50 pages and up to 10 custom domains, with custom branding across all paid plans."
        }}
      />
    </>
  );
};

export default StatusPages;
