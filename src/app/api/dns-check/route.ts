import dns from "dns";
import { NextRequest, NextResponse } from "next/server";

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

function calculateGrade(
  records: DnsCheckResult["records"],
  emailSecurity: DnsCheckResult["emailSecurity"]
): { grade: string; goodPoints: string[]; issues: string[] } {
  const good: string[] = [];
  const issues: string[] = [];
  let score = 0;

  // A/AAAA records (25 pts)
  if (records.a.length > 0) {
    score += 20;
    good.push("IPv4 address records found");
  } else {
    issues.push("No A records (IPv4)");
  }

  if (records.aaaa.length > 0) {
    score += 5;
    good.push("IPv6 support (AAAA records)");
  } else {
    issues.push("No AAAA records — no IPv6 support");
  }

  // Nameservers (20 pts)
  if (records.ns.length >= 2) {
    score += 20;
    good.push(`${records.ns.length} nameservers for redundancy`);
  } else if (records.ns.length === 1) {
    score += 10;
    issues.push("Only one nameserver — add redundancy");
  } else {
    issues.push("No NS records found");
  }

  // SOA (5 pts)
  if (records.soa) {
    score += 5;
    good.push("SOA record present");
  }

  // MX records (15 pts)
  if (records.mx.length > 0) {
    score += 15;
    good.push("Mail servers configured (MX)");
  } else {
    issues.push("No MX records — cannot receive email");
  }

  // SPF (15 pts)
  if (emailSecurity.spf.found) {
    score += 15;
    good.push("SPF record protects against email spoofing");
  } else {
    issues.push("No SPF record — vulnerable to email spoofing");
  }

  // DMARC (10 pts)
  if (emailSecurity.dmarc.found) {
    score += 10;
    good.push("DMARC policy prevents email impersonation");
  } else {
    issues.push("No DMARC record");
  }

  // CAA (10 pts)
  if (records.caa.length > 0) {
    score += 10;
    good.push("CAA records restrict certificate issuance");
  } else {
    issues.push("No CAA records — any CA can issue certificates");
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

    // Resolve all record types in parallel
    const [aRes, aaaaRes, cnameRes, mxRes, nsRes, txtRes, soaRes, caaRes] =
      await Promise.all([
        safeResolve(() => dns.promises.resolve4(domain, { ttl: true })),
        safeResolve(() => dns.promises.resolve6(domain, { ttl: true })),
        safeResolve(() => dns.promises.resolveCname(domain)),
        safeResolve(() => dns.promises.resolveMx(domain)),
        safeResolve(() => dns.promises.resolveNs(domain)),
        safeResolve(() => dns.promises.resolveTxt(domain)),
        safeResolve(() => dns.promises.resolveSoa(domain)),
        safeResolve(() => dns.promises.resolveCaa(domain)),
      ]);

    const responseTimeMs = Date.now() - start;

    // Process TXT records (each record is an array of chunks)
    const txtRecords = (txtRes || []).map((r) => r.join(""));

    // Process CAA records — Node returns { critical, issue/issuewild/iodef: value }
    const caaRecords = (caaRes || []).map((r) => {
      const obj = r as unknown as Record<string, unknown>;
      const critical = (obj.critical as number) || 0;
      const tag =
        Object.keys(obj).find((k) => k !== "critical") || "unknown";
      const value = String(obj[tag] || "");
      return { critical, tag, value };
    });

    const records: DnsCheckResult["records"] = {
      a: (aRes as { address: string; ttl: number }[]) || [],
      aaaa: (aaaaRes as { address: string; ttl: number }[]) || [],
      cname: cnameRes || [],
      mx: (mxRes || []).sort((a, b) => a.priority - b.priority),
      ns: (nsRes || []).map((n) => n.toLowerCase()),
      txt: txtRecords,
      soa: soaRes || null,
      caa: caaRecords,
    };

    const totalRecords =
      records.a.length +
      records.aaaa.length +
      records.cname.length +
      records.mx.length +
      records.ns.length +
      records.txt.length +
      (records.soa ? 1 : 0) +
      records.caa.length;

    if (totalRecords === 0) {
      return NextResponse.json(
        {
          error:
            "No DNS records found. The domain may not exist or is not resolvable.",
        },
        { status: 404 }
      );
    }

    // Email security: SPF from TXT records, DMARC from _dmarc subdomain
    const spfRecord = txtRecords.find((r) =>
      r.toLowerCase().startsWith("v=spf1")
    );

    const dmarcRes = await safeResolve(() =>
      dns.promises.resolveTxt(`_dmarc.${domain}`)
    );
    const dmarcRecords = (dmarcRes || []).map((r) => r.join(""));
    const dmarcRecord = dmarcRecords.find((r) =>
      r.toLowerCase().startsWith("v=dmarc1")
    );

    const emailSecurity: DnsCheckResult["emailSecurity"] = {
      spf: { found: !!spfRecord, record: spfRecord },
      dmarc: { found: !!dmarcRecord, record: dmarcRecord },
      hasMx: records.mx.length > 0,
    };

    const { grade, goodPoints, issues } = calculateGrade(
      records,
      emailSecurity
    );

    const result: DnsCheckResult = {
      domain,
      responseTimeMs,
      records,
      totalRecords,
      emailSecurity,
      grade,
      goodPoints,
      issues,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: `DNS lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
