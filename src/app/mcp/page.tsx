import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Bot,
  MessageSquare,
  BarChart3,
  Shield,
  Zap,
  Terminal,
  Globe,
  Clock,
  Bell,
  Code,
  Search,
  Activity,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "MCP Integration — Query Monitors from AI Assistants | exit1.dev",
  description: "Connect exit1.dev to Claude, Cursor, and Windsurf via the Model Context Protocol. Ask about uptime, failures, and response times in natural language. No dashboards required.",
  keywords: "MCP, Model Context Protocol, AI monitoring, Claude, Cursor, Windsurf, uptime monitoring AI, conversational monitoring, AI assistant integration",
  openGraph: {
    title: "MCP Integration — Query Monitors from AI Assistants | exit1.dev",
    description: "Connect exit1.dev to Claude, Cursor, and Windsurf via the Model Context Protocol. Ask about uptime, failures, and response times in natural language.",
    type: "website",
    url: "https://exit1.dev/mcp",
  },
  twitter: {
    title: "MCP Integration — Query Monitors from AI Assistants | exit1.dev",
    description: "Connect exit1.dev to Claude, Cursor, and Windsurf via MCP. Ask about uptime and failures in natural language.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/mcp",
  },
};

const MCPPage = () => {
  const features = [
    {
      title: "Natural Language Queries",
      description: "Ask \"are any of my monitors down?\" or \"what's the uptime for my API this week?\" and get instant answers. No dashboards, no clicking, no context switching.",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
    },
    {
      title: "Works with Claude, Cursor & Windsurf",
      description: "Connect to Claude Desktop, Claude Code, Cursor, or Windsurf. Any AI tool that supports the Model Context Protocol can plug in.",
      icon: <Bot className="w-6 h-6 text-white" />,
    },
    {
      title: "5 Read-Only Tools",
      description: "List checks, get check details, pull historical results, query aggregate stats, and view status pages. All read-only — your data stays safe.",
      icon: <Shield className="w-6 h-6 text-white" />,
    },
    {
      title: "One-Line Setup",
      description: "Install via npx with zero dependencies. Add your API key to the config and restart your AI assistant. Connected in under 2 minutes.",
      icon: <Zap className="w-6 h-6 text-white" />,
    },
    {
      title: "Uptime & Performance Stats",
      description: "Query uptime percentages, average/min/max response times across multiple time ranges. Compare this week vs last week in a single prompt.",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
    {
      title: "Incident Investigation",
      description: "Ask your AI assistant to show recent failures, filter by status, and dig into historical check results with timestamps and error details.",
      icon: <Search className="w-6 h-6 text-white" />,
    },
  ];

  const comparisonTable = [
    {
      feature: "Natural language monitoring queries",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Claude Desktop support",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Cursor IDE support",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Windsurf support",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Claude Code (CLI) support",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Read-only (safe) access",
      exit1: true,
      competitors: "N/A",
    },
    {
      feature: "Zero-dependency install (npx)",
      exit1: true,
      competitors: "N/A",
    },
    {
      feature: "Historical data queries",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Multi-range stat comparison",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Available at $3/mo",
      exit1: true,
      competitors: "Enterprise only",
    },
  ];

  const faq = [
    {
      question: "What is MCP?",
      answer: "MCP (Model Context Protocol) is an open standard that lets AI assistants connect to external tools and data sources. Exit1's MCP server gives your AI assistant read-only access to your monitoring data, so you can ask questions in natural language instead of navigating dashboards.",
    },
    {
      question: "Which AI assistants are supported?",
      answer: "Claude Desktop, Claude Code, Cursor, and Windsurf are officially supported with setup instructions. Any AI tool that implements the Model Context Protocol can connect using the same npx-based configuration.",
    },
    {
      question: "Is my data safe?",
      answer: "Yes. The MCP server provides read-only access. It can list checks, get details, pull history, and view stats — but it cannot create, modify, or delete anything. Your API key needs only the checks:read scope.",
    },
    {
      question: "How do I set it up?",
      answer: "Create an API key in your Exit1 dashboard with checks:read scope. Then add the exit1 MCP server config to your AI assistant (a JSON block with your API key). The whole process takes under 2 minutes. See the full setup guide in our docs.",
    },
    {
      question: "What can I ask my AI assistant?",
      answer: "Anything about your monitoring data. Examples: \"Are any monitors down?\", \"What's the uptime for my API over 30 days?\", \"Show the last 10 failures for production\", \"Compare response times this week vs last week\", \"What does my status page show right now?\"",
    },
    {
      question: "What are the rate limits?",
      answer: "The MCP server uses your existing API rate limits: 5 requests/minute per key, 500 requests/day per key, and 2,000 requests/day per user. A typical AI conversation uses 2-5 tool calls, so you're unlikely to hit these limits.",
    },
    {
      question: "Is MCP available on the free plan?",
      answer: "MCP is a Nano plan feature. Free plan users can upgrade to Nano starting at $3/month to access it, along with unlimited monitors, SMS alerts, and all other Nano features.",
    },
    {
      question: "Do I need to install anything?",
      answer: "You need Node.js 18+ installed on your machine. The MCP server itself installs automatically via npx — no manual package installation required.",
    },
  ];

  const technicalDetails = {
    architecture:
      "The exit1-mcp server runs locally on your machine as a stdio-based MCP server. It communicates with your AI assistant through the Model Context Protocol standard. All API calls go directly from your machine to the Exit1 API — no intermediate servers, no data stored locally.",
    performance:
      "Tool calls execute in under 500ms for most queries. The server starts instantly via npx with zero warm-up time. Rate limits are enforced server-side at 5 requests/minute per API key, with generous daily limits for normal AI conversation patterns.",
    api:
      "The MCP server exposes 5 tools: list_checks, get_check, get_check_history, get_check_stats, and get_status_page. All tools are read-only and require a checks:read scoped API key. The server is published as exit1-mcp on npm and distributed via npx.",
  };

  const relatedFeatures = [
    {
      title: "API & Webhooks",
      description: "Full REST API access for programmatic integration. The MCP server is built on top of the same API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-white" />,
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends and response times. MCP lets you query the same data conversationally.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
    {
      title: "Smart Alerting",
      description: "Get notified via email, SMS, and webhooks. Use MCP to investigate after alerts fire.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-white" />,
    },
    {
      title: "Status Pages",
      description: "Public status pages for your customers. Query their current state via MCP.",
      href: "/status-pages",
      icon: <Globe className="w-6 h-6 text-white" />,
    },
    {
      title: "Real-Time Monitoring",
      description: "Live status updates for websites and APIs. Ask your AI assistant about current status anytime.",
      href: "/real-time-monitoring",
      icon: <Activity className="w-6 h-6 text-white" />,
    },
    {
      title: "Global Monitoring",
      description: "Monitor from multiple regions. MCP surfaces data from all regions in a single conversation.",
      href: "/global-monitoring",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "MCP Integration",
          description:
            "Connect exit1.dev to AI assistants like Claude, Cursor, and Windsurf via the Model Context Protocol. Query your monitoring data in natural language.",
          url: "https://exit1.dev/mcp",
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
        title="MCP Integration"
        subtitle="Ask your AI assistant about your monitors"
        description="Connect exit1.dev to Claude, Cursor, or Windsurf via the Model Context Protocol. Check uptime, investigate failures, and compare response times — all in natural language. No dashboards required."
        features={features}
        ctaText="Set Up MCP"
        ctaHref="https://docs.exit1.dev/integrations/mcp"
        seoTitle="MCP Integration — Query Monitors from AI Assistants | exit1.dev"
        seoDescription="Connect exit1.dev to Claude, Cursor, and Windsurf via the Model Context Protocol. Ask about uptime, failures, and response times in natural language."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        nanoUpgrade={{
          title: "MCP Is a Nano Feature",
          description:
            "Connect your AI assistant to exit1.dev and query monitoring data conversationally. Available on the Nano plan starting at $3/month.",
        }}
      />
    </>
  );
};

export default MCPPage;
