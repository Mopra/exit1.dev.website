"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Network,
  Loader2,
  Search,
  Copy,
  Check,
  Download,
  ChevronDown,
  Link2,
  CheckCircle,
  XCircle,
  Server,
  Mail,
  Shield,
  ShieldAlert,
  Globe,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

interface DnsCheckResult {
  domain: string;
  responseTimeMs: number;
  records: {
    a: { address: string; ttl: number }[];
    aaaa: { address: string; ttl: number }[];
    cname: string[];
    mx: { priority: number; exchange: string }[];
    ns: string[];
    txt: string[];
    soa: {
      nsname: string;
      hostmaster: string;
      serial: number;
      refresh: number;
      retry: number;
      expire: number;
      minttl: number;
    } | null;
    caa: { critical: number; tag: string; value: string }[];
  };
  totalRecords: number;
  emailSecurity: {
    spf: { found: boolean; record?: string };
    dmarc: { found: boolean; record?: string };
    hasMx: boolean;
  };
  grade: string;
  goodPoints: string[];
  issues: string[];
}

// ── Constants ────────────────────────────────────────────────────────

const EXAMPLE_DOMAINS = ["google.com", "github.com", "cloudflare.com"];

const LOADING_STEPS = [
  "Resolving hostname...",
  "Querying A & AAAA records...",
  "Looking up nameservers...",
  "Checking mail records...",
  "Analyzing email security...",
  "Grading DNS health...",
];

// ── Helpers ──────────────────────────────────────────────────────────

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
        <div
          className={cn(
            "text-sm font-medium break-all",
            mono && "font-mono"
          )}
        >
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
      {ok ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {label}
    </span>
  );
}

function GradeBadge({ result }: { result: DnsCheckResult }) {
  const config: Record<
    string,
    { bg: string; iconBg: string; textClass: string }
  > = {
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
            DNS Health: {result.grade}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {result.domain} — {result.totalRecords} records found in{" "}
          {result.responseTimeMs}ms
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <StatusPill ok={result.records.a.length > 0} label="IPv4" />
          <StatusPill ok={result.records.aaaa.length > 0} label="IPv6" />
          <StatusPill ok={result.emailSecurity.spf.found} label="SPF" />
          <StatusPill ok={result.emailSecurity.dmarc.found} label="DMARC" />
          {result.records.caa.length > 0 && (
            <StatusPill ok label="CAA" />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function DnsCheckerTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DnsCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const checkDns = useCallback(
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
      }, 600);

      try {
        const res = await fetch("/api/dns-check", {
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
        setError("Failed to perform DNS lookup. Please try again.");
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
      checkDns(domainParam);
    }
  }, [searchParams, checkDns, hasChecked]);

  function buildResultText(r: DnsCheckResult) {
    const lines = [
      `DNS Lookup Report`,
      `========================`,
      ``,
      `Domain:              ${r.domain}`,
      `DNS Health Grade:    ${r.grade}`,
      `Total Records:       ${r.totalRecords}`,
      `Response Time:       ${r.responseTimeMs}ms`,
      ``,
    ];

    if (r.records.a.length > 0) {
      lines.push(`A Records (IPv4):`);
      r.records.a.forEach((rec) =>
        lines.push(`  ${rec.address} (TTL: ${formatTtl(rec.ttl)})`)
      );
      lines.push(``);
    }

    if (r.records.aaaa.length > 0) {
      lines.push(`AAAA Records (IPv6):`);
      r.records.aaaa.forEach((rec) =>
        lines.push(`  ${rec.address} (TTL: ${formatTtl(rec.ttl)})`)
      );
      lines.push(``);
    }

    if (r.records.cname.length > 0) {
      lines.push(`CNAME Records:`);
      r.records.cname.forEach((rec) => lines.push(`  ${rec}`));
      lines.push(``);
    }

    if (r.records.ns.length > 0) {
      lines.push(`Nameservers:`);
      r.records.ns.forEach((ns) => lines.push(`  ${ns}`));
      lines.push(``);
    }

    if (r.records.mx.length > 0) {
      lines.push(`MX Records:`);
      r.records.mx.forEach((mx) =>
        lines.push(`  ${mx.priority} ${mx.exchange}`)
      );
      lines.push(``);
    }

    if (r.records.soa) {
      lines.push(`SOA Record:`);
      lines.push(`  Primary NS:  ${r.records.soa.nsname}`);
      lines.push(
        `  Admin:       ${formatSoaEmail(r.records.soa.hostmaster)}`
      );
      lines.push(`  Serial:      ${r.records.soa.serial}`);
      lines.push(`  Refresh:     ${formatTtl(r.records.soa.refresh)}`);
      lines.push(`  Retry:       ${formatTtl(r.records.soa.retry)}`);
      lines.push(`  Expire:      ${formatTtl(r.records.soa.expire)}`);
      lines.push(`  Min TTL:     ${formatTtl(r.records.soa.minttl)}`);
      lines.push(``);
    }

    if (r.records.txt.length > 0) {
      lines.push(`TXT Records (${r.records.txt.length}):`);
      r.records.txt.forEach((txt) => lines.push(`  ${txt}`));
      lines.push(``);
    }

    if (r.records.caa.length > 0) {
      lines.push(`CAA Records:`);
      r.records.caa.forEach((caa) =>
        lines.push(
          `  ${caa.tag}: ${caa.value}${caa.critical ? " (critical)" : ""}`
        )
      );
      lines.push(``);
    }

    lines.push(`Email Security:`);
    lines.push(
      `  SPF:   ${r.emailSecurity.spf.found ? "Found" : "Not found"}`
    );
    lines.push(
      `  DMARC: ${r.emailSecurity.dmarc.found ? "Found" : "Not found"}`
    );
    lines.push(``);
    lines.push(`Checked:             ${new Date().toISOString()}`);
    lines.push(`Source:              https://exit1.dev/tools/dns-checker`);

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
    const shareUrl = `${window.location.origin}/tools/dns-checker?domain=${encodeURIComponent(result.domain)}`;
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
    a.download = `dns-report-${result.domain}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    checkDns(domain);
  }

  function handleExampleClick(d: string) {
    setDomain(d);
    checkDns(d);
  }

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Network className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
              Lookup DNS
            </span>
          )}
        </Button>
      </form>

      {/* Example Domains */}
      {!result && !error && !loading && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => handleExampleClick(d)}
              className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer hover:underline"
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
          {/* Grade Badge */}
          <GradeBadge result={result} />

          {/* Address Records */}
          <SectionCard
            title="Address Records"
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
                  aria-label="Copy DNS results"
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
                  aria-label="Download DNS report"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            }
          >
            <div className="divide-y divide-foreground/5">
              {/* A Records */}
              {result.records.a.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Network className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        A Records (IPv4)
                      </div>
                      <div className="space-y-1.5 mt-1.5">
                        {result.records.a.map((rec) => (
                          <div
                            key={rec.address}
                            className="flex items-center gap-2 flex-wrap"
                          >
                            <span className="text-sm font-mono text-foreground/80">
                              {rec.address}
                            </span>
                            <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10">
                              TTL: {formatTtl(rec.ttl)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AAAA Records */}
              {result.records.aaaa.length > 0 && (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Network className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        AAAA Records (IPv6)
                      </div>
                      <div className="space-y-1.5 mt-1.5">
                        {result.records.aaaa.map((rec) => (
                          <div
                            key={rec.address}
                            className="flex items-center gap-2 flex-wrap"
                          >
                            <span className="text-sm font-mono text-foreground/80">
                              {rec.address}
                            </span>
                            <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10">
                              TTL: {formatTtl(rec.ttl)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CNAME Records */}
              {result.records.cname.length > 0 && (
                <div className="py-3">
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        CNAME Records (Alias)
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.records.cname.map((cname) => (
                          <span
                            key={cname}
                            className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80"
                          >
                            {cname}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No records message */}
              {result.records.a.length === 0 &&
                result.records.aaaa.length === 0 &&
                result.records.cname.length === 0 && (
                  <div className="py-3 text-sm text-muted-foreground">
                    No address records found for this domain.
                  </div>
                )}
            </div>
          </SectionCard>

          {/* Nameservers */}
          {result.records.ns.length > 0 && (
            <SectionCard
              title={`Nameservers (${result.records.ns.length})`}
            >
              <div className="flex flex-wrap gap-1.5">
                {result.records.ns.map((ns) => (
                  <span
                    key={ns}
                    className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80"
                  >
                    {ns}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* SOA Record */}
          {result.records.soa && (
            <SectionCard title="SOA Record" defaultOpen={false}>
              <div className="divide-y divide-foreground/5">
                <ResultRow
                  icon={Server}
                  label="Primary Nameserver"
                  value={result.records.soa.nsname}
                  className="text-primary"
                  mono
                />
                <ResultRow
                  icon={Mail}
                  label="Admin Email"
                  value={formatSoaEmail(result.records.soa.hostmaster)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Shield}
                  label="Serial"
                  value={result.records.soa.serial.toString()}
                  className="text-muted-foreground"
                  mono
                />
                <ResultRow
                  icon={Clock}
                  label="Refresh"
                  value={formatTtl(result.records.soa.refresh)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Retry"
                  value={formatTtl(result.records.soa.retry)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Expire"
                  value={formatTtl(result.records.soa.expire)}
                  className="text-muted-foreground"
                />
                <ResultRow
                  icon={Clock}
                  label="Minimum TTL"
                  value={formatTtl(result.records.soa.minttl)}
                  className="text-muted-foreground"
                />
              </div>
            </SectionCard>
          )}

          {/* Mail & Email Security */}
          <SectionCard
            title="Mail & Email Security"
            badge={
              <StatusPill
                ok={
                  result.emailSecurity.hasMx &&
                  result.emailSecurity.spf.found &&
                  result.emailSecurity.dmarc.found
                }
                label={
                  result.emailSecurity.hasMx &&
                  result.emailSecurity.spf.found &&
                  result.emailSecurity.dmarc.found
                    ? "Secure"
                    : "Issues"
                }
              />
            }
          >
            <div className="divide-y divide-foreground/5">
              {/* MX Records */}
              {result.records.mx.length > 0 ? (
                <div className="py-3 border-b border-foreground/5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        MX Records (Mail Servers)
                      </div>
                      <div className="space-y-1 mt-1.5">
                        {result.records.mx.map((mx) => (
                          <div
                            key={mx.exchange}
                            className="flex items-center gap-2"
                          >
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              {mx.priority}
                            </span>
                            <span className="text-xs font-mono text-foreground/80">
                              {mx.exchange}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ResultRow
                  icon={Mail}
                  label="MX Records"
                  value="No mail servers configured"
                  className="text-destructive"
                />
              )}

              {/* SPF */}
              <div className="py-3 border-b border-foreground/5">
                <div className="flex items-start gap-3">
                  <Shield
                    className={cn(
                      "w-4 h-4 mt-0.5 shrink-0",
                      result.emailSecurity.spf.found
                        ? "text-success"
                        : "text-destructive"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">
                      SPF Record
                    </div>
                    {result.emailSecurity.spf.found ? (
                      <div className="text-xs font-mono text-foreground/70 bg-background/40 border border-foreground/5 rounded-lg p-2 mt-1.5 break-all">
                        {result.emailSecurity.spf.record}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-destructive">
                        Not found — vulnerable to email spoofing
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DMARC */}
              <div className="py-3">
                <div className="flex items-start gap-3">
                  <Shield
                    className={cn(
                      "w-4 h-4 mt-0.5 shrink-0",
                      result.emailSecurity.dmarc.found
                        ? "text-success"
                        : "text-destructive"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">
                      DMARC Record
                    </div>
                    {result.emailSecurity.dmarc.found ? (
                      <div className="text-xs font-mono text-foreground/70 bg-background/40 border border-foreground/5 rounded-lg p-2 mt-1.5 break-all">
                        {result.emailSecurity.dmarc.record}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-destructive">
                        Not found — no email impersonation protection
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* TXT Records */}
          {result.records.txt.length > 0 && (
            <SectionCard
              title={`TXT Records (${result.records.txt.length})`}
              defaultOpen={false}
            >
              <div className="space-y-2">
                {result.records.txt.map((txt, i) => (
                  <div
                    key={i}
                    className="text-xs font-mono text-foreground/70 bg-background/40 border border-foreground/5 rounded-lg p-3 break-all"
                  >
                    {txt}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* CAA Records */}
          {result.records.caa.length > 0 && (
            <SectionCard
              title={`CAA Records (${result.records.caa.length})`}
              defaultOpen={false}
            >
              <div className="space-y-2">
                {result.records.caa.map((caa, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                      {caa.tag}
                    </span>
                    <span className="text-xs font-mono text-foreground/80">
                      {caa.value}
                    </span>
                    {caa.critical > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                        critical
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Grade Details */}
          <SectionCard title="Grade Details" defaultOpen={false}>
            <div className="space-y-2">
              {result.goodPoints.map((point, i) => (
                <div
                  key={`good-${i}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-success shrink-0" />
                  <span className="text-success">{point}</span>
                </div>
              ))}
              {result.issues.map((issue, i) => (
                <div
                  key={`issue-${i}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
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
