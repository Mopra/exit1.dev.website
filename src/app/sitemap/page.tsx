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
        { name: "Privacy Policy", url: "/privacy" }
      ]
    },
    {
      category: "Product Features",
      links: [
        { name: "Real-Time Monitoring", url: "/real-time-monitoring" },
        { name: "SSL Certificate Monitoring", url: "/ssl-monitoring" },
        { name: "Global Monitoring", url: "/global-monitoring" },
        { name: "Alerting & Notifications", url: "/alerting" },
        { name: "Analytics & Reports", url: "/analytics" }
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
      category: "Blog",
      links: [
        { name: "All Articles", url: "/blog" }
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
