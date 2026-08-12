import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/ProductPage';
import StructuredData from '@/components/StructuredData';
import {
  Bot,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  Bell,
  Code,
  Search,
  Activity,
  Wrench,
} from 'lucide-react';

const HOSTED_COMMAND = 'claude mcp add --transport http exit1 https://app.exit1.dev/mcp/v1';

export const metadata: Metadata = {
  title: "Set Up Uptime Monitoring From Your Editor — MCP Server",
  description: "Let Claude, Cursor or Codex read your repo, create the monitors, wire up alerts and fire a real test alert to prove delivery works. One command, no API key. Then ask about uptime in plain language.",
  keywords: "MCP, Model Context Protocol, MCP server, AI monitoring, Claude Code, Cursor, VS Code, Windsurf, Codex, Gemini, Goose, uptime monitoring AI, agent monitoring setup, conversational monitoring",
  openGraph: {
    title: "Set Up Uptime Monitoring From Your Editor — exit1.dev MCP Server",
    description: "One command connects Claude, Cursor or Codex to exit1. Your assistant reads the repo, creates the monitors, configures alerts, and proves delivery works.",
    type: "website",
    url: "https://exit1.dev/mcp",
  },
  twitter: {
    title: "Set Up Uptime Monitoring From Your Editor — exit1.dev MCP Server",
    description: "One command connects Claude, Cursor or Codex to exit1. Your assistant reads the repo and sets the monitoring up for you.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/mcp",
  },
};

const MCPPage = () => {
  const features = [
    {
      title: "It Sets Monitoring Up For You",
      description: "Point your assistant at a project and it reads the repo — deploy configs, env files, health route handlers — works out what should be monitored, and creates the checks. You approve the list; it does the typing.",
      icon: <Wrench className="w-6 h-6 text-foreground" />,
    },
    {
      title: "One Command, No API Key",
      description: "The hosted server uses OAuth. Run one command, approve in the browser, done. Sign-up happens inline if you don't have an account yet — no dashboard visit, no key to paste, no config file to edit.",
      icon: <Zap className="w-6 h-6 text-foreground" />,
    },
    {
      title: "14 Tools — Read And Write",
      description: "Seven read tools for uptime, history and stats. Seven write tools to create and update checks, pause them, set email recipients, and connect Slack, Discord or Teams. Delete is opt-in and never granted by default.",
      icon: <Bot className="w-6 h-6 text-foreground" />,
    },
    {
      title: "It Proves The Alert Works",
      description: "The setup playbook finishes by firing a real test alert, because a channel that was configured but never tested is the most common way monitoring silently fails. You see the alert arrive before you walk away.",
      icon: <Bell className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Real Health Checks, Not 200-Checking",
      description: "Your assistant finds your /health endpoint and asserts on the response body with JSONPath — because a 200 with a dead database is still a 200. Plus DNS drift, domain expiry, TCP ports, ICMP and cron heartbeats.",
      icon: <ShieldCheck className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Then Ask It Anything",
      description: "\"Is anything down?\" \"What's the uptime on my API this month?\" \"Show me the last ten failures.\" \"Compare response times this week vs last.\" No dashboard, no context switch.",
      icon: <MessageSquare className="w-6 h-6 text-foreground" />,
    },
  ];

  const comparisonTable = [
    {
      feature: "Agent creates and configures monitors for you",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Hosted MCP server with OAuth (no API key)",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Ships a setup playbook as an MCP prompt",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Natural language monitoring queries",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Claude, Cursor, VS Code, Windsurf, Codex, Gemini, Goose",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Per-scope permissions, revocable per client",
      exit1: true,
      competitors: "N/A",
    },
    {
      feature: "Listed on the official MCP registry",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Historical data and multi-range stat comparison",
      exit1: true,
      competitors: false,
    },
    {
      feature: "Available on the free plan",
      exit1: true,
      competitors: "Enterprise only",
    },
  ];

  const faq = [
    {
      question: "What is MCP?",
      answer: "MCP (Model Context Protocol) is an open standard that lets AI assistants connect to external tools and data. Exit1's MCP server gives your assistant both read and write access to your monitoring — so it can set monitoring up for you, then answer questions about it in plain language.",
    },
    {
      question: "How do I set it up?",
      answer: `Run one command: ${HOSTED_COMMAND}. Your assistant opens a browser, you sign in (or sign up — it happens inline), approve the permissions, and you're connected. No API key, no config file, no Node.js install.`,
    },
    {
      question: "Which AI assistants are supported?",
      answer: "Claude Code and Claude Desktop, Cursor, and VS Code with Copilot support the hosted OAuth server today. Windsurf, Codex CLI, Gemini CLI, Goose and ChatGPT work via the local npm package (exit1-mcp), which exposes exactly the same tools using an API key instead of OAuth. Remote MCP with OAuth is still rolling out across clients.",
    },
    {
      question: "Can it change or delete my monitors?",
      answer: "It can create, update and pause monitors, and configure alert channels — that is the point, and it is what lets an agent set monitoring up for you. Deleting is separate: the checks:delete scope is never granted unless a client explicitly asks for it, and the consent screen shows you every permission before you approve. You can revoke any connection at app.exit1.dev/mcp, which kills every token issued to that client immediately.",
    },
    {
      question: "What can I ask my AI assistant?",
      answer: "\"Set up monitoring for this project.\" \"Is anything down right now?\" \"What's the uptime for my API over 30 days?\" \"Show the last 10 failures for production.\" \"Add a check on staging and send alerts to #ops in Slack.\" \"Monitor my nightly billing cron as a heartbeat.\"",
    },
    {
      question: "Is MCP available on the free plan?",
      answer: "Yes. The hosted server has no plan requirement at all, and the local npm package needs an API key that every plan can mint, Free included. Normal plan limits still apply either way — Free covers 50 monitors at 5-minute intervals, with DNS and domain checks reserved for paid plans. Your assistant calls get_account first so it plans within whatever your plan allows.",
    },
    {
      question: "Do I need to install anything?",
      answer: "Not for the hosted server — it runs on our infrastructure and your client connects over HTTP. The local option needs Node.js 18+ and installs itself via npx, with no manual package install.",
    },
    {
      question: "What are the rate limits?",
      answer: "The MCP server runs on the same public API rate limits as everything else, applied per key and per user. A typical assistant conversation uses a handful of tool calls, so you are unlikely to notice them. Current numbers are in the API reference in our docs.",
    },
  ];

  const technicalDetails = {
    architecture:
      "Two transports, one identical tool surface. The hosted server is a stateless streamable-HTTP endpoint at app.exit1.dev/mcp/v1, authenticated with OAuth 2.1 (PKCE, dynamic client registration) — your client registers itself, so there is nothing to configure. The local option is the exit1-mcp npm package running on your machine over stdio with an API key. Every tool in both is a thin wrapper over the public REST API, so tier caps, scope checks, rate limits and URL validation are enforced server-side and cannot be bypassed through the MCP surface.",
    performance:
      "Most tool calls return in well under a second. The hosted server needs no install and no warm-up; the local package starts instantly via npx and carries a single runtime dependency, the official MCP SDK. Nothing is stored on your machine beyond your client's own config.",
    api:
      "14 tools. Read: get_account, list_checks, get_check, get_check_history, get_check_stats, get_status_page, get_alert_settings. Write: create_check, update_check, toggle_check, delete_check, set_email_alerts, add_webhook_alert, send_test_alert. Plus a setup_monitoring prompt carrying the full playbook. Every tool is annotated with readOnlyHint, and delete_check with destructiveHint, so your client can warn you before it acts. Published as exit1-mcp on npm and as dev.exit1/exit1-mcp on the official MCP registry.",
  };

  const relatedFeatures = [
    {
      title: "API & Webhooks",
      description: "Full REST API access for programmatic integration. The MCP server is built on top of the same API.",
      href: "/api-webhooks",
      icon: <Code className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Analytics & Reports",
      description: "Track uptime trends and response times. MCP lets you query the same data conversationally.",
      href: "/analytics",
      icon: <BarChart3 className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Smart Alerting",
      description: "Email, SMS and webhooks. Your assistant can configure these for you — and prove they work.",
      href: "/alerting",
      icon: <Bell className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Status Pages",
      description: "Public status pages for your customers. Query their current state via MCP.",
      href: "/status-pages",
      icon: <Globe className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Live Checks",
      description: "Watch probes stream live in the browser while your AI assistant queries the same data via MCP.",
      href: "/live-checks",
      icon: <Activity className="w-6 h-6 text-foreground" />,
    },
    {
      title: "Global Monitoring",
      description: "Monitor from multiple regions. MCP surfaces data from all regions in a single conversation.",
      href: "/global-monitoring",
      icon: <Search className="w-6 h-6 text-foreground" />,
    },
  ];

  return (
    <>
      <StructuredData
        type="Product"
        data={{
          name: "exit1.dev MCP Server",
          description:
            "Connect Claude, Cursor, VS Code, Windsurf, Codex, Gemini and more to exit1.dev over the Model Context Protocol. Your assistant reads the repo, creates the monitors, configures alerts, and answers uptime questions in plain language.",
          url: "https://exit1.dev/mcp",
          brand: {
            "@type": "Brand",
            name: "exit1.dev",
          },
          offers: {
            "@type": "Offer",
            price: "0",
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
        title="Set up monitoring from your editor"
        subtitle="One command. Your AI assistant does the rest."
        description="Connect exit1.dev to Claude, Cursor, Codex or any MCP client. Your assistant reads the repo, works out what should be monitored, creates the checks, configures alerts, and fires a real test alert to prove delivery works. Then you can just ask it about uptime."
        features={features}
        ctaText="Get started free"
        ctaHref="https://app.exit1.dev/sign-up"
        seoTitle="Set Up Uptime Monitoring From Your Editor — exit1.dev MCP Server"
        seoDescription="One command connects Claude, Cursor or Codex to exit1. Your assistant reads the repo, creates the monitors, configures alerts, and proves delivery works. No API key required."
        comparisonTable={comparisonTable}
        faq={faq}
        technicalDetails={technicalDetails}
        relatedFeatures={relatedFeatures}
        heroExtra={
          // The hosted one-liner is the whole pitch, so it goes above the fold
          // rather than behind a docs link. Visitors arriving from an MCP
          // directory already know what MCP is — they want the command.
          <section className="mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6">
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 sm:p-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Paste this into Claude Code, then ask it to set up monitoring for your project:
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-left text-xs leading-relaxed sm:text-sm">
                <code>{HOSTED_COMMAND}</code>
              </pre>
              <p className="mt-3 text-xs text-muted-foreground">
                OAuth in the browser — no API key. Sign-up happens inline if you don&rsquo;t have an
                account.{' '}
                <a
                  href="https://docs.exit1.dev/integrations/mcp"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Other clients and the npm package
                </a>
                .
              </p>
            </div>
          </section>
        }
      />
    </>
  );
};

export default MCPPage;
