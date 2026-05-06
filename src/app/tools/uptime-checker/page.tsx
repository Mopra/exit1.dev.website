import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import UptimeCheckerTool from "./UptimeCheckerTool";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { ToolPageHero } from "@/components/ToolPageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolsNav } from "@/components/ToolsNav";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title:
    "Free Website Uptime Checker — Check If Your Site Is Up & Healthy | exit1.dev",
  description:
    "Free uptime checker tool. Instantly check if any website is online and healthy. Analyzes DNS, SSL, redirects, response time, security headers, and content health with detailed grades. No signup required.",
  keywords:
    "uptime checker, website uptime checker, is my website down, website health check, check if website is up, website status checker, site uptime test, website availability checker, HSTS checker, security headers checker, TTFB checker, website performance checker",
  openGraph: {
    title:
      "Free Website Uptime Checker — Check If Your Site Is Up & Healthy | exit1.dev",
    description:
      "Free uptime checker tool. Instantly check if any website is online and healthy. Analyzes DNS, SSL, redirects, response time, security headers, and content health with detailed grades. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/uptime-checker",
  },
  twitter: {
    title:
      "Free Website Uptime Checker — Check If Your Site Is Up & Healthy | exit1.dev",
    description:
      "Free uptime checker tool. Instantly check if any website is online and healthy. Analyzes DNS, SSL, redirects, response time, security headers, and content health with detailed grades. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/uptime-checker",
  },
};

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter a URL",
    text: "Type any website URL or domain. The tool resolves DNS, follows redirects, and analyses the full response chain.",
  },
  {
    name: "Run the deep check",
    text: "Our server tests DNS, SSL, redirects, response time, TTFB, security headers, compression, and page content in parallel.",
  },
  {
    name: "Read the graded report",
    text: "See an A+ to F grade per category — DNS, SSL, response, security, performance, content — plus an overall score and prioritised recommendations.",
  },
];

const uptimeIssues = [
  {
    code: "Connection timeout",
    title: "Server did not respond in time",
    body: "Either the host is overloaded, a firewall is dropping packets, or the path is broken. Test with the ping tool to see if TCP can connect at all. If TCP connects but HTTP times out, the application layer is the problem.",
  },
  {
    code: "DNS resolution failed",
    title: "Domain does not resolve",
    body: "NXDOMAIN, SERVFAIL, or no answer. Check that the domain is registered and that nameservers respond. If you just made a change, propagation can take from minutes to 48 hours depending on TTL.",
  },
  {
    code: "SSL certificate expired",
    title: "TLS certificate has passed its expiry date",
    body: "Browsers block the page completely. Renew immediately. The SSL Checker tool shows exact validFrom/validTo and which CA issued the certificate. Modern setups (Let's Encrypt, Caddy, Cloudflare) auto-renew — re-enable it.",
  },
  {
    code: "5xx server errors",
    title: "Application is broken",
    body: "500/502/503/504 mean the server reached you but the app failed. Check application logs and your error tracker. Recent deployments are the most common cause.",
  },
  {
    code: "Slow TTFB (> 600 ms)",
    title: "Server is slow to first byte",
    body: "Hurts perceived performance and Core Web Vitals. Common causes: slow database query on the home page, no CDN, unoptimised render path, or under-provisioned servers. Profile the slow request to find the bottleneck.",
  },
  {
    code: "Missing HSTS",
    title: "No HTTPS enforcement",
    body: "Without HSTS, the first request after typing http:// is vulnerable to a downgrade attack. Add Strict-Transport-Security with at least max-age=31536000 once you are confident in your HTTPS setup.",
  },
  {
    code: "Missing CSP",
    title: "No Content Security Policy",
    body: "CSP is the strongest defence against stored and reflected XSS. Without one, any injected script can run with full page privileges. Start with a report-only policy, watch the violations, then enforce.",
  },
  {
    code: "No compression",
    title: "Responses sent uncompressed",
    body: "Without gzip or brotli, text payloads are 4–10× larger than they should be. Hurts bandwidth costs and load time. Enable at the CDN or origin — almost every server framework supports it with one flag.",
  },
];

const glossary = [
  {
    term: "Uptime",
    body: "Percentage of time a service responds correctly. Three nines = 99.9% (≈ 8.7 hours of downtime per year). Four nines = 99.99% (≈ 52 minutes per year). The number sets your engineering budget — every additional nine costs roughly an order of magnitude more.",
  },
  {
    term: "TTFB",
    body: "Time To First Byte. The wall-clock time from request sent to first response byte received. Includes DNS, TCP, TLS, and server processing. A core Web Vitals input — Google considers under 800 ms 'good' and over 1.8 s 'poor'.",
  },
  {
    term: "HSTS",
    body: "HTTP Strict Transport Security. A response header that locks the browser to HTTPS for the configured max-age. With the preload directive, your domain ships in browser binaries, so even the first connection is HTTPS.",
  },
  {
    term: "CSP",
    body: "Content Security Policy. The most effective in-browser defence against XSS. Restricts which sources can load scripts, styles, frames, and connect-src endpoints. Best deployed in report-only mode first, then enforced.",
  },
  {
    term: "Core Web Vitals",
    body: "Google's user-experience metrics that influence ranking. LCP (Largest Contentful Paint) measures load speed; INP (Interaction to Next Paint) measures responsiveness; CLS (Cumulative Layout Shift) measures visual stability. TTFB feeds into LCP.",
  },
  {
    term: "Compression (gzip / brotli)",
    body: "Compresses HTTP responses before sending. gzip is universal; brotli is newer and ~15% better for text. Mandatory for HTML, CSS, JS, and JSON. Already-compressed payloads (images, video) should not be double-compressed.",
  },
  {
    term: "Status page",
    body: "A public page that reports current operational status. Communicates incidents transparently to users without overwhelming support. exit1.dev includes managed status pages on every plan.",
  },
];

const faq = [
  {
    question: "What does this uptime checker do?",
    answer:
      "This tool performs a comprehensive health check on any website. It tests DNS resolution, SSL certificate validity, redirect chains, HTTP response, performance metrics (TTFB, content size, compression), security headers (HSTS, CSP, X-Frame-Options, and more), and content health (title tag, meta description, favicon). Each category receives a grade from A+ to F, plus an overall health score.",
  },
  {
    question: "Is this uptime checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a URL and get a full health report instantly. There are no daily limits.",
  },
  {
    question: "What is TTFB and why does it matter?",
    answer:
      "TTFB (Time to First Byte) measures how long it takes for your browser to receive the first byte of data from the server after making a request. A fast TTFB (under 200ms) means your server is responding quickly. Slow TTFB can indicate server performance issues, overloaded hosting, or slow database queries. Google uses TTFB as a factor in Core Web Vitals.",
  },
  {
    question: "What are security headers and why should I care?",
    answer:
      "Security headers are HTTP response headers that protect your website and visitors from common attacks. Strict-Transport-Security (HSTS) forces HTTPS connections, Content-Security-Policy prevents XSS attacks, X-Frame-Options blocks clickjacking, and X-Content-Type-Options stops MIME-type sniffing. Missing security headers leave your site and users vulnerable to known attack vectors.",
  },
  {
    question: "What is HSTS and how does it protect my site?",
    answer:
      "HSTS (HTTP Strict Transport Security) is a security header that tells browsers to always connect to your site over HTTPS, even if a user types http://. This prevents protocol downgrade attacks and cookie hijacking. The 'preload' directive goes further by adding your domain to a built-in browser list, so the very first connection is always HTTPS.",
  },
  {
    question: "How is the overall health grade calculated?",
    answer:
      "The overall grade is an average of all category scores: DNS resolution, SSL/TLS, redirects, response, performance, security headers, and content health. Each category is scored from 0-100 based on specific criteria, then converted to a letter grade (A+ for 95+, A for 90+, B for 80+, C for 70+, D for 60+, F below 60). The overall grade gives you a quick snapshot of your website's health.",
  },
  {
    question: "Why does my site get a low security grade?",
    answer:
      "Common reasons for low security grades include: missing HSTS header (no HTTPS enforcement), missing Content-Security-Policy (no XSS protection), missing X-Frame-Options (vulnerable to clickjacking), missing X-Content-Type-Options (MIME sniffing risk), not using HTTPS, or using an outdated TLS version. Each missing header reduces your security score.",
  },
  {
    question: "Can I monitor my website's uptime continuously?",
    answer:
      "Yes! exit1.dev offers continuous website and API monitoring with checks every 2 minutes from multiple regions worldwide. You'll get instant alerts via email, Slack, Discord, Microsoft Teams, or webhooks when your site goes down, responds slowly, or has SSL/domain issues. Start free at app.exit1.dev.",
  },
];

export default function UptimeCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Website Uptime Checker Tool",
          description:
            "Free uptime checker tool to instantly verify any website's health, including DNS, SSL, redirects, response time, security headers, and content health.",
          url: "https://exit1.dev/tools/uptime-checker",
          dateModified: LAST_UPDATED_ISO,
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        data={{
          name: "Free Website Uptime Checker",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/uptime-checker",
          description:
            "Free online uptime and website health checker. Tests DNS, SSL, redirects, TTFB, security headers, compression, and content health, with category grades and an overall score.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
        }}
      />
      <StructuredData
        type="HowTo"
        data={{
          name: "How to check if a website is up and healthy",
          description:
            "Use the exit1.dev uptime checker to run a deep health analysis on any website — DNS, SSL, security, performance, and content — in seconds.",
          step: howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
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

      <PageShell>
        <PageContainer>
          <ToolPageHero
            toolName="Uptime Checker"
            href="/tools/uptime-checker"
            title="Website Uptime Checker"
            description="Check if any website is online and healthy. Get a full health report covering DNS, SSL, security headers, performance, and content - with grades for each category."
          />

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/uptime-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense>
                <UptimeCheckerTool />
              </Suspense>
            </SectionContent>
          </PageSection>

          {/* Example Result — static, crawlable by Google */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                What You Get
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Here&apos;s an example of the health report this tool provides.
                Try it above with any website.
              </p>
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8" aria-label="Example uptime check result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-success">A</span>
                    <span className="text-[9px] text-success/70">92/100</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">Website is Up &amp; Healthy</p>
                    <p className="text-xs text-muted-foreground">https://example.com — 187ms response time</p>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Category Grades</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "DNS", grade: "A+", score: "98" },
                    { label: "SSL/TLS", grade: "A", score: "95" },
                    { label: "Response", grade: "A", score: "90" },
                    { label: "Security", grade: "B", score: "80" },
                  ].map((cat) => (
                    <div key={cat.label} className="text-center bg-foreground/[0.02] rounded-lg p-3 border border-foreground/5">
                      <div className="text-[10px] text-muted-foreground uppercase">{cat.label}</div>
                      <div className={cn(
                        "text-xl font-bold mt-1",
                        cat.grade.startsWith("A") ? "text-success" : "text-primary"
                      )}>
                        {cat.grade}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{cat.score}/100</div>
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Key Findings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">TTFB</span>
                    <span className="text-sm font-medium text-success">142ms</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">SSL Certificate</span>
                    <span className="text-sm font-medium text-success">Valid (287 days)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">HSTS</span>
                    <span className="text-xs font-medium text-success">Enabled + Preload</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Compression</span>
                    <span className="text-xs font-medium text-success">gzip</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The uptime checker performs a deep analysis of your website
                  across seven categories. <strong className="text-foreground">DNS
                  resolution</strong> verifies your domain resolves correctly and
                  measures lookup speed. <strong className="text-foreground">SSL/TLS</strong> checks
                  certificate validity, expiry, and protocol version.
                </p>
                <p>
                  <strong className="text-foreground">Security headers</strong> evaluate
                  protection against common web attacks — HSTS, CSP, clickjacking
                  prevention, and more. <strong className="text-foreground">Performance</strong> measures
                  response time, TTFB, content size, and compression. <strong className="text-foreground">Content
                  health</strong> checks that your page has proper HTML structure
                  (title, meta description, favicon) and isn&apos;t returning an
                  error page.
                </p>
              </div>
            </SectionContent>
          </PageSection>

          {/* How It Works */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Enter URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Type any website URL. We&apos;ll resolve the domain, follow
                    redirects, and analyze the full response.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Deep Health Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We check DNS, SSL, redirects, response time, TTFB, security
                    headers, compression, and page content in parallel.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Get Your Report
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View grades for each category with detailed explanations.
                    Copy, share, or download the full report.
                  </p>
                </div>
              </div>
            </SectionContent>
          </PageSection>

          {/* Website Health Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Website Health Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The terms behind every grade in your health report — without the marketing fluff.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {glossary.map((item) => (
                  <div
                    key={item.term}
                    id={`glossary-${item.term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <h3 className="font-semibold mb-1.5">{item.term}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* Common Issues That Hurt Your Grade */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Common Issues That Hurt Your Grade
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The findings that drag the overall score down — what each one means and how to fix it.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {uptimeIssues.map((s) => (
                  <div
                    key={s.code}
                    id={`issue-${s.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-warning/10 border border-warning/20 text-warning mb-3">
                      {s.code}
                    </code>
                    <h3 className="font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </SectionContent>
          </PageSection>

          {/* FAQ Section */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faq.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border-primary/10"
                    >
                      <AccordionTrigger className="text-left text-base hover:text-primary hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </SectionContent>
          </PageSection>

          {/* Related Articles */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Learn More About Website Monitoring
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on uptime monitoring, security headers, and website performance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link href="/blog/how-to-check-if-website-is-down" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">How to Check If a Website Is Down</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guide to verifying outages, checking status codes, and diagnosing server issues.</p>
                </Link>
                <Link href="/blog/http-security-headers-explained" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">HTTP Security Headers Explained</h3>
                  <p className="text-sm text-muted-foreground">Complete checklist of security headers: HSTS, CSP, CORS, and how to implement them.</p>
                </Link>
                <Link href="/blog/api-endpoint-monitoring-playbook-2025" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">API Endpoint Monitoring Playbook</h3>
                  <p className="text-sm text-muted-foreground">Build a comprehensive API monitoring strategy with validation, alerts, and global coverage.</p>
                </Link>
                <Link href="/blog/api-observability-automation-toolkit" className="group block p-6 rounded-xl border border-foreground/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">API Observability Automation Toolkit</h3>
                  <p className="text-sm text-muted-foreground">Automate API monitoring with payload validation, status automation, and incident response.</p>
                </Link>
              </div>
            </SectionContent>
          </PageSection>

          {/* Trust & freshness */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <p className="text-center text-xs text-muted-foreground">
                Last updated{" "}
                <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>{" "}
                · Built and maintained by{" "}
                <Link href="/" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  exit1.dev
                </Link>
                {" "}— uptime, SSL, and domain monitoring with instant alerts.
              </p>
            </SectionContent>
          </PageSection>

          {/* CTA */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous Uptime Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your websites 24/7
                  with checks every 2 minutes from multiple regions. Get instant
                  alerts via email, Slack, Discord, or webhooks when something goes
                  wrong.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold"
                >
                  <a
                    href="https://app.exit1.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Free Monitoring
                  </a>
                </Button>
              </div>
            </SectionContent>
          </PageSection>
        </PageContainer>
      </PageShell>
    </>
  );
}
