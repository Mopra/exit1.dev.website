import dns from "dns";
import { NextRequest, NextResponse } from "next/server";

// Nameserver-focused lookup. /api/dns-check already returns an `ns` array, but
// this route answers the questions someone searching "nameserver lookup" or
// "check nameservers" actually has: who runs my DNS, is the delegation
// redundant, does the glue resolve, and does SOA agree with the NS set.

// ── Types ────────────────────────────────────────────────────────────

interface NameserverEntry {
  host: string;
  ipv4: string[];
  ipv6: string[];
  /** False when the nameserver hostname itself has no A/AAAA record. */
  resolves: boolean;
  provider: string | null;
  /** True when the provider announces its nameserver addresses via anycast. */
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
  /** Whether the SOA primary nameserver appears in the NS record set. */
  soaMatchesNs: boolean;
  /** Detected DNS providers, most nameservers first. */
  providers: string[];
  /** Distinct registrable parents of the nameserver hostnames. */
  parentDomains: string[];
  /** Distinct IPv4 /16 networks across all nameservers. */
  distinctNetworks: number;
  grade: string;
  goodPoints: string[];
  issues: string[];
}

// ── Provider fingerprints ────────────────────────────────────────────

// Matched against the nameserver hostname as a suffix or substring. Order
// matters only for readability — the first match wins.
//
// `anycast: true` marks providers that announce their nameserver addresses via
// anycast from many locations. For those, all nameservers sharing one IPv4 /16
// is by design and is NOT a redundancy problem — without this flag the
// network-diversity check would tell every Cloudflare-hosted domain (the single
// most common case) that its DNS is a single point of failure, which is wrong.
const PROVIDERS: { name: string; patterns: string[]; anycast?: boolean }[] = [
  { name: "Cloudflare", patterns: ["ns.cloudflare.com", "cloudflare.com"], anycast: true },
  { name: "AWS Route 53", patterns: ["awsdns"], anycast: true },
  { name: "Google Cloud DNS", patterns: ["googledomains.com", "google.com", "googledns"], anycast: true },
  { name: "Azure DNS", patterns: ["azure-dns"], anycast: true },
  { name: "GoDaddy", patterns: ["domaincontrol.com", "godaddy.com"] },
  { name: "Namecheap", patterns: ["registrar-servers.com", "namecheaphosting.com"] },
  { name: "NS1", patterns: ["nsone.net"], anycast: true },
  { name: "DNSimple", patterns: ["dnsimple.com"] },
  { name: "DNS Made Easy", patterns: ["dnsmadeeasy.com"], anycast: true },
  { name: "Akamai / Edge DNS", patterns: ["akam.net", "akamaiedge.net", "akadns.net"], anycast: true },
  { name: "UltraDNS", patterns: ["ultradns"], anycast: true },
  { name: "Vercel", patterns: ["vercel-dns.com"] },
  { name: "Netlify", patterns: ["nsone.net.netlify", "netlify.com"] },
  { name: "DigitalOcean", patterns: ["digitalocean.com"] },
  { name: "Linode", patterns: ["linode.com"] },
  { name: "Hetzner", patterns: ["hetzner.com", "hetzner.de", "your-server.de"] },
  { name: "OVH", patterns: ["ovh.net"] },
  { name: "Gandi", patterns: ["gandi.net"] },
  { name: "Hover", patterns: ["hover.com"] },
  { name: "Name.com", patterns: ["name.com"] },
  { name: "Squarespace", patterns: ["squarespacedns.com"] },
  { name: "Wix", patterns: ["wixdns.net"] },
  { name: "Shopify", patterns: ["shopifydns.com"] },
  { name: "WP Engine", patterns: ["wpengine.com"] },
  { name: "Kinsta", patterns: ["kinsta.com"] },
  { name: "Bluehost", patterns: ["bluehost.com"] },
  { name: "HostGator", patterns: ["hostgator.com"] },
  { name: "SiteGround", patterns: ["siteground.net", "sgvps.net"] },
  { name: "Hostinger", patterns: ["hostinger.com", "dns-parking.com"] },
  { name: "Porkbun", patterns: ["porkbun.com"] },
  { name: "Dynadot", patterns: ["dynadot.com"] },
  { name: "Rackspace", patterns: ["rackspace.com"] },
  { name: "Oracle Cloud (Dyn)", patterns: ["dynect.net", "oraclecloud.net"], anycast: true },
  { name: "ClouDNS", patterns: ["cloudns.net"], anycast: true },
  { name: "deSEC", patterns: ["desec.io"], anycast: true },
  { name: "Bunny DNS", patterns: ["bunny.net"], anycast: true },
  { name: "IANA / Root", patterns: ["iana-servers.net"] },
];

function detectProvider(host: string): { name: string; anycast: boolean } | null {
  for (const p of PROVIDERS) {
    if (p.patterns.some((pattern) => host.includes(pattern))) {
      return { name: p.name, anycast: p.anycast === true };
    }
  }
  return null;
}

// ── Helpers ──────────────────────────────────────────────────────────

function extractHostname(input: string): string | null {
  let hostname = input.trim().toLowerCase();

  if (hostname.includes("://")) {
    try {
      hostname = new URL(hostname).hostname;
    } catch {
      return null;
    }
  }

  hostname = hostname.split("/")[0].split(":")[0].replace(/\.$/, "");

  if (!hostname || !hostname.includes(".") || hostname.length > 253) return null;
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(hostname)) return null;

  return hostname;
}

async function safeResolve<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

/**
 * Last two labels of a hostname. Deliberately naive — it is only used to spot
 * "all nameservers live under one domain", where a multi-label public suffix
 * (ns1.example.co.uk) makes the check stricter rather than wrong.
 */
function parentDomain(host: string): string {
  return host.split(".").slice(-2).join(".");
}

/** IPv4 /16 prefix, used as a coarse "different network" signal. */
function network16(ip: string): string {
  return ip.split(".").slice(0, 2).join(".");
}

function calculateGrade(
  nameservers: NameserverEntry[],
  soa: NameserverLookupResult["soa"],
  soaMatchesNs: boolean,
  parentDomains: string[],
  distinctNetworks: number
): { grade: string; goodPoints: string[]; issues: string[] } {
  const good: string[] = [];
  const issues: string[] = [];
  let score = 0;

  // Redundancy — the single most important nameserver property (30 pts)
  if (nameservers.length >= 2) {
    score += 30;
    good.push(`${nameservers.length} nameservers respond for this domain`);
  } else if (nameservers.length === 1) {
    score += 10;
    issues.push(
      "Only one nameserver — a single point of failure for the whole domain"
    );
  } else {
    issues.push("No NS records found — the domain has no working delegation");
  }

  // Glue: every nameserver hostname must itself resolve (20 pts)
  const unresolved = nameservers.filter((ns) => !ns.resolves);
  if (nameservers.length > 0 && unresolved.length === 0) {
    score += 20;
    good.push("Every nameserver hostname resolves to an IP address");
  } else if (unresolved.length > 0) {
    issues.push(
      `${unresolved.length} nameserver${unresolved.length > 1 ? "s" : ""} did not resolve to an IP address (${unresolved
        .map((ns) => ns.host)
        .join(", ")})`
    );
  }

  // IPv6 reachability (15 pts)
  if (nameservers.some((ns) => ns.ipv6.length > 0)) {
    score += 15;
    good.push("At least one nameserver is reachable over IPv6");
  } else if (nameservers.length > 0) {
    issues.push("No nameserver has an IPv6 address — IPv6-only resolvers cannot reach your DNS");
  }

  // Network diversity (15 pts). Anycast providers deliberately serve every
  // nameserver from one prefix announced in many locations, so a shared /16 is
  // a design choice there rather than a shared failure domain.
  const allAnycast =
    nameservers.length > 0 && nameservers.every((ns) => ns.anycast);
  const anycastNames = [
    ...new Set(
      nameservers.filter((ns) => ns.anycast && ns.provider).map((ns) => ns.provider!)
    ),
  ];

  if (distinctNetworks >= 2) {
    score += 15;
    good.push(`Nameservers span ${distinctNetworks} distinct IPv4 networks`);
  } else if (allAnycast) {
    score += 15;
    good.push(
      `Nameserver addresses share one prefix, but ${anycastNames.join(" and ")} announces them via anycast from many locations — that prefix is not a single physical network`
    );
  } else if (nameservers.length >= 2 && distinctNetworks === 1) {
    issues.push(
      "All nameservers sit in the same IPv4 /16 network — one network outage takes them all down"
    );
  }

  // Delegation spread across parent domains (10 pts)
  if (parentDomains.length >= 2) {
    score += 10;
    good.push(`Delegation spread across ${parentDomains.length} nameserver domains`);
  } else if (nameservers.length >= 2) {
    // Extremely common and not really a fault (Cloudflare, Route 53 all do
    // this), so it is a note rather than an issue.
    good.push(`All nameservers under ${parentDomains[0]}`);
    score += 5;
  }

  // SOA present and consistent with the NS set (10 pts)
  if (soa && soaMatchesNs) {
    score += 10;
    good.push("SOA primary nameserver matches the NS record set");
  } else if (soa && !soaMatchesNs) {
    score += 5;
    issues.push(
      `SOA lists ${soa.nsname} as primary, but it is not in the NS record set — usually a leftover from a past migration`
    );
  } else {
    issues.push("No SOA record — the zone is missing its start-of-authority data");
  }

  let grade: string;
  if (score >= 90) grade = "A+";
  else if (score >= 75) grade = "A";
  else if (score >= 60) grade = "B";
  else if (score >= 45) grade = "C";
  else if (score >= 25) grade = "D";
  else grade = "F";

  return { grade, goodPoints: good, issues };
}

// ── Route Handler ────────────────────────────────────────────────────

// Bounds the fan-out of per-nameserver A/AAAA lookups.
const MAX_NAMESERVERS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = body.domain || body.url;

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domain = extractHostname(input);
    if (!domain) {
      return NextResponse.json({ error: "Invalid domain name" }, { status: 400 });
    }

    const start = Date.now();

    const [nsRes, soaRes] = await Promise.all([
      safeResolve(() => dns.promises.resolveNs(domain)),
      safeResolve(() => dns.promises.resolveSoa(domain)),
    ]);

    const nsHosts = (nsRes || [])
      .map((n) => n.toLowerCase().replace(/\.$/, ""))
      .filter(Boolean)
      .sort()
      .slice(0, MAX_NAMESERVERS);

    if (nsHosts.length === 0) {
      return NextResponse.json(
        {
          error:
            "No nameservers found. The domain may not exist, may not be delegated, or its registry may not be responding.",
        },
        { status: 404 }
      );
    }

    // Resolve each nameserver hostname to its addresses (the "glue").
    const nameservers: NameserverEntry[] = await Promise.all(
      nsHosts.map(async (host) => {
        const [v4, v6] = await Promise.all([
          safeResolve(() => dns.promises.resolve4(host)),
          safeResolve(() => dns.promises.resolve6(host)),
        ]);
        const ipv4 = v4 || [];
        const ipv6 = v6 || [];
        const detected = detectProvider(host);
        return {
          host,
          ipv4,
          ipv6,
          resolves: ipv4.length > 0 || ipv6.length > 0,
          provider: detected?.name ?? null,
          anycast: detected?.anycast ?? false,
        };
      })
    );

    const responseTimeMs = Date.now() - start;

    const soa = soaRes || null;
    const soaPrimary = soa?.nsname?.toLowerCase().replace(/\.$/, "") ?? null;
    const soaMatchesNs = !!soaPrimary && nsHosts.includes(soaPrimary);

    const parentDomains = [...new Set(nameservers.map((ns) => parentDomain(ns.host)))];

    const providers = [
      ...new Set(
        nameservers
          .map((ns) => ns.provider)
          .filter((p): p is string => p !== null)
      ),
    ];

    const distinctNetworks = new Set(
      nameservers.flatMap((ns) => ns.ipv4.map(network16))
    ).size;

    const { grade, goodPoints, issues } = calculateGrade(
      nameservers,
      soa,
      soaMatchesNs,
      parentDomains,
      distinctNetworks
    );

    const result: NameserverLookupResult = {
      domain,
      responseTimeMs,
      nameservers,
      soa,
      soaMatchesNs,
      providers,
      parentDomains,
      distinctNetworks,
      grade,
      goodPoints,
      issues,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Nameserver lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
