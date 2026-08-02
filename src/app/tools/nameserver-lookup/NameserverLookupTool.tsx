"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Server,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Network,
  Mail,
  Clock,
  Hash,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToolResultCTA } from "@/components/tools/ToolResultCTA";

// ── Types ────────────────────────────────────────────────────────────

interface NameserverEntry {
  host: string;
  ipv4: string[];
  ipv6: string[];
  resolves: boolean;
  provider: string | null;
  anycast: boolean;
}

interface NameserverLookupResult {
  domain: string;
  responseTimeMs: number;
  nameservers: NameserverEntry[];
  soa: {
    nsname: string;
    hostmaster: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
  } | null;
  soaMatchesNs: boolean;
  providers: string[];
  parentDomains: string[];
  distinctNetworks: number;
  grade: string;
  goodPoints: string[];
  issues: string[];
}

// ── Constants ────────────────────────────────────────────────────────

const EXAMPLE_DOMAINS = ["github.com", "cloudflare.com", "wikipedia.org", "shopify.com"];

const LOADING_STEPS = [
  "Resolving domain...",
  "Querying NS records...",
  "Resolving nameserver addresses...",
  "Reading SOA record...",
  "Identifying DNS provider...",
  "Grading delegation health...",
];

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Anycast providers serve every nameserver from one announced prefix, so a
 * single /16 is by design there — not a shared failure domain. Mirrors the
 * grading rule in /api/nameserver-lookup.
 */
function hasNetworkRedundancy(r: NameserverLookupResult): boolean {
  if (r.distinctNetworks >= 2) return true;
  return r.nameservers.length > 0 && r.nameservers.every((ns) => ns.anycast);
}

function formatTtl(seconds: number): string {
  if (seconds >= 86400) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    return h > 0 ? `${d}d ${h}h` : `${d}d`;
  }
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m`;
  return `${seconds}s`;
}

function formatSoaEmail(hostmaster: string): string {
  const i = hostmaster.indexOf(".");
  if (i === -1) return hostmaster;
  return hostmaster.substring(0, i) + "@" + hostmaster.substring(i + 1);
}

// ── Sub-components ───────────────────────────────────────────────────

function ResultRow({
  icon: Icon,
  label,
  value,
  className,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-foreground/5 last:border-0">
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", className)} />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={cn("text-sm font-medium break-all", mono && "font-mono")}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  actions,
  defaultOpen = true,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-foreground/[0.02] border border-foreground/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 pb-4 cursor-pointer hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          {badge}
        </div>
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

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
        ok
          ? "bg-success/10 border-success/20 text-success"
          : "bg-destructive/10 border-destructive/20 text-destructive"
      )}
    >
      {ok ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function GradeBadge({ result }: { result: NameserverLookupResult }) {
  const config: Record<string, { bg: string; iconBg: string; textClass: string }> = {
    "A+": {
      bg: "bg-success/10 border-success/20",
      iconBg: "bg-success/20 border-success/30",
      textClass: "text-success",
    },
    A: {
      bg: "bg-success/10 border-success/20",
      iconBg: "bg-success/20 border-success/30",
      textClass: "text-success",
    },
    B: {
      bg: "bg-primary/10 border-primary/20",
      iconBg: "bg-primary/20 border-primary/30",
      textClass: "text-primary",
    },
    C: {
      bg: "bg-warning/10 border-warning/20",
      iconBg: "bg-warning/20 border-warning/30",
      textClass: "text-warning",
    },
    D: {
      bg: "bg-warning/10 border-warning/20",
      iconBg: "bg-warning/20 border-warning/30",
      textClass: "text-warning",
    },
    F: {
      bg: "bg-destructive/10 border-destructive/20",
      iconBg: "bg-destructive/20 border-destructive/30",
      textClass: "text-destructive",
    },
  };

  const c = config[result.grade] || config.F;
  const nsCount = result.nameservers.length;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4",
        c.bg
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border text-2xl font-bold",
          c.iconBg,
          c.textClass
        )}
      >
        {result.grade}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-lg", c.textClass)}>
            Nameserver Health: {result.grade}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {result.domain} — {nsCount} nameserver{nsCount === 1 ? "" : "s"} found in{" "}
          {result.responseTimeMs}ms
          {result.providers.length > 0 && <> · {result.providers.join(", ")}</>}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <StatusPill ok={nsCount >= 2} label="Redundant" />
          <StatusPill
            ok={result.nameservers.every((ns) => ns.resolves)}
            label="Glue resolves"
          />
          <StatusPill
            ok={result.nameservers.some((ns) => ns.ipv6.length > 0)}
            label="IPv6"
          />
          <StatusPill ok={hasNetworkRedundancy(result)} label="Multi-network" />
          <StatusPill ok={!!result.soa && result.soaMatchesNs} label="SOA match" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function NameserverLookupTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<NameserverLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const lookupNameservers = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      setLoading(true);
      setResult(null);
      setError(null);
      setHasChecked(true);
      setLoadingStep(0);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
        );
      }, 500);

      try {
        const res = await fetch("/api/nameserver-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: input.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Lookup failed");
          return;
        }

        setResult(data);

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("domain", input.trim());
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });
      } catch {
        setError("Failed to perform nameserver lookup. Please try again.");
      } finally {
        clearInterval(stepInterval);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const domainParam = searchParams.get("domain");
    if (domainParam && !hasChecked) {
      setDomain(domainParam);
      lookupNameservers(domainParam);
    }
  }, [searchParams, lookupNameservers, hasChecked]);

  function buildResultText(r: NameserverLookupResult) {
    const lines = [
      `Nameserver Lookup Report`,
      `========================`,
      ``,
      `Domain:              ${r.domain}`,
      `Health Grade:        ${r.grade}`,
      `Nameservers:         ${r.nameservers.length}`,
      `DNS Provider:        ${r.providers.length > 0 ? r.providers.join(", ") : "Unknown"}`,
      `Response Time:       ${r.responseTimeMs}ms`,
      ``,
      `NS Records:`,
    ];

    r.nameservers.forEach((ns) => {
      lines.push(`  ${ns.host}${ns.provider ? ` (${ns.provider})` : ""}`);
      if (ns.ipv4.length > 0) lines.push(`    IPv4: ${ns.ipv4.join(", ")}`);
      if (ns.ipv6.length > 0) lines.push(`    IPv6: ${ns.ipv6.join(", ")}`);
      if (!ns.resolves) lines.push(`    WARNING: hostname does not resolve`);
    });
    lines.push(``);

    if (r.soa) {
      lines.push(`SOA Record:`);
      lines.push(`  Primary NS:  ${r.soa.nsname}`);
      lines.push(`  Admin:       ${formatSoaEmail(r.soa.hostmaster)}`);
      lines.push(`  Serial:      ${r.soa.serial}`);
      lines.push(`  Refresh:     ${formatTtl(r.soa.refresh)}`);
      lines.push(`  Retry:       ${formatTtl(r.soa.retry)}`);
      lines.push(`  Expire:      ${formatTtl(r.soa.expire)}`);
      lines.push(`  Min TTL:     ${formatTtl(r.soa.minttl)}`);
      lines.push(
        `  Matches NS:  ${r.soaMatchesNs ? "Yes" : "No — primary is not in the NS set"}`
      );
      lines.push(``);
    }

    lines.push(`Delegation:`);
    lines.push(`  NS domains:       ${r.parentDomains.join(", ")}`);
    lines.push(`  IPv4 networks:    ${r.distinctNetworks}`);
    lines.push(``);

    if (r.goodPoints.length > 0) {
      lines.push(`Passing:`);
      r.goodPoints.forEach((p) => lines.push(`  + ${p}`));
      lines.push(``);
    }

    if (r.issues.length > 0) {
      lines.push(`Issues:`);
      r.issues.forEach((p) => lines.push(`  - ${p}`));
      lines.push(``);
    }

    lines.push(`Checked:             ${new Date().toISOString()}`);
    lines.push(`Source:              https://exit1.dev/tools/nameserver-lookup`);

    return lines.join("\n");
  }

  function fallbackCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* noop */
    }
    document.body.removeChild(ta);
  }

  async function copyResults() {
    if (!result) return;
    const text = buildResultText(result);
    try {
      if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
    } catch {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyShareLink() {
    if (!result) return;
    const shareUrl = `${window.location.origin}/tools/nameserver-lookup?domain=${encodeURIComponent(result.domain)}`;
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
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `nameservers-${result.domain}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    lookupNameservers(domain);
  }

  function handleExampleClick(d: string) {
    setDomain(d);
    lookupNameservers(d);
  }

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && domain.trim()) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="example.com"
            className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !domain.trim()}
          className="rounded-xl px-6 py-3 h-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Check Nameservers
            </span>
          )}
        </Button>
      </form>

      {/* Example Domains */}
      {!result && !error && !loading && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_DOMAINS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleExampleClick(d)}
              className="text-xs font-mono px-2.5 py-1 rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Loading Progress */}
      {loading && (
        <div className="mt-6 p-4 bg-foreground/[0.02] border border-foreground/10 rounded-xl">
          <div className="space-y-2">
            {LOADING_STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-300",
                  i < loadingStep
                    ? "text-success"
                    : i === loadingStep
                      ? "text-foreground"
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
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-destructive">Lookup Failed</div>
            <div className="text-sm text-destructive/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <GradeBadge result={result} />

          {/* Conversion CTA — result-aware */}
          {(() => {
            const issues = result.issues?.length ?? 0;
            if (issues > 0) {
              return (
                <ToolResultCTA
                  campaign="nameserver_lookup"
                  target={result.domain}
                  tone="alert"
                  headline={`${issues} nameserver issue${issues > 1 ? "s" : ""} found on ${result.domain}`}
                  subline="A broken delegation takes the whole domain offline — email included. exit1 watches your domain around the clock and alerts you the moment it stops resolving."
                />
              );
            }
            return (
              <ToolResultCTA
                campaign="nameserver_lookup"
                target={result.domain}
                tone="positive"
                headline={`${result.domain}'s nameservers look healthy`}
                subline="Nameservers change during migrations and hijacks. exit1 monitors uptime, SSL and domain expiry 24/7 — free."
              />
            );
          })()}

          {/* Nameservers */}
          <SectionCard
            title={`Nameservers (${result.nameservers.length})`}
            actions={
              <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy share link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
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
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy nameserver results"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-success">Copied</span>
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
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Download nameserver report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="space-y-3">
              {result.nameservers.map((ns) => (
                <div
                  key={ns.host}
                  className="p-3 rounded-lg bg-background/40 border border-foreground/5"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <Server
                        className={cn(
                          "w-4 h-4 shrink-0",
                          ns.resolves ? "text-primary" : "text-destructive"
                        )}
                      />
                      <span className="text-sm font-mono break-all">{ns.host}</span>
                    </div>
                    {ns.provider && (
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                        <Building2 className="w-3 h-3" />
                        {ns.provider}
                      </span>
                    )}
                  </div>
                  {ns.resolves ? (
                    <div className="mt-2 ml-6 flex flex-wrap gap-1.5">
                      {ns.ipv4.map((ip) => (
                        <span
                          key={ip}
                          className="text-xs font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/80"
                        >
                          {ip}
                        </span>
                      ))}
                      {ns.ipv6.map((ip) => (
                        <span
                          key={ip}
                          className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary"
                        >
                          {ip}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 ml-6 text-xs text-destructive">
                      Hostname does not resolve to an IP address
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Delegation summary */}
          <SectionCard title="Delegation">
            <div className="divide-y divide-foreground/5">
              <ResultRow
                icon={Building2}
                label="DNS Provider"
                value={
                  result.providers.length > 0
                    ? result.providers.join(", ")
                    : "Not recognised — likely self-hosted or a niche provider"
                }
                className="text-primary"
              />
              <ResultRow
                icon={Network}
                label="Nameserver Domains"
                value={result.parentDomains.join(", ")}
                className="text-muted-foreground"
                mono
              />
              <ResultRow
                icon={Network}
                label="Distinct IPv4 Networks"
                value={
                  result.distinctNetworks >= 2
                    ? `${result.distinctNetworks} — good separation`
                    : hasNetworkRedundancy(result)
                      ? `${result.distinctNetworks} prefix — anycast, announced from many locations`
                      : `${result.distinctNetworks} — all nameservers share one network`
                }
                className={
                  hasNetworkRedundancy(result) ? "text-success" : "text-warning"
                }
              />
            </div>
          </SectionCard>

          {/* SOA Record */}
          {result.soa && (
            <SectionCard
              title="SOA Record"
              defaultOpen={false}
              badge={
                <StatusPill
                  ok={result.soaMatchesNs}
                  label={result.soaMatchesNs ? "Consistent" : "Mismatch"}
                />
              }
            >
              <div className="divide-y divide-foreground/5">
                <ResultRow
                  icon={Server}
                  label="Primary Nameserver"
                  value={result.soa.nsname}
                  className={result.soaMatchesNs ? "text-primary" : "text-warning"}
                  mono
                />
                <ResultRow
                  icon={Mail}
                  label="Admin Email"
                  value={formatSoaEmail(result.soa.hostmaster)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Hash}
                  label="Serial"
                  value={result.soa.serial.toString()}
                  className="text-muted-foreground"
                  mono
                />
                <ResultRow
                  icon={Clock}
                  label="Refresh"
                  value={formatTtl(result.soa.refresh)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Retry"
                  value={formatTtl(result.soa.retry)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Expire"
                  value={formatTtl(result.soa.expire)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Minimum TTL"
                  value={formatTtl(result.soa.minttl)}
                  className="text-muted-foreground"
                />
              </div>
            </SectionCard>
          )}

          {/* Grade Details */}
          <SectionCard title="Grade Details" defaultOpen={false}>
            <div className="space-y-2">
              {result.goodPoints.map((point, i) => (
                <div key={`good-${i}`} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="text-success">{point}</span>
                </div>
              ))}
              {result.issues.map((issue, i) => (
                <div key={`issue-${i}`} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-destructive">{issue}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
