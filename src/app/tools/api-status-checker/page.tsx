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
import { ToolPageHero } from "@/components/ToolPageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolsNav } from "@/components/ToolsNav";

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

const LAST_UPDATED_ISO = "2026-05-04";
const LAST_UPDATED_DISPLAY = "May 4, 2026";

const howToSteps = [
  {
    name: "Enter the endpoint URL",
    text: "Paste any API endpoint or website URL. Choose the HTTP method if you need POST/HEAD/PUT — GET is the default.",
  },
  {
    name: "Run the check",
    text: "Our server sends the request, follows redirects, and captures every response header, the status code, response time, and CORS configuration.",
  },
  {
    name: "Read the report",
    text: "Inspect the security headers grade, response details, redirect chain, and any caching directives. Copy or share the report instantly.",
  },
];

const apiErrors = [
  {
    code: "400 Bad Request",
    title: "The server rejected the request",
    body: "The request was malformed — missing required parameters, invalid JSON, wrong content type, or an unsupported query string. Inspect the response body for the server's specific complaint and fix the request.",
  },
  {
    code: "401 Unauthorized",
    title: "Authentication required or invalid",
    body: "The endpoint requires authentication and either no credentials were supplied or the ones provided are invalid (expired token, wrong API key, signature mismatch). Check the WWW-Authenticate header for the expected scheme.",
  },
  {
    code: "403 Forbidden",
    title: "Authenticated but not allowed",
    body: "Credentials were accepted but the caller does not have permission for this resource. Different from 401 — re-authenticating will not help. Check IAM/role policy or per-resource ACLs.",
  },
  {
    code: "404 Not Found",
    title: "Endpoint or resource does not exist",
    body: "Either the URL is wrong, the resource was deleted, or the API version in the path does not exist. Some APIs also return 404 for resources the caller is not allowed to see (to avoid leaking existence).",
  },
  {
    code: "429 Too Many Requests",
    title: "Rate limit exceeded",
    body: "The caller has exceeded the API's rate limit. Inspect Retry-After, X-RateLimit-Remaining, and X-RateLimit-Reset headers to back off correctly. Implementing exponential backoff is the industry-standard fix.",
  },
  {
    code: "500 Internal Server Error",
    title: "Generic server-side failure",
    body: "Something blew up on the server — unhandled exception, uncaught database error, deployment in a broken state. Repeat the request to confirm it is consistent, then check server logs / your error tracker.",
  },
  {
    code: "502 Bad Gateway",
    title: "Upstream server returned an invalid response",
    body: "Your reverse proxy or CDN reached the origin but the origin returned garbage (or crashed mid-response). Often a sign the origin is restarting, OOM-killed, or a worker process is wedged.",
  },
  {
    code: "503 Service Unavailable",
    title: "Server is temporarily overloaded or down",
    body: "The server is intentionally refusing requests — maintenance mode, graceful shutdown, or autoscaler still booting capacity. Honor Retry-After if present. If you see 503s without one, the origin is likely overwhelmed.",
  },
  {
    code: "504 Gateway Timeout",
    title: "Upstream did not respond in time",
    body: "Your reverse proxy or CDN gave up waiting on the origin. Usually means a slow database query, a hung dependency, or a long-running request that exceeds the proxy's timeout. Optimize the slow path or raise the timeout.",
  },
  {
    code: "CORS error (no status)",
    title: "Browser blocked the response",
    body: "Returned in browser dev tools, not at the HTTP level — the server did not send the right Access-Control-Allow-Origin. Test from this checker (which bypasses CORS) to confirm the endpoint works server-side, then fix the CORS headers.",
  },
];

const glossary = [
  {
    term: "Status codes (1xx–5xx)",
    body: "1xx informational, 2xx success, 3xx redirection, 4xx client error (your fault), 5xx server error (their fault). Knowing the family tells you who needs to fix what before you read a single byte of the body.",
  },
  {
    term: "TTFB",
    body: "Time To First Byte — how long after the request was sent until the first response byte arrived. Captures DNS, TCP, TLS, and server processing time. Under 200 ms is excellent; over 600 ms hurts perceived performance and Core Web Vitals.",
  },
  {
    term: "CORS",
    body: "Cross-Origin Resource Sharing. Browsers block cross-origin XHR by default; the server opts in by sending Access-Control-Allow-Origin. Misconfigured CORS either blocks legitimate frontends or exposes the API to any origin (the * wildcard).",
  },
  {
    term: "HSTS",
    body: "Strict-Transport-Security tells browsers to always use HTTPS for the domain. With max-age and the preload flag, the very first connection is forced to HTTPS — eliminating downgrade attacks.",
  },
  {
    term: "Content-Security-Policy",
    body: "Tells the browser which sources are allowed to load scripts, styles, frames, and images. The single most effective defense against stored XSS when paired with sensible defaults like 'self' and explicit allowlists.",
  },
  {
    term: "Cache-Control",
    body: "Controls how clients and proxies cache the response. public,max-age=3600 = anyone can cache for 1h. no-store = never cache. private = only the end user, not the CDN. Wrong cache headers either kill performance or leak data.",
  },
];

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
          name: "Free API Status Checker",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://exit1.dev/tools/api-status-checker",
          description:
            "Free online API status checker. Sends HTTP requests, follows redirects, and reports status code, response time, security headers grade, CORS, and caching configuration for any endpoint.",
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
          name: "How to check an API endpoint's status and headers",
          description:
            "Use the exit1.dev API status checker to inspect any endpoint's response, security headers, and CORS configuration in seconds.",
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
            toolName="API Status Checker"
            href="/tools/api-status-checker"
            title="API Status Checker"
            description="Instantly check any API endpoint&apos;s status, response time, security headers, and CORS configuration. Free, no signup required."
          />

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
              <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl p-6 sm:p-8" aria-label="Example API status check result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
                  <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-xs font-bold text-success">
                    200
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">Endpoint Healthy</p>
                    <p className="text-xs text-muted-foreground">https://api.example.com — 142 ms response time</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Status Code</span>
                    <span className="text-sm font-medium text-success">200 OK</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">142 ms</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Content-Type</span>
                    <span className="text-sm font-medium">application/json</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Server</span>
                    <span className="text-sm font-medium">cloudflare</span>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Security Headers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Strict-Transport-Security</span>
                    <span className="text-xs font-medium text-success">Present</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">Content-Security-Policy</span>
                    <span className="text-xs font-medium text-success">Present</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">X-Frame-Options</span>
                    <span className="text-xs font-medium text-success">DENY</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-foreground/5">
                    <span className="text-xs text-muted-foreground">X-Content-Type-Options</span>
                    <span className="text-xs font-medium text-success">nosniff</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The checker tests your endpoint with the HTTP method you choose
                  (GET, POST, HEAD, etc.) and reports the status code, response
                  time, and full response headers. A <strong className="text-foreground">200
                  OK</strong> confirms the endpoint is healthy. Codes like 301/302
                  indicate redirects, 403 means access is forbidden, and 5xx codes
                  signal server errors.
                </p>
                <p>
                  <strong className="text-foreground">Security headers</strong> protect
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

          {/* HTTP & API Glossary */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                HTTP &amp; API Glossary
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The headers and terms that appear in any API check — explained without the spec-speak.
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

          {/* HTTP Status Codes & Common Errors */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                HTTP Status Codes &amp; Common API Errors
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                The status codes you actually run into in production, what they mean, and how to fix them.
              </p>
              <div className="space-y-4 max-w-3xl mx-auto">
                {apiErrors.map((err) => (
                  <div
                    key={err.code}
                    id={`code-${err.code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    className="p-5 rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                  >
                    <code className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-destructive/10 border border-destructive/20 text-destructive mb-3">
                      {err.code}
                    </code>
                    <h3 className="font-semibold mb-2">{err.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{err.body}</p>
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
                Learn More About API Monitoring
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Guides on checking website status, security headers, and API endpoint monitoring.
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
                  Need Continuous API Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your APIs and
                  websites 24/7 and alerts you instantly when something goes
                  wrong. Get notified via email, Slack, Discord, or webhooks.
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
