# Redirect Checker Free Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a free "Redirect Checker" tool to the website at `/tools/redirect-checker`, following the exact same pattern as the existing SSL Checker, Domain Checker, API Status Checker, and Ping Test tools.

**Architecture:** New API route (`/api/redirect-check`) that makes an HTTP request with `redirect: "manual"`, captures each hop in the redirect chain, and returns status codes, Location headers, response times, and a summary. New client component (`RedirectCheckerTool.tsx`) renders the form, loading animation, and results. New landing page (`page.tsx`) follows the same structure as the SSL Checker page (hero, ToolsNav, tool component, "What You Get" example, "How It Works", FAQ, related articles, CTA). The ToolsNav and tools landing page are updated to include the new tool.

**Tech Stack:** Next.js App Router, React (client component), lucide-react icons, shadcn/ui Button + Accordion, Tailwind CSS.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/api/redirect-check/route.ts` | Create | API route: follows redirects manually, returns chain + timing + headers |
| `src/app/tools/redirect-checker/RedirectCheckerTool.tsx` | Create | Client component: input form, loading steps, results display |
| `src/app/tools/redirect-checker/page.tsx` | Create | Landing page: metadata, hero, FAQ, example result, CTA |
| `src/components/ToolsNav.tsx` | Modify | Add "Redirect Checker" entry to the tools nav bar |
| `src/app/tools/page.tsx` | Modify | Add "Redirect Checker" card to the tools landing grid |

---

### Task 1: API Route — `/api/redirect-check/route.ts`

**Files:**
- Create: `src/app/api/redirect-check/route.ts`

- [ ] **Step 1: Create the API route file**

This route accepts a POST with `{ url: string }`, follows redirects manually (up to 10 hops), and returns the full chain with timing. It reuses the SSRF-protection pattern from the existing `api-status-check/route.ts`.

```ts
import dns from "dns";
import { NextRequest, NextResponse } from "next/server";

interface RedirectHop {
  url: string;
  statusCode: number;
  statusText: string;
  location: string | null;
  responseTimeMs: number;
  server?: string;
  headers: Record<string, string>;
}

interface RedirectCheckResult {
  inputUrl: string;
  finalUrl: string;
  totalHops: number;
  totalTimeMs: number;
  isRedirect: boolean;
  finalStatusCode: number;
  finalStatusText: string;
  chain: RedirectHop[];
  error?: string;
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length === 4) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 0) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  if (ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) {
    return true;
  }
  return false;
}

async function resolveIP(hostname: string): Promise<string | undefined> {
  try {
    const { address } = await dns.promises.lookup(hostname);
    return address;
  } catch {
    return undefined;
  }
}

function extractHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Only HTTP and HTTPS URLs are supported" }, { status: 400 });
    }

    // SSRF: resolve and block private IPs
    const serverIp = await resolveIP(parsed.hostname);
    if (serverIp && isPrivateIP(serverIp)) {
      return NextResponse.json({ error: "Cannot check private/internal addresses" }, { status: 400 });
    }

    const chain: RedirectHop[] = [];
    let currentUrl = targetUrl;
    const maxRedirects = 10;
    const totalStart = performance.now();

    for (let i = 0; i <= maxRedirects; i++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const hopStart = performance.now();

      try {
        const res = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal: controller.signal,
          headers: {
            "User-Agent": "exit1.dev Redirect Checker/1.0",
            Accept: "*/*",
          },
        });
        clearTimeout(timeout);

        const hopTime = Math.round(performance.now() - hopStart);
        const location = res.headers.get("location");
        const allHeaders = extractHeaders(res.headers);

        chain.push({
          url: currentUrl,
          statusCode: res.status,
          statusText: res.statusText,
          location,
          responseTimeMs: hopTime,
          server: res.headers.get("server") || undefined,
          headers: allHeaders,
        });

        if (res.status >= 300 && res.status < 400 && location) {
          currentUrl = new URL(location, currentUrl).href;
          continue;
        }

        // Not a redirect — this is the final destination
        const totalTimeMs = Math.round(performance.now() - totalStart);
        const isRedirect = chain.length > 1 || (res.status >= 300 && res.status < 400);

        const result: RedirectCheckResult = {
          inputUrl: targetUrl,
          finalUrl: currentUrl,
          totalHops: chain.length - 1, // Don't count the final response as a "hop"
          totalTimeMs,
          isRedirect,
          finalStatusCode: res.status,
          finalStatusText: res.statusText,
          chain,
        };

        return NextResponse.json(result);
      } catch (err) {
        clearTimeout(timeout);
        const totalTimeMs = Math.round(performance.now() - totalStart);

        return NextResponse.json({
          inputUrl: targetUrl,
          finalUrl: currentUrl,
          totalHops: chain.length,
          totalTimeMs,
          isRedirect: chain.length > 0,
          finalStatusCode: 0,
          finalStatusText: "Error",
          chain,
          error: err instanceof Error
            ? err.name === "AbortError"
              ? "Request timed out after 10 seconds"
              : err.message
            : "Connection failed",
        } satisfies RedirectCheckResult);
      }
    }

    // Too many redirects
    const totalTimeMs = Math.round(performance.now() - totalStart);
    return NextResponse.json({
      inputUrl: targetUrl,
      finalUrl: currentUrl,
      totalHops: chain.length,
      totalTimeMs,
      isRedirect: true,
      finalStatusCode: 0,
      finalStatusText: "Too Many Redirects",
      chain,
      error: "Too many redirects (exceeded 10 hops)",
    } satisfies RedirectCheckResult);
  } catch (error) {
    return NextResponse.json(
      { error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify the API route works**

Run: `curl -X POST http://localhost:3000/api/redirect-check -H "Content-Type: application/json" -d '{"url":"http://google.com"}'`

Expected: JSON response showing the redirect chain (http://google.com -> https://www.google.com) with status codes 301 and 200.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/redirect-check/route.ts
git commit -m "feat: add /api/redirect-check API route for redirect chain analysis"
```

---

### Task 2: Client Component — `RedirectCheckerTool.tsx`

**Files:**
- Create: `src/app/tools/redirect-checker/RedirectCheckerTool.tsx`

- [ ] **Step 1: Create the client component**

This follows the exact same pattern as `SSLCheckerTool.tsx` — form input, loading steps animation, results display with collapsible sections, copy/download/share actions.

```tsx
"use client";

import { useState, useEffect, useCallback, FormEvent, useRef } from "react";
import {
  Globe,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  ChevronDown,
  Link2,
  ArrowRight,
  Clock,
  Server,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

interface RedirectHop {
  url: string;
  statusCode: number;
  statusText: string;
  location: string | null;
  responseTimeMs: number;
  server?: string;
  headers: Record<string, string>;
}

interface RedirectCheckResult {
  inputUrl: string;
  finalUrl: string;
  totalHops: number;
  totalTimeMs: number;
  isRedirect: boolean;
  finalStatusCode: number;
  finalStatusText: string;
  chain: RedirectHop[];
  error?: string;
}

const LOADING_STEPS = [
  "Resolving hostname...",
  "Sending request...",
  "Following redirects...",
  "Analyzing chain...",
  "Building report...",
];

function SectionCard({
  title,
  children,
  actions,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 pb-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {open && actions}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function statusCodeColor(code: number): string {
  if (code >= 200 && code < 300) return "text-emerald-400";
  if (code >= 300 && code < 400) return "text-blue-400";
  if (code >= 400 && code < 500) return "text-yellow-400";
  if (code >= 500) return "text-red-400";
  return "text-muted-foreground";
}

function statusCodeBg(code: number): string {
  if (code >= 200 && code < 300) return "bg-emerald-500/10 border-emerald-500/20";
  if (code >= 300 && code < 400) return "bg-blue-500/10 border-blue-500/20";
  if (code >= 400 && code < 500) return "bg-yellow-500/10 border-yellow-500/20";
  if (code >= 500) return "bg-red-500/10 border-red-500/20";
  return "bg-white/5 border-white/10";
}

function redirectTypeLabel(code: number): string {
  switch (code) {
    case 301: return "Permanent Redirect";
    case 302: return "Temporary Redirect (Found)";
    case 303: return "See Other";
    case 307: return "Temporary Redirect";
    case 308: return "Permanent Redirect";
    default: return `HTTP ${code}`;
  }
}

export default function RedirectCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<RedirectCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const hasAutoChecked = useRef(false);

  const runCheck = useCallback(async (domain: string) => {
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const res = await fetch("/api/redirect-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: domain.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Check failed");
        return;
      }

      if (data.error && data.chain?.length === 0) {
        setError(data.error);
        return;
      }

      setResult(data);

      const newUrl = `/tools/redirect-checker?url=${encodeURIComponent(domain.trim())}`;
      router.replace(newUrl, { scroll: false });
    } catch {
      setError("Failed to check redirects. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }, [router]);

  // Auto-check from URL param
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !hasAutoChecked.current) {
      hasAutoChecked.current = true;
      setUrl(urlParam);
      runCheck(urlParam);
    }
  }, [searchParams, runCheck]);

  function buildResultText(r: RedirectCheckResult) {
    const lines = [
      `Redirect Check Report`,
      `======================`,
      ``,
      `Input URL:           ${r.inputUrl}`,
      `Final URL:           ${r.finalUrl}`,
      `Total Hops:          ${r.totalHops}`,
      `Total Time:          ${r.totalTimeMs}ms`,
      `Final Status:        ${r.finalStatusCode} ${r.finalStatusText}`,
      `Is Redirect:         ${r.isRedirect ? "Yes" : "No"}`,
      ``,
      `--- Redirect Chain ---`,
    ];
    r.chain.forEach((hop, i) => {
      lines.push(`  ${i + 1}. ${hop.url}`);
      lines.push(`     Status: ${hop.statusCode} ${hop.statusText} (${hop.responseTimeMs}ms)`);
      if (hop.location) {
        lines.push(`     Location: ${hop.location}`);
      }
      if (hop.server) {
        lines.push(`     Server: ${hop.server}`);
      }
    });
    if (r.error) {
      lines.push(``, `Error: ${r.error}`);
    }
    lines.push(``, `Checked:             ${new Date().toISOString()}`);
    lines.push(`Source:              https://exit1.dev/tools/redirect-checker`);
    return lines.join("\n");
  }

  function fallbackCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* noop */ }
    document.body.removeChild(ta);
  }

  async function copyResults() {
    if (!result) return;
    const text = buildResultText(result);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyShareLink() {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/redirect-checker?url=${encodeURIComponent(result.inputUrl)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      fallbackCopy(shareUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function downloadResults() {
    if (!result) return;
    const text = buildResultText(result);
    const blob = new Blob([text], { type: "text/plain" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `redirect-report-${new URL(result.inputUrl).hostname}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runCheck(url);
  }

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && url.trim()) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="example.com or https://old.example.com/page"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl px-6 py-3 h-auto bg-white text-black hover:bg-white/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Check Redirects
            </span>
          )}
        </Button>
      </form>

      {/* Loading Progress */}
      {loading && (
        <div className="mt-6 p-4 bg-white/[0.02] border border-white/10 rounded-xl">
          <div className="space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-300",
                  i < loadingStep
                    ? "text-emerald-400"
                    : i === loadingStep
                      ? "text-white"
                      : "text-muted-foreground/40"
                )}
              >
                {i < loadingStep ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : i === loadingStep ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 shrink-0" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-400">Check Failed</div>
            <div className="text-sm text-red-400/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Summary Banner */}
          <div
            className={cn(
              "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
              result.error
                ? "bg-red-500/10 border-red-500/20"
                : result.isRedirect
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-emerald-500/10 border-emerald-500/20"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 border",
                result.error
                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                  : result.isRedirect
                    ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                    : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              )}
            >
              {result.error ? (
                <XCircle className="w-7 h-7" />
              ) : result.isRedirect ? (
                <ArrowRight className="w-7 h-7" />
              ) : (
                <CheckCircle className="w-7 h-7" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-semibold",
                    result.error
                      ? "text-red-400"
                      : result.isRedirect
                        ? "text-blue-400"
                        : "text-emerald-400"
                  )}
                >
                  {result.error
                    ? "Redirect Check Failed"
                    : result.isRedirect
                      ? `${result.totalHops} Redirect${result.totalHops !== 1 ? "s" : ""} Detected`
                      : "No Redirects"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {result.inputUrl}
                {result.isRedirect && !result.error && (
                  <>
                    {" "}&#8594; {result.finalUrl}
                  </>
                )}
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {result.totalTimeMs}ms total
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-muted-foreground">
                  <ArrowRight className="w-3 h-3" />
                  {result.totalHops} hop{result.totalHops !== 1 ? "s" : ""}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                  statusCodeBg(result.finalStatusCode)
                )}>
                  {result.finalStatusCode} {result.finalStatusText}
                </span>
              </div>
            </div>
          </div>

          {/* Redirect Chain */}
          <SectionCard
            title={`Redirect Chain (${result.chain.length} step${result.chain.length !== 1 ? "s" : ""})`}
            actions={
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Copy share link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      Share
                    </>
                  )}
                </button>
                <button
                  onClick={copyResults}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Copy results"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={downloadResults}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  aria-label="Download report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="space-y-0">
              {result.chain.map((hop, i) => {
                const isLast = i === result.chain.length - 1;
                const isRedirectHop = hop.statusCode >= 300 && hop.statusCode < 400;

                return (
                  <div key={i} className="relative">
                    {i > 0 && (
                      <div className="flex items-center justify-center py-1">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isLast && !isRedirectHop
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : isRedirectHop
                            ? "bg-blue-500/5 border-blue-500/20"
                            : "bg-white/[0.02] border-white/10"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                            isLast && !isRedirectHop
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                              : isRedirectHop
                                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                : "bg-white/10 border-white/20 text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("text-xs font-bold px-2 py-0.5 rounded border", statusCodeBg(hop.statusCode), statusCodeColor(hop.statusCode))}>
                              {hop.statusCode}
                            </span>
                            {isRedirectHop && (
                              <span className="text-xs text-blue-400">
                                {redirectTypeLabel(hop.statusCode)}
                              </span>
                            )}
                            {isLast && !isRedirectHop && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Final Destination
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {hop.responseTimeMs}ms
                            </span>
                          </div>
                          <div className="mt-1.5 text-sm font-medium text-white break-all flex items-start gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                            {hop.url}
                          </div>
                          {hop.location && (
                            <div className="mt-1 text-xs text-muted-foreground break-all">
                              <span className="text-blue-400">Location:</span> {hop.location}
                            </div>
                          )}
                          {hop.server && (
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              <Server className="w-3 h-3 inline mr-1" />
                              {hop.server}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Response Headers (collapsed by default) */}
          {result.chain.length > 0 && (
            <SectionCard title="Response Headers" defaultOpen={false}>
              <div className="space-y-4">
                {result.chain.map((hop, i) => (
                  <div key={i}>
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Step {i + 1}: {hop.statusCode} — {new URL(hop.url).hostname}
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 font-mono text-xs space-y-0.5 max-h-48 overflow-y-auto">
                      {Object.entries(hop.headers).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-blue-400 shrink-0">{key}:</span>
                          <span className="text-white/70 break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Error details */}
          {result.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-400">Error</div>
                <div className="text-sm text-red-400/80 mt-1">{result.error}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/tools/redirect-checker/RedirectCheckerTool.tsx
git commit -m "feat: add RedirectCheckerTool client component"
```

---

### Task 3: Landing Page — `page.tsx`

**Files:**
- Create: `src/app/tools/redirect-checker/page.tsx`

- [ ] **Step 1: Create the landing page**

Follows the exact same structure as `src/app/tools/ssl-checker/page.tsx`: metadata, structured data, breadcrumbs, hero, ToolsNav, Suspense-wrapped tool, "What You Get" example, "How It Works", FAQ, related articles, CTA.

```tsx
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import RedirectCheckerTool from "./RedirectCheckerTool";
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
  title: "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
  description:
    "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
  keywords:
    "redirect checker, http redirect checker, redirect chain, 301 redirect checker, 302 redirect, redirect trace, url redirect tester, redirect validator, free redirect tool",
  openGraph: {
    title: "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
    description:
      "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
    type: "website",
    url: "https://exit1.dev/tools/redirect-checker",
  },
  twitter: {
    title: "Free Redirect Checker Tool — Trace HTTP Redirect Chains | exit1.dev",
    description:
      "Free redirect checker tool. Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time. No signup required.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://exit1.dev/tools/redirect-checker",
  },
};

const faq = [
  {
    question: "What does this redirect checker do?",
    answer:
      "This tool sends an HTTP request to any URL and follows the entire redirect chain. It shows every hop — including the HTTP status code (301, 302, 307, 308, etc.), the Location header, response time, and server headers — until it reaches the final destination.",
  },
  {
    question: "Is this redirect checker free?",
    answer:
      "Yes, completely free with no signup required. Just enter a URL and check instantly. There are no daily limits.",
  },
  {
    question: "What is an HTTP redirect?",
    answer:
      "An HTTP redirect is when a server responds with a 3xx status code (like 301 or 302) and a Location header that tells the browser to go to a different URL. Common uses include HTTP-to-HTTPS upgrades, domain migrations, URL shorteners, and vanity URLs.",
  },
  {
    question: "What is the difference between 301 and 302 redirects?",
    answer:
      "A 301 redirect means the URL has permanently moved to a new location — search engines transfer SEO value to the new URL. A 302 redirect means the move is temporary — search engines keep indexing the original URL. Use 301 for permanent changes (domain migrations, URL restructuring) and 302 for temporary ones (A/B tests, maintenance pages).",
  },
  {
    question: "Why do too many redirects cause problems?",
    answer:
      "Each redirect adds a round-trip to the server, increasing page load time. Redirect chains (A → B → C → D) slow down the user experience and can confuse search engine crawlers. Most browsers limit redirect chains to around 20 hops before showing an error. Ideally, you should have at most one redirect between any two URLs.",
  },
  {
    question: "How do redirects affect SEO?",
    answer:
      "Properly configured 301 redirects pass most SEO value (link equity) to the destination URL. However, long redirect chains dilute this value with each hop. Redirect loops and broken chains can cause search engines to drop pages from their index entirely. Regular redirect monitoring helps maintain your SEO rankings.",
  },
  {
    question: "Does this tool follow JavaScript or meta refresh redirects?",
    answer:
      "No, this tool checks HTTP-level redirects only (3xx status codes with Location headers). It does not execute JavaScript or detect <meta http-equiv=\"refresh\"> tags. For those, you would need a browser-based testing tool.",
  },
  {
    question: "Can I monitor my redirects automatically?",
    answer:
      "Yes! exit1.dev offers automated redirect monitoring. Set up a redirect check that verifies your URLs redirect to the correct destination on a schedule — and get alerted instantly if a redirect breaks or changes. It's included free with all plans.",
  },
];

export default function RedirectCheckerPage() {
  return (
    <>
      <StructuredData
        type="WebPage"
        data={{
          name: "Free Redirect Checker Tool",
          description:
            "Free redirect checker tool to trace the full HTTP redirect chain for any URL. See every hop, status code, and response time.",
          url: "https://exit1.dev/tools/redirect-checker",
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
                { name: "Redirect Checker", href: "/tools/redirect-checker" },
              ]}
            />
          </div>
          <PageHero size="lg">
            <div className="text-center">
              <p className="text-sm font-mono text-primary mb-4 tracking-wide uppercase">
                Free Tool
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Redirect Checker
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Trace the full HTTP redirect chain for any URL. See every hop,
                status code, Location header, and response time. Free, no signup required.
              </p>
            </div>
          </PageHero>

          {/* Tools Navigation */}
          <PageSection>
            <SectionContent size="md" className="py-6">
              <ToolsNav current="/tools/redirect-checker" />
            </SectionContent>
          </PageSection>

          {/* Tool Section */}
          <PageSection>
            <SectionContent size="md" className="py-12 sm:py-16">
              <Suspense fallback={null}>
                <RedirectCheckerTool />
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
                Here&apos;s an example of a redirect chain this tool reveals.
                Try it above with any URL.
              </p>
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8" aria-label="Example redirect check result">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-400">2 Redirects Detected</p>
                    <p className="text-xs text-muted-foreground">http://example.com &#8594; https://www.example.com — 245ms total</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">1</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400">301</span>
                        <span className="text-xs text-blue-400">Permanent Redirect</span>
                        <span className="text-xs text-muted-foreground ml-auto">85ms</span>
                      </div>
                      <p className="text-sm text-white mt-1">http://example.com</p>
                      <p className="text-xs text-muted-foreground"><span className="text-blue-400">Location:</span> https://example.com/</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40 rotate-90"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">2</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400">301</span>
                        <span className="text-xs text-blue-400">Permanent Redirect</span>
                        <span className="text-xs text-muted-foreground ml-auto">92ms</span>
                      </div>
                      <p className="text-sm text-white mt-1">https://example.com/</p>
                      <p className="text-xs text-muted-foreground"><span className="text-blue-400">Location:</span> https://www.example.com/</p>
                    </div>
                  </div>
                  <div className="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40 rotate-90"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">3</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">200</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Final Destination</span>
                        <span className="text-xs text-muted-foreground ml-auto">68ms</span>
                      </div>
                      <p className="text-sm text-white mt-1">https://www.example.com/</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                <p>
                  The redirect checker traces every hop in the chain, showing the
                  exact HTTP status code, Location header, and response time for each
                  step. This helps you identify unnecessary redirect chains, confirm
                  that 301 vs 302 codes are set correctly, and spot redirect loops
                  before they affect your users or SEO rankings.
                </p>
                <p>
                  You can also inspect the full response headers at each hop to
                  debug server configuration, check caching headers on redirects,
                  and verify that security headers are present throughout the chain.
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
                  <h3 className="font-semibold text-lg mb-2">Enter a URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Type any URL — a domain, a full URL, or even an HTTP link you
                    expect to redirect to HTTPS.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    We Follow the Chain
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our server sends the request and follows every redirect hop,
                    recording status codes, headers, and timing.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    See Every Hop
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View the complete redirect chain with status codes, Location
                    headers, response times, and server details.
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

          {/* CTA to full monitoring */}
          <PageSection>
            <SectionContent size="md" className="py-16 sm:py-20">
              <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Need Continuous Redirect Monitoring?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Stop checking manually. exit1.dev monitors your redirects
                  automatically and alerts you when a redirect breaks, changes
                  destination, or stops working. 10 free monitors. Unlimited with Nano.
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/tools/redirect-checker/page.tsx
git commit -m "feat: add redirect checker landing page with SEO metadata and FAQ"
```

---

### Task 4: Update ToolsNav

**Files:**
- Modify: `src/components/ToolsNav.tsx:2,5-26`

- [ ] **Step 1: Add the Redirect Checker to ToolsNav**

In `src/components/ToolsNav.tsx`, add `ArrowRight` to the lucide import and add the new tool entry to the `tools` array.

Change the import line from:
```tsx
import { Shield, Globe, Activity, Wifi } from "lucide-react";
```
to:
```tsx
import { Shield, Globe, Activity, Wifi, ArrowRight } from "lucide-react";
```

Add this entry to the end of the `tools` array (after the Ping Test entry):
```tsx
  {
    name: "Redirect Checker",
    href: "/tools/redirect-checker",
    icon: ArrowRight,
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ToolsNav.tsx
git commit -m "feat: add redirect checker to ToolsNav"
```

---

### Task 5: Update Tools Landing Page

**Files:**
- Modify: `src/app/tools/page.tsx:3,37-90`

- [ ] **Step 1: Add the Redirect Checker card to the tools landing page**

In `src/app/tools/page.tsx`, update the metadata to mention "redirect checker" and add the tool card.

Add `ArrowRight` to the existing lucide import (it's already imported — verify, and if not, add it). The current import already has `ArrowRight`:
```tsx
import { Shield, Globe, Activity, Wifi, ArrowRight } from "lucide-react";
```

Add this entry to the end of the `tools` array (after the Ping Test entry):
```tsx
  {
    name: "Redirect Checker",
    description:
      "Trace the full HTTP redirect chain for any URL. See every hop, status code, Location header, and response time — find broken or unnecessary redirects.",
    href: "/tools/redirect-checker",
    icon: ArrowRight,
    features: [
      "Full redirect chain visualization",
      "Status codes for every hop",
      "Response time per redirect",
      "Response headers inspection",
    ],
  },
```

Update the metadata title and description to mention redirect checker. Change:
```
"Free Website & Server Tools — SSL, Domain, API & Ping Checkers | exit1.dev"
```
to:
```
"Free Website & Server Tools — SSL, Domain, API, Ping & Redirect Checkers | exit1.dev"
```

Do the same for the description, openGraph, and twitter fields — append "redirect chains" where relevant. For example, the description becomes:
```
"Free online tools for developers and sysadmins. Check SSL certificates, domain expiration, API endpoint status, server latency, and redirect chains. No signup required."
```

- [ ] **Step 2: Commit**

```bash
git add src/app/tools/page.tsx
git commit -m "feat: add redirect checker to tools landing page"
```

---

### Task 6: Smoke Test

- [ ] **Step 1: Start the dev server and verify all pages**

Run: `npm run dev`

1. Visit `http://localhost:3000/tools` — verify the Redirect Checker card appears in the grid (5 tools now)
2. Visit `http://localhost:3000/tools/redirect-checker` — verify the landing page renders with hero, ToolsNav (with Redirect Checker highlighted), FAQ, example result, CTA
3. Enter `http://google.com` in the tool and click "Check Redirects" — verify the redirect chain renders (should show 301 from http://google.com to https://www.google.com)
4. Verify the share URL works: copy the URL from the browser bar after a check, open it in a new tab — it should auto-run the check
5. Click through the ToolsNav on any existing tool page — verify "Redirect Checker" link appears and works

- [ ] **Step 2: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address redirect checker smoke test issues"
```
