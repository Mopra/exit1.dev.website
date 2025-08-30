import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: "Sitemap | exit1.dev",
  description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  openGraph: {
    title: "Sitemap | exit1.dev",
    description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  },
  twitter: {
    title: "Sitemap | exit1.dev",
    description: "Complete sitemap of exit1.dev - Find all pages, features, and resources for our website monitoring platform.",
  },
};

interface SitemapLink {
  name: string;
  url: string;
  external?: boolean;
}

const Sitemap = () => {
  const sitemapData: Array<{
    category: string;
    links: SitemapLink[];
  }> = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "Features", url: "/#features" },
        { name: "Pricing", url: "/#pricing" },
        { name: "Blog", url: "/blog" },
        { name: "Getting Started", url: "/getting-started" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Data Privacy", url: "/data-privacy" }
      ]
    },
    {
      category: "Product Features",
      links: [
        { name: "Real-Time Monitoring", url: "/real-time-monitoring" },
        { name: "SSL Certificate Monitoring", url: "/ssl-monitoring" },
        { name: "Global Monitoring", url: "/global-monitoring" },
        { name: "Alerting & Notifications", url: "/alerting" },
        { name: "Analytics & Reports", url: "/analytics" },
        { name: "Logs", url: "/logs" },
        { name: "API & Webhooks", url: "/api-webhooks" }
      ]
    },
    {
      category: "External Links",
      links: [
        { name: "App Dashboard", url: "https://app.exit1.dev", external: true },
        { name: "API Documentation", url: "https://docs.exit1.dev", external: true },
        { name: "Status Page", url: "https://status.exit1.dev", external: true },
        { name: "Support", url: "mailto:support@exit1.dev", external: true }
      ]
    },
    {
      category: "Blog - Website Monitoring",
      links: [
        { name: "All Articles", url: "/blog" },
        { name: "Intro to Website Monitoring", url: "/blog/intro-to-website-monitoring" },
        { name: "Free Website Monitoring for Developers", url: "/blog/free-website-monitoring-for-developers" },
        { name: "Free vs Paid Website Monitoring", url: "/blog/free-vs-paid-website-monitoring" },
        { name: "Uptrends Free Alternative", url: "/blog/uptrends-free-alternative" },
        { name: "Website Monitoring 101", url: "/blog/website-monitoring-101" },
        { name: "Website Monitoring Best Practices 2025", url: "/blog/website-monitoring-best-practices-2025" },
        { name: "Understanding Website Downtime", url: "/blog/understanding-website-downtime" },
        { name: "UptimeRobot Alternatives", url: "/blog/uptimerobot-alternatives" },
        { name: "StatusCake vs Free Monitoring", url: "/blog/statuscake-vs-free-monitoring" },
        { name: "Importance of Real-Time Alerts", url: "/blog/importance-of-real-time-alerts" },
        { name: "Pingdom Free Alternative", url: "/blog/pingdom-free-alternative" },
        { name: "Real-Time vs 5-Minute Monitoring", url: "/blog/real-time-vs-5-minute-monitoring" },
        { name: "SSL Certificate Monitoring Alerts", url: "/blog/ssl-certificate-monitoring-alerts-made-easy-and-why-it-matters" },
        { name: "Free Website Monitoring for Small Business", url: "/blog/free-website-monitoring-for-small-business" },
        { name: "Free SSL Certificate Monitoring", url: "/blog/free-ssl-certificate-monitoring" },
        { name: "Best Website Monitoring Service 2025", url: "/blog/best-website-monitoring-service-2025" },
        { name: "Free Website Monitoring Tools 2025", url: "/blog/free-website-monitoring-tools-2025" },
        { name: "Best Free Uptime Monitoring Tools", url: "/blog/best-free-uptime-monitoring-tools" }
      ]
    },
    {
      category: "Blog - AI & Automation",
      links: [
        { name: "AI Integration for Website Monitoring", url: "/blog/ai-integration-for-website-monitoring" },
        { name: "AI Anomaly Detection Monitoring", url: "/blog/ai-anomaly-detection-monitoring" }
      ]
    }
  ];

  return (
    <main className="pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sitemap
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete overview of all pages and resources available on exit1.dev. Find everything you need about our website monitoring platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sitemapData.map((section, index) => (
            <Card key={index} className="">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-center justify-between">
                      <a
                        href={link.url}
                        className="text-muted-foreground hover:text-foreground hover:underline transition-colors duration-200"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.name}
                      </a>
                      {link.external && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Sitemap;
