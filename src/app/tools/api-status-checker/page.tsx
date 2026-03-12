import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import ApiStatusCheckerTool from "./ApiStatusCheckerTool";
import {
  PageShell,
  PageContainer,
  PageSection,
  SectionContent,
} from "@/components/PageLayout";
import { PageHero } from "@/components/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToolsNav } from "@/components/ToolsNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title:
    "Free API Status Checker — Check Endpoint Health, Headers & Security | exit1.dev",
  description:
    "Free API status checker tool. Instantly check any API endpoint's uptime, response time, security headers, CORS configuration, and redirect chain. No signup required.",
  keywords:
    "api status checker, api health check, check api status, website status checker, http header checker, security header checker, cors checker, api uptime checker, endpoint checker, response time checker",
  openGraph: {
    title:
      "Free API Status Checker — Check Endpoint Health, Headers & Security | exit1.dev",
    description:
      "Free API status checker tool. Instantly check any API endpoint's uptime, response time, security headers, CORS configuration, and redirect chain. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/api-status-checker",
  },
  twitter: {
    title:
      "Free API Status Checker — Check Endpoint Health, Headers & Security | exit1.dev",
    description:
      "Free API status checker tool. Instantly check any API endpoint's uptime, response time, security headers, CORS configuration, and redirect chain. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/api-status-checker",
  },
};

const faq = [
  {
    question: "What does this API status checker do?",
    answer:
      "This tool sends a request to any URL or API endpoint and reports its status (up, down, or redirecting), response time, HTTP headers, security headers grade, CORS configuration, caching headers, and redirect chain — all in real time.",
  },
  {
    question: "Is this API status checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a URL and check instantly. There are no daily limits.",
  },
  {
    question: "What is a security headers grade?",
    answer:
      "The security grade (A+ through F) evaluates how well a server implements security best practices via HTTP headers. It checks for HSTS (Strict-Transport-Security), Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy. A higher grade means better protection against common web attacks.",
  },
  {
    question: "What are CORS headers?",
    answer:
      "CORS (Cross-Origin Resource Sharing) headers control which websites can make requests to an API. The Access-Control-Allow-Origin header specifies allowed origins, while other headers control allowed methods, headers, and credentials. Misconfigured CORS can either block legitimate requests or expose APIs to unauthorized access.",
  },
  {
    question: "Why does my API show redirects?",
    answer:
      "Redirects (301, 302, 307, 308) happen when a server sends your request to a different URL. Common reasons include HTTP to HTTPS upgrades, www to non-www redirects, URL canonicalization, or load balancing. While a few redirects are normal, excessive redirect chains can slow down your application.",
  },
  {
    question: "What is a good response time for an API?",
    answer:
      "Under 200ms is excellent, 200-500ms is good, 500-1000ms is acceptable for complex operations, and over 1 second may indicate performance issues. Response times vary based on server location, processing complexity, and network conditions.",
  },
  {
    question: "Can I monitor my API status continuously?",
    answer:
      "Yes! exit1.dev offers continuous API and website monitoring with alerts via email, Slack, Discord, and webhooks. You'll get notified instantly when your endpoints go down, respond slowly, or have SSL/domain issues.",
  },
];

export default function ApiStatusCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free API Status Checker Tool",
          description:
            "Free API status checker tool to instantly verify any endpoint's health, response time, security headers, and CORS configuration.",
          url: "https://exit1.dev/tools/api-status-checker",
          publisher: {
            "@type": "Organization",
            name: "exit1.dev",
            url: "https://exit1.dev",
          },
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
          <div className="px-4 sm:px-0 pt-24">
            <Breadcrumbs
              items={[
                { name: "Tools", href: "/tools" },
                { name: "API Status Checker", href: "/tools/api-status-checker" },
              ]}
            />
          </div>
          <PageHero size="lg">
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                API Status Checker
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly check any API endpoint&apos;s status, response time,
                security headers, and CORS configuration. Free, no signup
                required.
              </p>
            </div>
          </PageHero>

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/api-status-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense>
                <ApiStatusCheckerTool />
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
                Here&apos;s an example of the API health report this tool
                provides. Try it above with any endpoint.
              </p>
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8" aria-label="Example API status check result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                    200
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Endpoint Healthy</p>
                    <p className="text-xs text-muted-foreground">https://api.example.com — 142 ms response time</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Status Code</span>
                    <span className="text-sm font-medium text-emerald-400">200 OK</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">142 ms</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Content-Type</span>
                    <span className="text-sm font-medium">application/json</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Server</span>
                    <span className="text-sm font-medium">cloudflare</span>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Security Headers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Strict-Transport-Security</span>
                    <span className="text-xs font-medium text-emerald-400">Present</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">Content-Security-Policy</span>
                    <span className="text-xs font-medium text-emerald-400">Present</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">X-Frame-Options</span>
                    <span className="text-xs font-medium text-emerald-400">DENY</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground">X-Content-Type-Options</span>
                    <span className="text-xs font-medium text-emerald-400">nosniff</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The checker tests your endpoint with the HTTP method you choose
                  (GET, POST, HEAD, etc.) and reports the status code, response
                  time, and full response headers. A <strong className="text-white">200
                  OK</strong> confirms the endpoint is healthy. Codes like 301/302
                  indicate redirects, 403 means access is forbidden, and 5xx codes
                  signal server errors.
                </p>
                <p>
                  <strong className="text-white">Security headers</strong> protect
                  your users from common attacks.
                  Strict-Transport-Security (HSTS) forces HTTPS connections,
                  Content-Security-Policy prevents XSS attacks, X-Frame-Options
                  blocks clickjacking, and X-Content-Type-Options stops MIME-type
                  sniffing. Missing security headers leave your API and its users
                  exposed to known vulnerabilities.
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
                    Type any URL or API endpoint. We&apos;ll send a request and
                    follow any redirects automatically.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Analyze Headers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server checks the response status, security headers,
                    CORS configuration, caching headers, and redirect chain.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    See the Results
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View the full status report with a security grade,
                    response details, and actionable insights.
                  </p>
                </div>
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
                Learn More About API Monitoring
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on checking website status, security headers, and API endpoint monitoring.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Link href="/blog/how-to-check-if-website-is-down" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">How to Check If a Website Is Down</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guide to verifying outages, checking status codes, and diagnosing server issues.</p>
                </Link>
                <Link href="/blog/http-security-headers-explained" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">HTTP Security Headers Explained</h3>
                  <p className="text-sm text-muted-foreground">Complete checklist of security headers: HSTS, CSP, CORS, and how to implement them.</p>
                </Link>
                <Link href="/blog/api-endpoint-monitoring-playbook-2025" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">API Endpoint Monitoring Playbook</h3>
                  <p className="text-sm text-muted-foreground">Build a comprehensive API monitoring strategy with validation, alerts, and global coverage.</p>
                </Link>
                <Link href="/blog/api-observability-automation-toolkit" className="group block p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">API Observability Automation Toolkit</h3>
                  <p className="text-sm text-muted-foreground">Automate API monitoring with payload validation, status automation, and incident response.</p>
                </Link>
              </div>
            </SectionContent>
          </PageSection>

          {/* CTA */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous API Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your APIs and
                  websites 24/7 and alerts you instantly when something goes
                  wrong. Get notified via email, Slack, Discord, or webhooks.
                </p>
                <a
                  href="https://app.exit1.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold bg-white text-black hover:bg-white/90 transition-all duration-200"
                >
                  Start Free Monitoring
                </a>
              </div>
            </SectionContent>
          </PageSection>
        </PageContainer>
      </PageShell>
    </>
  );
}
