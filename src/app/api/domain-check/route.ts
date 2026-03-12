import * as net from "net";
import { NextRequest, NextResponse } from "next/server";

// ── Types ────────────────────────────────────────────────────────────

interface DomainResult {
  domain: string;
  status: "active" | "expiring_soon" | "expired" | "unknown";
  expiryDate?: string;
  createdDate?: string;
  updatedDate?: string;
  registrar?: string;
  registrarUrl?: string;
  nameservers?: string[];
  registryStatus?: string[];
  daysUntilExpiry?: number;
  dnssec?: boolean;
  error?: string;
}

interface RdapBootstrapData {
  version: string;
  publication: string;
  services: [string[], string[]][];
}

interface RdapResponse {
  objectClassName: string;
  ldhName: string;
  status?: string[];
  events?: Array<{ eventAction: string; eventDate: string }>;
  entities?: Array<{
    roles?: string[];
    vcardArray?: [string, Array<[string, Record<string, unknown>, string, string | string[]]>];
    links?: Array<{ rel: string; href: string }>;
  }>;
  nameservers?: Array<{ ldhName: string }>;
  secureDNS?: { delegationSigned?: boolean; dsData?: unknown[] };
}

// ── In-memory caches ─────────────────────────────────────────────────

let bootstrapCache: { data: RdapBootstrapData; expiresAt: number } | null = null;
const BOOTSTRAP_TTL_MS = 24 * 60 * 60 * 1000;

// ── RDAP Bootstrap ───────────────────────────────────────────────────

async function getBootstrap(): Promise<RdapBootstrapData> {
  if (bootstrapCache && bootstrapCache.expiresAt > Date.now()) {
    return bootstrapCache.data;
  }

  const res = await fetch("https://data.iana.org/rdap/dns.json", {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to fetch RDAP bootstrap: ${res.status}`);

  const data = (await res.json()) as RdapBootstrapData;
  bootstrapCache = { data, expiresAt: Date.now() + BOOTSTRAP_TTL_MS };
  return data;
}

// Known RDAP servers not in IANA bootstrap
const RDAP_SERVERS: Record<string, string> = {
  de: "https://rdap.denic.de/",
  ch: "https://rdap.nic.ch/",
};

async function getRdapServer(tld: string): Promise<string | null> {
  const lower = tld.toLowerCase();

  // 1. Check hardcoded map (for TLDs missing from IANA bootstrap)
  if (RDAP_SERVERS[lower]) return RDAP_SERVERS[lower];

  // 2. Check IANA bootstrap
  try {
    const bootstrap = await getBootstrap();

    for (const service of bootstrap.services) {
      if (service[0].includes(lower)) {
        let url = service[1][0];
        if (!url.endsWith("/")) url += "/";
        return url;
      }
    }
  } catch {
    // Bootstrap fetch failed
  }
  return null;
}

// ── RDAP Query ───────────────────────────────────────────────────────

async function queryRdap(domain: string): Promise<DomainResult | null> {
  const tld = domain.split(".").pop()!;
  const server = await getRdapServer(tld);
  if (!server) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${server}domain/${domain}`, {
      headers: { Accept: "application/rdap+json, application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as RdapResponse;
    return parseRdapResponse(data, domain);
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function parseRdapResponse(response: RdapResponse, domain: string): DomainResult {
  const events = response.events || [];

  let expiryDate: string | undefined;
  let createdDate: string | undefined;
  let updatedDate: string | undefined;

  for (const event of events) {
    const d = new Date(event.eventDate);
    if (isNaN(d.getTime())) continue;
    const iso = d.toISOString();

    switch (event.eventAction.toLowerCase()) {
      case "expiration":
        expiryDate = iso;
        break;
      case "registration":
        createdDate = iso;
        break;
      case "last changed":
      case "last update of rdap database":
        if (!updatedDate || event.eventAction.toLowerCase() === "last changed") {
          updatedDate = iso;
        }
        break;
    }
  }

  let registrar: string | undefined;
  let registrarUrl: string | undefined;

  for (const entity of response.entities || []) {
    if (entity.roles?.includes("registrar")) {
      if (entity.vcardArray?.[1]) {
        for (const prop of entity.vcardArray[1]) {
          if (prop[0] === "fn") {
            registrar = Array.isArray(prop[3]) ? prop[3].join(" ") : String(prop[3]);
            break;
          }
        }
      }
      if (entity.links) {
        for (const link of entity.links) {
          if (link.rel === "self" || link.rel === "related") {
            registrarUrl = link.href;
            break;
          }
        }
      }
      break;
    }
  }

  const rawNs = response.nameservers?.map((ns) => ns.ldhName) || [];
  const nameservers = cleanNameservers(rawNs);

  // DNSSEC
  const dnssec = response.secureDNS?.delegationSigned === true ||
    (response.secureDNS?.dsData && response.secureDNS.dsData.length > 0);

  let daysUntilExpiry: number | undefined;
  if (expiryDate) {
    daysUntilExpiry = Math.floor(
      (new Date(expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
  }

  const status = getStatus(daysUntilExpiry);

  return {
    domain,
    status,
    expiryDate,
    createdDate,
    updatedDate,
    registrar,
    registrarUrl,
    nameservers: nameservers.length > 0 ? nameservers : undefined,
    registryStatus: response.status,
    daysUntilExpiry,
    dnssec: dnssec || undefined,
  };
}

// ── WHOIS Fallback ───────────────────────────────────────────────────

const WHOIS_SERVERS: Record<string, string> = {
  com: "whois.verisign-grs.com",
  net: "whois.verisign-grs.com",
  org: "whois.pir.org",
  info: "whois.afilias.net",
  io: "whois.nic.io",
  dev: "whois.nic.google",
  app: "whois.nic.google",
  xyz: "whois.nic.xyz",
  me: "whois.nic.me",
  co: "whois.registry.co",
  ai: "whois.nic.ai",
  tech: "whois.nic.tech",
  online: "whois.nic.online",
  site: "whois.nic.site",
  uk: "whois.nic.uk",
  de: "whois.denic.de",
  fr: "whois.nic.fr",
  nl: "whois.sidn.nl",
  eu: "whois.eu",
  au: "whois.auda.org.au",
  ca: "whois.cira.ca",
  jp: "whois.jprs.jp",
  in: "whois.registry.in",
  br: "whois.registro.br",
  it: "whois.nic.it",
  se: "whois.iis.se",
  ch: "whois.nic.ch",
  nz: "whois.srs.net.nz",
  ru: "whois.tcinet.ru",
  pl: "whois.dns.pl",
  be: "whois.dns.be",
  za: "whois.registry.net.za",
  us: "whois.nic.us",
};

const WHOIS_QUERY_FORMAT: Record<string, (d: string) => string> = {
  de: (d) => `-T dn ${d}`,
  jp: (d) => `${d}/e`, // English output from JPRS
};

function rawWhoisQuery(server: string, query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const socket = net.createConnection(43, server);

    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error(`WHOIS query timed out`));
    }, 8000);

    socket.on("connect", () => socket.write(`${query}\r\n`));
    socket.on("data", (chunk) => chunks.push(chunk));
    socket.on("end", () => {
      clearTimeout(timer);
      resolve(Buffer.concat(chunks).toString("utf-8"));
    });
    socket.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`WHOIS failed: ${err.message}`));
    });
  });
}

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
  nov: 10, november: 10, dec: 11, december: 11,
};

function parseWhoisDate(dateStr: string): string | undefined {
  const trimmed = dateStr.trim();
  if (!trimmed) return undefined;

  // 1. ISO 8601 and standard formats — native Date handles these
  const native = new Date(trimmed);
  if (!isNaN(native.getTime()) && native.getFullYear() > 1990) {
    return native.toISOString();
  }

  // 2. Nominet: "HH:MM:SS DD-Mon-YYYY" or "DD-Month-YYYY"
  const nominetMatch = trimmed.match(/(?:\d{1,2}:\d{2}:\d{2}\s+)?(\d{1,2})-(\w+)-(\d{4})/);
  if (nominetMatch) {
    const month = MONTHS[nominetMatch[2].toLowerCase()];
    if (month !== undefined) {
      return new Date(parseInt(nominetMatch[3]), month, parseInt(nominetMatch[1])).toISOString();
    }
  }

  // 3. DD/MM/YYYY (with optional time) — .pt format
  const slashDmy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashDmy) {
    return new Date(parseInt(slashDmy[3]), parseInt(slashDmy[2]) - 1, parseInt(slashDmy[1])).toISOString();
  }

  // 4. DD.MM.YYYY (with optional time) — Finnish format
  const dotDmy = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dotDmy) {
    return new Date(parseInt(dotDmy[3]), parseInt(dotDmy[2]) - 1, parseInt(dotDmy[1])).toISOString();
  }

  // 5. YYYY.MM.DD
  const dotYmd = trimmed.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
  if (dotYmd) {
    return new Date(parseInt(dotYmd[1]), parseInt(dotYmd[2]) - 1, parseInt(dotYmd[3])).toISOString();
  }

  // 6. YYYYMMDD compact — Brazilian format
  const compact = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compact) {
    return new Date(parseInt(compact[1]), parseInt(compact[2]) - 1, parseInt(compact[3])).toISOString();
  }

  // 7. "Thu Feb 22 1996" — Belgian format
  const dayMonthYear = trimmed.match(/\w+\s+(\w+)\s+(\d{1,2})\s+(\d{4})/);
  if (dayMonthYear) {
    const month = MONTHS[dayMonthYear[1].toLowerCase()];
    if (month !== undefined) {
      return new Date(parseInt(dayMonthYear[3]), month, parseInt(dayMonthYear[2])).toISOString();
    }
  }

  return undefined;
}

function extractFirst(raw: string, patterns: RegExp[]): string | undefined {
  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1].trim();
  }
  return undefined;
}

function extractAll(raw: string, patterns: RegExp[]): string[] {
  for (const pattern of patterns) {
    const results: string[] = [];
    const re = new RegExp(pattern.source, pattern.flags);
    let m;
    while ((m = re.exec(raw)) !== null) results.push(m[1].trim());
    if (results.length > 0) return results;
  }
  return [];
}

const FIELD_PATTERNS = {
  expiryDate: [
    /Registry Expiry Date:\s*(.+)/i,
    /Expiry date:\s*\n?\s*(.+)/i,
    /Expiration Date:\s*(.+)/i,
    /Expiry Date:\s*(.+)/i,
    /Expire Date:\s*(.+)/i,
    /^expires\.*:\s*(.+)/im,         // Finnish dot-padded + standard
    /paid-till:\s*(.+)/i,
    /Renewal date:\s*\n?\s*(.+)/i,
    /\[Expires on\]\s*(.+)/i,        // JPRS
  ],
  createdDate: [
    /Creation Date:\s*(.+)/i,
    /Registered on:\s*\n?\s*(.+)/i,
    /Registration Date:\s*(.+)/i,
    /^Registered:\s+(.+)/im,         // Danish
    /^created\.*:\s*(.+)/im,         // Finnish dot-padded + standard
    /\[Created on\]\s*(.+)/i,        // JPRS
    /Original Created:\s*(.+)/i,     // NZ
  ],
  updatedDate: [
    /Updated Date:\s*(.+)/i,
    /Last updated:\s*\n?\s*(.+)/i,
    /Last Update:\s*(.+)/i,
    /last-modified:\s*(.+)/i,
    /^Changed:\s*(.+)/im,            // DENIC
    /^modified\.*:\s*(.+)/im,        // Finnish dot-padded
    /\[Last Updated\]\s*(.+)/i,      // JPRS
  ],
  registrar: [
    /^registrar\.*:\s*(.+)/im,       // Standard + Finnish dot-padded
    /Registrar Name:\s*(.+)/i,
    /Sponsoring Registrar:\s*(.+)/i,
  ],
  registrarUrl: [
    /Registrar URL:\s*(.+)/i,
  ],
  nameserver: [
    /Name Server:\s*(\S+)/gi,
    /Name servers:\s*\n?\s*(\S+)/gi,
    /Nameserver:\s*(\S+)/gi,
    /^nserver\.*:\s*(\S+)/gim,       // Standard + Finnish dot-padded
    /^Hostname:\s*(\S+)/gim,         // Danish
  ],
  status: [
    /Domain Status:\s*(\S+)/gi,
    /Registration status:\s*\n?\s*(.+)/gi,
    /^status\.*:\s*(.+)/gim,         // Standard + Finnish dot-padded
  ],
};

// TLD-specific post-processors for quirky registries
type WhoisPartial = {
  registrar?: string;
  registrarUrl?: string;
  nameservers?: string[];
  registryStatus?: string[];
};

/**
 * Generic nameserver cleanup — applied to all WHOIS results.
 * Strips trailing dots, [OK] flags, IP suffixes, and other noise.
 */
function cleanNameservers(ns: string[]): string[] {
  return ns
    .map((n) =>
      n
        .replace(/\.$/, "")          // trailing dot
        .replace(/\s*\[.*\]$/, "")   // [OK], [TIMEOUT] flags (.fi)
        .replace(/\s*\|.*$/, "")     // | IPv4: ... (.pt)
        .split(/\s+/)[0]             // strip inline IPs
        .toLowerCase()
    )
    .filter((n) => n.includes(".") && !n.match(/^\d/)); // must be hostname, not IP
}

const TLD_POST_PROCESSORS: Record<string, (result: WhoisPartial, raw: string) => void> = {
  it: (result, raw) => {
    // NIC.it: Registrar block format
    if (!result.registrar) {
      const registrarBlock = raw.match(/^Registrar\n((?:\s+\S.*\n?)+)/im);
      if (registrarBlock) {
        const orgMatch = registrarBlock[1].match(/Organization:\s*(.+)/i);
        if (orgMatch) result.registrar = orgMatch[1].trim();
        if (!result.registrarUrl) {
          const webMatch = registrarBlock[1].match(/Web:\s*(https?:\/\/\S+)/i);
          if (webMatch) result.registrarUrl = webMatch[1].trim();
        }
      }
    }
    // NIC.it: Nameservers as indented block
    if (!result.nameservers?.length) {
      const nsBlock = raw.match(/^Nameservers\n((?:\s+\S.*\n?)+)/im);
      if (nsBlock) {
        const ns: string[] = [];
        for (const line of nsBlock[1].split("\n")) {
          const t = line.trim();
          if (t && t.includes(".")) ns.push(t.split(/\s+/)[0].toLowerCase());
        }
        if (ns.length > 0) result.nameservers = ns;
      }
    }
  },

  de: (result, raw) => {
    if (!result.registryStatus?.length) {
      const m = raw.match(/^Status:\s*(.+)/im);
      if (m) result.registryStatus = [m[1].trim()];
    }
  },

  uk: (result) => {
    if (result.registrar) {
      result.registrar = result.registrar.replace(/\s*\[Tag\s*=\s*[^\]]+\]\s*$/, "").trim();
    }
  },

  dk: (result, raw) => {
    if (!result.nameservers?.length) {
      const ns: string[] = [];
      const re = /^Hostname:\s*(\S+)/gim;
      let m;
      while ((m = re.exec(raw)) !== null) ns.push(m[1].toLowerCase());
      if (ns.length > 0) result.nameservers = ns;
    }
  },

  nl: (result, raw) => {
    // SIDN: registrar in block format, nameservers as "Domain nameservers:" block
    if (!result.registrar) {
      const regBlock = raw.match(/Registrar:\n((?:\s+\S.*\n?)+)/im);
      if (regBlock) {
        const firstLine = regBlock[1].split("\n")[0].trim();
        if (firstLine) result.registrar = firstLine;
      }
    }
    if (!result.nameservers?.length) {
      const nsBlock = raw.match(/Domain nameservers:\n((?:\s+\S.*\n?)+)/im);
      if (nsBlock) {
        const ns: string[] = [];
        for (const line of nsBlock[1].split("\n")) {
          const t = line.trim();
          if (t && t.includes(".")) ns.push(t.split(/\s+/)[0].toLowerCase());
        }
        if (ns.length > 0) result.nameservers = ns;
      }
    }
  },

  be: (result, raw) => {
    // DNS Belgium: registrar in "Registrar:\n\tName:\tXXX" block, nameservers as "Nameservers:" block
    if (!result.registrar) {
      const regBlock = raw.match(/Registrar:\n((?:[\t ]+.*\n?)+)/im);
      if (regBlock) {
        const nameMatch = regBlock[1].match(/Name:\s*(.+)/i);
        if (nameMatch) result.registrar = nameMatch[1].trim();
        if (!result.registrarUrl) {
          const urlMatch = regBlock[1].match(/Website:\s*(https?:\/\/\S+)/i);
          if (urlMatch) result.registrarUrl = urlMatch[1].trim();
        }
      }
    }
    if (!result.nameservers?.length) {
      const nsBlock = raw.match(/Nameservers:\n((?:[\t ]+\S.*\n?)+)/im);
      if (nsBlock) {
        const ns: string[] = [];
        for (const line of nsBlock[1].split("\n")) {
          const t = line.trim();
          if (t && t.includes(".")) ns.push(t.split(/\s+/)[0].replace(/\(.*\)/, "").toLowerCase());
        }
        if (ns.length > 0) result.nameservers = ns;
      }
    }
  },

  no: (result, raw) => {
    // Norid: "Registrar Handle: REG42-NORID" (no human-readable name available)
    // Dates are "Created: YYYY-MM-DD" which our generic patterns handle
    // No expiry date published by Norid — this is a policy limitation
    if (!result.registrar) {
      const m = raw.match(/Registrar Handle\.*:\s*(\S+)/i);
      if (m) result.registrar = m[1].trim();
    }
  },

  br: (result, raw) => {
    // Registro.br: owner as registrant, no registrar field
    if (!result.registrar) {
      const m = raw.match(/^owner:\s*(.+)/im);
      if (m) result.registrar = m[1].trim(); // Show owner as registrar for display
    }
  },

  pt: (result, raw) => {
    // DNS.pt: "Owner Name:" as registrant
    if (!result.registrar) {
      const m = raw.match(/^Owner Name:\s*(.+)/im);
      if (m) result.registrar = m[1].trim();
    }
  },

  at: (result, raw) => {
    // NIC.at: registrar on same line, "changed: YYYYMMDD HH:MM:SS" format
    if (!result.registrar) {
      const m = raw.match(/registrar:\s*(.+?)(?:\s*\(.*\))?$/im);
      if (m) result.registrar = m[1].trim();
    }
  },
};

async function queryWhois(domain: string): Promise<DomainResult | null> {
  const tld = domain.split(".").pop()!.toLowerCase();

  let server = WHOIS_SERVERS[tld];
  if (!server) {
    // Try IANA referral
    try {
      const ianaRes = await rawWhoisQuery("whois.iana.org", tld);
      const m = ianaRes.match(/whois:\s+(\S+)/i);
      if (m) server = m[1];
    } catch {
      // IANA referral failed
    }
  }

  if (!server) return null;

  try {
    const fmt = WHOIS_QUERY_FORMAT[tld];
    const query = fmt ? fmt(domain) : domain;
    const rawRes = await rawWhoisQuery(server, query);

    // Normalize line endings
    const raw = rawRes.replace(/\r\n/g, "\n");

    // Check for not found or access denied
    if (raw.length < 50) return null;
    const head = raw.slice(0, 500);
    if (/no match|not found|no data|no entries found|this domain cannot be registered/i.test(head)) {
      return null;
    }
    // Check for actual access denial (not legal disclaimers)
    // Only match at line start to avoid matching disclaimer boilerplate
    if (/^(?:access denied|requests?.+not permitted|query limit|quota exceeded)/im.test(head)) {
      return null;
    }

    const expiryStr = extractFirst(raw, FIELD_PATTERNS.expiryDate);
    const createdStr = extractFirst(raw, FIELD_PATTERNS.createdDate);
    const updatedStr = extractFirst(raw, FIELD_PATTERNS.updatedDate);
    const registrar = extractFirst(raw, FIELD_PATTERNS.registrar);
    const registrarUrl = extractFirst(raw, FIELD_PATTERNS.registrarUrl);
    const rawNs = extractAll(raw, FIELD_PATTERNS.nameserver);
    const nameservers = cleanNameservers(rawNs);
    const statuses = extractAll(raw, FIELD_PATTERNS.status);

    // DNSSEC detection from WHOIS
    const dnssecStr = extractFirst(raw, [/DNSSEC:\s*(.+)/i, /dnssec\.*:\s*(.+)/i]);
    const dnssec = dnssecStr ? /signed|yes|active/i.test(dnssecStr) : undefined;

    const expiryDate = expiryStr ? parseWhoisDate(expiryStr) : undefined;
    const createdDate = createdStr ? parseWhoisDate(createdStr) : undefined;
    const updatedDate = updatedStr ? parseWhoisDate(updatedStr) : undefined;

    // Build result, then run TLD-specific post-processor
    const partial: WhoisPartial & {
      expiryDate?: string; createdDate?: string; updatedDate?: string;
    } = {
      expiryDate,
      createdDate,
      updatedDate,
      registrar,
      registrarUrl,
      nameservers: nameservers.length > 0 ? nameservers : undefined,
      registryStatus: statuses.length > 0 ? statuses : undefined,
    };

    const postProcessor = TLD_POST_PROCESSORS[tld];
    if (postProcessor) postProcessor(partial, raw);

    let daysUntilExpiry: number | undefined;
    if (partial.expiryDate) {
      daysUntilExpiry = Math.floor(
        (new Date(partial.expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      );
    }

    // If we got nothing useful, return null
    if (!partial.expiryDate && !partial.registrar && !partial.nameservers?.length) return null;

    return {
      domain,
      status: getStatus(daysUntilExpiry),
      expiryDate: partial.expiryDate,
      createdDate: partial.createdDate,
      updatedDate: partial.updatedDate,
      registrar: partial.registrar,
      registrarUrl: partial.registrarUrl,
      nameservers: partial.nameservers,
      registryStatus: partial.registryStatus,
      daysUntilExpiry,
      dnssec,
    };
  } catch {
    return null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function getStatus(daysUntilExpiry: number | undefined): DomainResult["status"] {
  if (daysUntilExpiry === undefined) return "unknown";
  if (daysUntilExpiry <= 0) return "expired";
  if (daysUntilExpiry <= 30) return "expiring_soon";
  return "active";
}

// Common two-level TLDs
const TWO_LEVEL_TLDS = new Set([
  "co.uk", "com.au", "co.nz", "co.jp", "com.br", "co.za",
  "co.kr", "co.in", "com.mx", "com.cn", "net.au", "org.uk",
  "ac.uk", "gov.uk", "org.au", "edu.au", "com.sg", "com.hk",
]);

function extractDomain(input: string): string | null {
  try {
    let hostname: string;
    if (input.includes("://")) {
      hostname = new URL(input).hostname;
    } else {
      hostname = input.split("/")[0].split(":")[0];
    }
    hostname = hostname.toLowerCase().replace(/^www\./, "");

    const parts = hostname.split(".");
    if (parts.length >= 3) {
      const lastTwo = parts.slice(-2).join(".");
      if (TWO_LEVEL_TLDS.has(lastTwo)) {
        return parts.slice(-3).join(".");
      }
    }
    if (parts.length >= 2) return parts.slice(-2).join(".");
    return hostname;
  } catch {
    return null;
  }
}

// ── Route Handler ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domain = extractDomain(url.trim());
    if (!domain || domain.length < 3 || !domain.includes(".")) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    // Try RDAP first (HTTP-based, preferred)
    let result = await queryRdap(domain);

    // If RDAP returned partial data (missing key fields), supplement from WHOIS
    if (result && (!result.expiryDate || !result.registrar || !result.nameservers)) {
      const whoisResult = await queryWhois(domain);
      if (whoisResult) {
        result = {
          ...result,
          expiryDate: result.expiryDate || whoisResult.expiryDate,
          createdDate: result.createdDate || whoisResult.createdDate,
          updatedDate: result.updatedDate || whoisResult.updatedDate,
          registrar: result.registrar || whoisResult.registrar,
          registrarUrl: result.registrarUrl || whoisResult.registrarUrl,
          nameservers: result.nameservers || whoisResult.nameservers,
          registryStatus: result.registryStatus || whoisResult.registryStatus,
          daysUntilExpiry: result.daysUntilExpiry ?? whoisResult.daysUntilExpiry,
          dnssec: result.dnssec ?? whoisResult.dnssec,
          status: result.expiryDate ? result.status : whoisResult.status,
        };
      }
    }

    // Fall back to WHOIS entirely if RDAP failed
    if (!result) {
      result = await queryWhois(domain);
    }

    if (!result) {
      return NextResponse.json(
        { error: "Could not retrieve domain information. The domain may not exist or the registry is unavailable." },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
