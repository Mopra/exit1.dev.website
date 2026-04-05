import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, Globe, Radio, Shield, Bell, BarChart3, FileText, Code, Bot, Webhook, Lock, Search, BadgeCheck } from "lucide-react";
import { PageContainer, PageSection, PageShell, SectionContent } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Features - Uptime Monitoring Platform | exit1.dev",
  description: "Explore all exit1.dev features: uptime monitoring, real-time alerts, global coverage, SSL tracking, domain intelligence, status pages, analytics, API & webhooks, and MCP integration.",
  keywords: "uptime monitoring features, website monitoring features, SSL monitoring, domain monitoring, status pages, monitoring API, monitoring alerts",
  openGraph: {
    title: "Features - Uptime Monitoring Platform | exit1.dev",
    description: "Explore all exit1.dev features: uptime monitoring, real-time alerts, global coverage, SSL tracking, domain intelligence, status pages, analytics, API & webhooks, and MCP integration.",
    type: "website",
    url: "https://exit1.dev/features",
  },
  alternates: {
    canonical: "https://exit1.dev/features",
  },
};

const sections = [
  {
    title: "Monitoring",
    features: [
      {
        name: "Uptime Monitoring",
        href: "/free-uptime-monitor",
        description: "HTTP, HTTPS, and endpoint checks with support for all methods, custom headers, and body validation.",
        icon: <Activity className="w-6 h-6 text-white" />,
      },
      {
        name: "Real-Time Monitoring",
        href: "/real-time-monitoring",
        description: "Live status updates for websites and APIs with instant change detection.",
        icon: <Radio className="w-6 h-6 text-white" />,
      },
      {
        name: "Global Monitoring",
        href: "/global-monitoring",
        description: "Worldwide coverage from US, EU, and Asia regions with geo-performance insights.",
        icon: <Globe className="w-6 h-6 text-white" />,
      },
      {
        name: "Domain Intelligence",
        href: "/domain-intelligence",
        description: "Automatic domain and SSL expiration alerts so nothing lapses unnoticed.",
        icon: <Search className="w-6 h-6 text-white" />,
      },
      {
        name: "Smart Alerting",
        href: "/alerting",
        description: "Configurable notifications via email, SMS, Slack, Discord, Teams, and webhooks.",
        icon: <Bell className="w-6 h-6 text-white" />,
      },
    ],
  },
  {
    title: "Protocols",
    features: [
      {
        name: "SSL Monitoring",
        href: "/ssl-monitoring",
        description: "Certificate expiration tracking, chain validation, and protocol analysis.",
        icon: <Shield className="w-6 h-6 text-white" />,
      },
      {
        name: "ICMP Monitoring",
        href: "/icmp-monitoring",
        description: "Ping-based host availability and latency measurement.",
        icon: <Activity className="w-6 h-6 text-white" />,
      },
      {
        name: "WebSocket Monitoring",
        href: "/websocket-monitoring",
        description: "WS/WSS handshake and connection checks for real-time services.",
        icon: <Code className="w-6 h-6 text-white" />,
      },
    ],
  },
  {
    title: "Platform",
    features: [
      {
        name: "Status Pages",
        href: "/status-pages",
        description: "Public status pages to share service health with your customers.",
        icon: <Globe className="w-6 h-6 text-white" />,
      },
      {
        name: "Analytics & Reports",
        href: "/analytics",
        description: "Statistics dashboard with response time trends and availability insights.",
        icon: <BarChart3 className="w-6 h-6 text-white" />,
      },
      {
        name: "Logs",
        href: "/logs",
        description: "Unlimited log retention with full-text search and filtering.",
        icon: <FileText className="w-6 h-6 text-white" />,
      },
      {
        name: "API & Webhooks",
        href: "/api-webhooks",
        description: "Full REST API and webhook integrations for automation.",
        icon: <Webhook className="w-6 h-6 text-white" />,
      },
      {
        name: "MCP Integration",
        href: "/mcp",
        description: "Query your monitors from AI assistants via the Model Context Protocol.",
        icon: <Bot className="w-6 h-6 text-white" />,
      },
      {
        name: "Status Badges",
        href: "/badges",
        description: "Embeddable SVG badges showing real-time status, uptime, and response time.",
        icon: <BadgeCheck className="w-6 h-6 text-white" />,
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <PageShell>
      <PageContainer>
        <PageSection className="pt-36 pb-16">
          <SectionContent className="p-8 sm:p-12 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              Everything you need to stay online
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Monitoring, alerting, analytics, and integrations — all in one platform.
            </p>
          </SectionContent>
        </PageSection>

        {sections.map((section) => (
          <PageSection key={section.title} className="py-16">
            <SectionContent className="px-8 sm:px-12">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-10">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
                {section.features.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="group bg-black p-8 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      {feature.name}
                      <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/60 transition-colors" />
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                ))}
              </div>
            </SectionContent>
          </PageSection>
        ))}
      </PageContainer>
    </PageShell>
  );
}
