import dns from "dns";
import * as tls from "tls";
import { NextRequest, NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RedirectHop {
  url: string;
  statusCode: number;
}

interface DnsResult {
  resolved: boolean;
  ip?: string;
  resolutionTimeMs: number;
  hasIPv6?: boolean;
  error?: string;
}

interface SslResult {
  valid: boolean;
  issuer?: string;
  subject?: string;
  protocol?: string;
  cipherSuite?: string;
  keySize?: number;
  expiresAt?: string;
  daysUntilExpiry?: number;
  selfSigned?: boolean;
  error?: string;
}

interface RedirectResult {
  chain: RedirectHop[];
  finalUrl: string;
  httpToHttps: boolean;
  count: number;
}

interface ResponseResult {
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  ttfbMs: number;
  serverHeader?: string;
  poweredBy?: string;
  contentType?: string;
  isUp: boolean;
  error?: string;
}

interface PerformanceResult {
  totalTimeMs: number;
  contentSize?: number;
  contentEncoding?: string;
  compressed: boolean;
  httpVersion?: string;
}

interface SecurityHeadersResult {
  strictTransportSecurity?: string;
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

interface ContentResult {
  hasTitle: boolean;
  title?: string;
  hasMetaDescription: boolean;
  metaDescription?: string;
  hasFavicon: boolean;
  contentLength: number;
  isErrorPage: boolean;
}

interface CategoryGrade {
  grade: string;
  score: number;
  reasons: string[];
}

interface UptimeCheckResult {
  url: string;
  checkedAt: string;
  overallGrade: string;
  overallScore: number;
  isUp: boolean;

  dns: DnsResult;
  dnsGrade: CategoryGrade;

  ssl: SslResult | null;
  sslGrade: CategoryGrade | null;

  redirects: RedirectResult;
  redirectGrade: CategoryGrade;

  response: ResponseResult;
  responseGrade: CategoryGrade;

  performance: PerformanceResult;
  performanceGrade: CategoryGrade;

  securityHeaders: SecurityHeadersResult;
  securityGrade: CategoryGrade;

  content: ContentResult;
  contentGrade: CategoryGrade;

  error?: string;
}

/* ------------------------------------------------------------------ */
/*  SSRF protection                                                    */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Grade helpers                                                      */
/* ------------------------------------------------------------------ */

function scoreToGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function computeOverallGrade(grades: CategoryGrade[]): { grade: string; score: number } {
  const total = grades.reduce((sum, g) => sum + g.score, 0);
  const avg = Math.round(total / grades.length);
  return { grade: scoreToGrade(avg), score: avg };
}

/* ------------------------------------------------------------------ */
/*  DNS check                                                          */
/* ------------------------------------------------------------------ */

async function checkDns(hostname: string): Promise<{ result: DnsResult; grade: CategoryGrade }> {
  const reasons: string[] = [];
  let score = 100;

  const start = performance.now();
  try {
    const { address } = await dns.promises.lookup(hostname);
    const resolutionTimeMs = Math.round(performance.now() - start);

    // Check IPv6
    let hasIPv6 = false;
    try {
      await dns.promises.resolve6(hostname);
      hasIPv6 = true;
    } catch { /* no IPv6 */ }

    if (resolutionTimeMs <= 50) {
      reasons.push(`DNS resolved in ${resolutionTimeMs}ms — excellent`);
    } else if (resolutionTimeMs <= 100) {
      reasons.push(`DNS resolved in ${resolutionTimeMs}ms — good`);
    } else if (resolutionTimeMs <= 300) {
      score -= 10;
      reasons.push(`DNS resolved in ${resolutionTimeMs}ms — slow`);
    } else {
      score -= 25;
      reasons.push(`DNS resolved in ${resolutionTimeMs}ms — very slow`);
    }

    if (hasIPv6) {
      reasons.push("IPv6 (AAAA) record found — dual-stack ready");
    } else {
      score -= 5;
      reasons.push("No IPv6 (AAAA) record — IPv4 only");
    }

    return {
      result: { resolved: true, ip: address, resolutionTimeMs, hasIPv6 },
      grade: { grade: scoreToGrade(score), score, reasons },
    };
  } catch (err) {
    const resolutionTimeMs = Math.round(performance.now() - start);
    return {
      result: { resolved: false, resolutionTimeMs, error: err instanceof Error ? err.message : "DNS resolution failed" },
      grade: { grade: "F", score: 0, reasons: ["DNS resolution failed — domain may not exist or nameservers are unreachable"] },
    };
  }
}

/* ------------------------------------------------------------------ */
/*  SSL check                                                          */
/* ------------------------------------------------------------------ */

function checkSsl(hostname: string): Promise<{ result: SslResult | null; grade: CategoryGrade | null }> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ result: null, grade: null });
    }, 8000);

    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: false, timeout: 8000 },
      () => {
        clearTimeout(timeout);
        try {
          const protocol = socket.getProtocol() || undefined;
          const cipher = socket.getCipher();
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          socket.destroy();

          const expiresAt = cert.valid_to ? new Date(cert.valid_to).toISOString() : undefined;
          const daysUntilExpiry = cert.valid_to
            ? Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : undefined;

          const selfSigned = cert.issuer && cert.subject
            ? JSON.stringify(cert.issuer) === JSON.stringify(cert.subject)
            : false;

          const result: SslResult = {
            valid: authorized,
            issuer: cert.issuer?.O || cert.issuer?.CN,
            subject: cert.subject?.CN,
            protocol,
            cipherSuite: cipher?.name,
            keySize: cert.bits,
            expiresAt,
            daysUntilExpiry,
            selfSigned,
          };

          // Grade
          let score = 100;
          const reasons: string[] = [];

          if (authorized) {
            reasons.push("Certificate is trusted by browsers");
          } else {
            score -= 30;
            reasons.push("Certificate is NOT trusted — browsers will show warnings");
          }

          if (selfSigned) {
            score -= 20;
            reasons.push("Self-signed certificate detected");
          }

          if (protocol === "TLSv1.3") {
            reasons.push("TLS 1.3 — latest protocol, excellent");
          } else if (protocol === "TLSv1.2") {
            score -= 5;
            reasons.push("TLS 1.2 — secure but not the latest");
          } else {
            score -= 30;
            reasons.push(`${protocol || "Unknown protocol"} — outdated, should upgrade`);
          }

          if (daysUntilExpiry !== undefined) {
            if (daysUntilExpiry <= 0) {
              score -= 40;
              reasons.push("Certificate has EXPIRED");
            } else if (daysUntilExpiry <= 7) {
              score -= 25;
              reasons.push(`Certificate expires in ${daysUntilExpiry} days — critical`);
            } else if (daysUntilExpiry <= 30) {
              score -= 10;
              reasons.push(`Certificate expires in ${daysUntilExpiry} days — renew soon`);
            } else {
              reasons.push(`Certificate expires in ${daysUntilExpiry} days`);
            }
          }

          if (cert.bits) {
            if (cert.bits >= 2048) {
              reasons.push(`Key size: ${cert.bits}-bit — strong`);
            } else {
              score -= 15;
              reasons.push(`Key size: ${cert.bits}-bit — weak, use 2048+ bit keys`);
            }
          }

          resolve({
            result,
            grade: { grade: scoreToGrade(score), score, reasons },
          });
        } catch {
          socket.destroy();
          resolve({ result: null, grade: null });
        }
      }
    );
    socket.on("error", () => { clearTimeout(timeout); socket.destroy(); resolve({ result: null, grade: null }); });
    socket.on("timeout", () => { clearTimeout(timeout); socket.destroy(); resolve({ result: null, grade: null }); });
  });
}

/* ------------------------------------------------------------------ */
/*  HTTP request with redirect tracking                                */
/* ------------------------------------------------------------------ */

async function checkHttp(targetUrl: string): Promise<{
  response: Response | null;
  redirectChain: RedirectHop[];
  finalUrl: string;
  ttfbMs: number;
  totalTimeMs: number;
  error?: string;
}> {
  const redirectChain: RedirectHop[] = [];
  let currentUrl = targetUrl;
  const maxRedirects = 10;

  const totalStart = performance.now();
  let ttfbMs = 0;

  for (let i = 0; i <= maxRedirects; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const reqStart = performance.now();
      const res = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "exit1.dev Uptime Checker/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);

      if (i === 0 || ttfbMs === 0) {
        ttfbMs = Math.round(performance.now() - reqStart);
      }

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (location) {
          redirectChain.push({ url: currentUrl, statusCode: res.status });
          currentUrl = new URL(location, currentUrl).href;
          continue;
        }
      }

      return {
        response: res,
        redirectChain,
        finalUrl: currentUrl,
        ttfbMs,
        totalTimeMs: Math.round(performance.now() - totalStart),
      };
    } catch (err) {
      clearTimeout(timeout);
      return {
        response: null,
        redirectChain,
        finalUrl: currentUrl,
        ttfbMs: Math.round(performance.now() - totalStart),
        totalTimeMs: Math.round(performance.now() - totalStart),
        error: err instanceof Error
          ? err.name === "AbortError" ? "Request timed out after 15 seconds" : err.message
          : "Connection failed",
      };
    }
  }

  return {
    response: null,
    redirectChain,
    finalUrl: currentUrl,
    ttfbMs,
    totalTimeMs: Math.round(performance.now() - totalStart),
    error: "Too many redirects (exceeded 10)",
  };
}

/* ------------------------------------------------------------------ */
/*  Security headers grading                                           */
/* ------------------------------------------------------------------ */

function gradeSecurityHeaders(headers: SecurityHeadersResult, isHttps: boolean): CategoryGrade {
  let score = 100;
  const reasons: string[] = [];

  if (!isHttps) {
    score -= 30;
    reasons.push("Not using HTTPS — connection is not encrypted");
  } else {
    reasons.push("HTTPS enabled — connection is encrypted");
  }

  if (headers.strictTransportSecurity) {
    if (headers.strictTransportSecurity.includes("preload")) {
      score += 5;
      reasons.push("HSTS with preload — excellent transport security");
    } else {
      reasons.push("HSTS enabled — enforces HTTPS connections");
    }
  } else {
    score -= 15;
    reasons.push("Missing Strict-Transport-Security header");
  }

  if (headers.contentSecurityPolicy) {
    reasons.push("Content-Security-Policy present — mitigates XSS attacks");
  } else {
    score -= 20;
    reasons.push("Missing Content-Security-Policy header");
  }

  if (headers.xFrameOptions) {
    reasons.push("X-Frame-Options present — prevents clickjacking");
  } else {
    score -= 10;
    reasons.push("Missing X-Frame-Options header");
  }

  if (headers.xContentTypeOptions) {
    reasons.push("X-Content-Type-Options present — prevents MIME sniffing");
  } else {
    score -= 10;
    reasons.push("Missing X-Content-Type-Options header");
  }

  if (headers.referrerPolicy) {
    reasons.push("Referrer-Policy present — controls referrer information");
  } else {
    score -= 10;
    reasons.push("Missing Referrer-Policy header");
  }

  if (headers.permissionsPolicy) {
    reasons.push("Permissions-Policy present — restricts browser features");
  } else {
    score -= 5;
    reasons.push("Missing Permissions-Policy header");
  }

  return { grade: scoreToGrade(score), score, reasons };
}

/* ------------------------------------------------------------------ */
/*  Content analysis                                                   */
/* ------------------------------------------------------------------ */

function analyzeContent(body: string): ContentResult {
  const titleMatch = body.match(/<title[^>]*>([^<]*)<\/title>/i);
  const hasTitle = !!titleMatch && titleMatch[1].trim().length > 0;
  const title = titleMatch ? titleMatch[1].trim() : undefined;

  const metaDescMatch = body.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || body.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const hasMetaDescription = !!metaDescMatch && metaDescMatch[1].trim().length > 0;
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : undefined;

  const hasFavicon = /(<link[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*>)/i.test(body)
    || body.includes("favicon");

  // Error page detection: check for common error patterns
  const errorPatterns = [
    /4\d{2}\s*(error|not found|forbidden|unauthorized)/i,
    /5\d{2}\s*(error|internal server|bad gateway|service unavailable)/i,
    /page\s*(not|couldn.t)\s*(be\s*)?found/i,
    /server\s*error/i,
    /access\s*denied/i,
  ];
  const isErrorPage = errorPatterns.some((p) => p.test(body)) && body.length < 5000;

  return {
    hasTitle,
    title,
    hasMetaDescription,
    metaDescription,
    hasFavicon,
    contentLength: body.length,
    isErrorPage,
  };
}

function gradeContent(content: ContentResult): CategoryGrade {
  let score = 100;
  const reasons: string[] = [];

  if (content.isErrorPage) {
    score -= 40;
    reasons.push("Page appears to be an error page");
  } else {
    reasons.push("Page returns valid content");
  }

  if (content.hasTitle) {
    reasons.push(`Page has <title> tag: "${content.title!.slice(0, 60)}${content.title!.length > 60 ? "..." : ""}"`);
  } else {
    score -= 20;
    reasons.push("Missing <title> tag — bad for SEO");
  }

  if (content.hasMetaDescription) {
    reasons.push("Meta description present — good for SEO");
  } else {
    score -= 10;
    reasons.push("Missing meta description — bad for SEO");
  }

  if (content.hasFavicon) {
    reasons.push("Favicon detected");
  } else {
    score -= 5;
    reasons.push("No favicon detected");
  }

  if (content.contentLength < 500 && !content.isErrorPage) {
    score -= 10;
    reasons.push("Very small page content — may indicate issues");
  } else if (content.contentLength >= 500) {
    reasons.push(`Page content: ${(content.contentLength / 1024).toFixed(1)} KB`);
  }

  return { grade: scoreToGrade(score), score, reasons };
}

/* ------------------------------------------------------------------ */
/*  Redirect grading                                                   */
/* ------------------------------------------------------------------ */

function gradeRedirects(redirects: RedirectResult): CategoryGrade {
  let score = 100;
  const reasons: string[] = [];

  if (redirects.httpToHttps) {
    reasons.push("HTTP → HTTPS redirect in place — good");
  }

  if (redirects.count === 0) {
    reasons.push("No redirects — direct access");
  } else if (redirects.count === 1) {
    score -= 5;
    reasons.push(`1 redirect — minimal overhead`);
  } else if (redirects.count <= 3) {
    score -= 15;
    reasons.push(`${redirects.count} redirects — consider reducing the chain`);
  } else {
    score -= 30;
    reasons.push(`${redirects.count} redirects — excessive, will slow down page load`);
  }

  return { grade: scoreToGrade(score), score, reasons };
}

/* ------------------------------------------------------------------ */
/*  Response grading                                                   */
/* ------------------------------------------------------------------ */

function gradeResponse(res: ResponseResult): CategoryGrade {
  let score = 100;
  const reasons: string[] = [];

  if (!res.isUp) {
    return { grade: "F", score: 0, reasons: [res.error || "Website is down or unreachable"] };
  }

  if (res.statusCode >= 200 && res.statusCode < 300) {
    reasons.push(`HTTP ${res.statusCode} — healthy response`);
  } else if (res.statusCode >= 300 && res.statusCode < 400) {
    score -= 10;
    reasons.push(`HTTP ${res.statusCode} — redirect`);
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    score -= 40;
    reasons.push(`HTTP ${res.statusCode} — client error`);
  } else {
    score -= 50;
    reasons.push(`HTTP ${res.statusCode} — server error`);
  }

  if (res.ttfbMs <= 200) {
    reasons.push(`TTFB: ${res.ttfbMs}ms — excellent`);
  } else if (res.ttfbMs <= 500) {
    score -= 5;
    reasons.push(`TTFB: ${res.ttfbMs}ms — good`);
  } else if (res.ttfbMs <= 1000) {
    score -= 15;
    reasons.push(`TTFB: ${res.ttfbMs}ms — slow`);
  } else {
    score -= 30;
    reasons.push(`TTFB: ${res.ttfbMs}ms — very slow`);
  }

  if (res.responseTimeMs <= 500) {
    reasons.push(`Total response: ${res.responseTimeMs}ms — fast`);
  } else if (res.responseTimeMs <= 1500) {
    score -= 5;
    reasons.push(`Total response: ${res.responseTimeMs}ms — acceptable`);
  } else {
    score -= 15;
    reasons.push(`Total response: ${res.responseTimeMs}ms — slow`);
  }

  return { grade: scoreToGrade(score), score, reasons };
}

/* ------------------------------------------------------------------ */
/*  Performance grading                                                */
/* ------------------------------------------------------------------ */

function gradePerformance(perf: PerformanceResult): CategoryGrade {
  let score = 100;
  const reasons: string[] = [];

  if (perf.compressed) {
    reasons.push(`Compression enabled (${perf.contentEncoding}) — good`);
  } else {
    score -= 15;
    reasons.push("No compression detected — enable gzip or brotli");
  }

  if (perf.contentSize !== undefined) {
    if (perf.contentSize <= 100_000) {
      reasons.push(`Content size: ${(perf.contentSize / 1024).toFixed(1)} KB — lightweight`);
    } else if (perf.contentSize <= 500_000) {
      score -= 5;
      reasons.push(`Content size: ${(perf.contentSize / 1024).toFixed(1)} KB — moderate`);
    } else {
      score -= 15;
      reasons.push(`Content size: ${(perf.contentSize / 1024).toFixed(1)} KB — heavy, consider optimizing`);
    }
  }

  if (perf.httpVersion) {
    if (perf.httpVersion.includes("2") || perf.httpVersion.includes("3")) {
      reasons.push(`HTTP/${perf.httpVersion.replace(/.*(\d)/, "$1")} — modern protocol`);
    } else {
      score -= 10;
      reasons.push("HTTP/1.1 — consider upgrading to HTTP/2 or HTTP/3");
    }
  }

  if (perf.totalTimeMs <= 1000) {
    reasons.push(`Total load time: ${perf.totalTimeMs}ms — fast`);
  } else if (perf.totalTimeMs <= 3000) {
    score -= 10;
    reasons.push(`Total load time: ${perf.totalTimeMs}ms — could be faster`);
  } else {
    score -= 25;
    reasons.push(`Total load time: ${perf.totalTimeMs}ms — slow`);
  }

  return { grade: scoreToGrade(score), score, reasons };
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                       */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

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

    // SSRF protection
    const { result: dnsResult, grade: dnsGrade } = await checkDns(parsed.hostname);

    if (dnsResult.ip && isPrivateIP(dnsResult.ip)) {
      return NextResponse.json({ error: "Cannot check private/internal addresses" }, { status: 400 });
    }

    if (!dnsResult.resolved) {
      const result: UptimeCheckResult = {
        url: targetUrl,
        checkedAt: new Date().toISOString(),
        overallGrade: "F",
        overallScore: 0,
        isUp: false,
        dns: dnsResult,
        dnsGrade,
        ssl: null,
        sslGrade: null,
        redirects: { chain: [], finalUrl: targetUrl, httpToHttps: false, count: 0 },
        redirectGrade: { grade: "F", score: 0, reasons: ["Cannot check redirects — DNS failed"] },
        response: { statusCode: 0, statusText: "DNS Failed", responseTimeMs: 0, ttfbMs: 0, isUp: false, error: "DNS resolution failed" },
        responseGrade: { grade: "F", score: 0, reasons: ["Website unreachable — DNS resolution failed"] },
        performance: { totalTimeMs: 0, compressed: false },
        performanceGrade: { grade: "F", score: 0, reasons: ["Cannot measure performance — site unreachable"] },
        securityHeaders: {},
        securityGrade: { grade: "F", score: 0, reasons: ["Cannot check security — site unreachable"] },
        content: { hasTitle: false, hasMetaDescription: false, hasFavicon: false, contentLength: 0, isErrorPage: false },
        contentGrade: { grade: "F", score: 0, reasons: ["Cannot check content — site unreachable"] },
        error: "DNS resolution failed",
      };
      return NextResponse.json(result);
    }

    // Run SSL check in parallel with HTTP request
    const isHttps = parsed.protocol === "https:";
    const sslPromise = isHttps ? checkSsl(parsed.hostname) : Promise.resolve({ result: null, grade: null });

    // Also check HTTP→HTTPS redirect
    const httpRedirectPromise = isHttps
      ? (async () => {
          try {
            const httpUrl = targetUrl.replace(/^https:/, "http:");
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(httpUrl, { method: "HEAD", redirect: "manual", signal: controller.signal, headers: { "User-Agent": "exit1.dev Uptime Checker/1.0" } });
            clearTimeout(t);
            if (res.status >= 300 && res.status < 400) {
              const loc = res.headers.get("location") || "";
              return loc.startsWith("https://");
            }
            return false;
          } catch {
            return false;
          }
        })()
      : Promise.resolve(false);

    // Main HTTP check
    const httpResult = await checkHttp(targetUrl);
    const [{ result: sslResult, grade: sslGrade }, httpToHttps] = await Promise.all([sslPromise, httpRedirectPromise]);

    // Build redirect result
    const redirects: RedirectResult = {
      chain: httpResult.redirectChain,
      finalUrl: httpResult.finalUrl,
      httpToHttps,
      count: httpResult.redirectChain.length,
    };
    const redirectGrade = gradeRedirects(redirects);

    // If no response at all
    if (!httpResult.response) {
      const responseResult: ResponseResult = {
        statusCode: 0,
        statusText: "Unreachable",
        responseTimeMs: httpResult.totalTimeMs,
        ttfbMs: httpResult.ttfbMs,
        isUp: false,
        error: httpResult.error,
      };
      const responseGr = gradeResponse(responseResult);
      const allGrades = [dnsGrade, redirectGrade, responseGr];
      if (sslGrade) allGrades.push(sslGrade);
      const { grade: overallGrade, score: overallScore } = computeOverallGrade(allGrades);

      const result: UptimeCheckResult = {
        url: targetUrl,
        checkedAt: new Date().toISOString(),
        overallGrade,
        overallScore,
        isUp: false,
        dns: dnsResult,
        dnsGrade,
        ssl: sslResult,
        sslGrade,
        redirects,
        redirectGrade,
        response: responseResult,
        responseGrade: responseGr,
        performance: { totalTimeMs: httpResult.totalTimeMs, compressed: false },
        performanceGrade: { grade: "F", score: 0, reasons: ["Cannot measure performance — connection failed"] },
        securityHeaders: {},
        securityGrade: { grade: "F", score: 0, reasons: ["Cannot check security — connection failed"] },
        content: { hasTitle: false, hasMetaDescription: false, hasFavicon: false, contentLength: 0, isErrorPage: false },
        contentGrade: { grade: "F", score: 0, reasons: ["Cannot check content — connection failed"] },
        error: httpResult.error,
      };
      return NextResponse.json(result);
    }

    const res = httpResult.response;
    const headers = res.headers;
    const finalIsHttps = httpResult.finalUrl.startsWith("https://");

    // Response result
    const responseResult: ResponseResult = {
      statusCode: res.status,
      statusText: res.statusText,
      responseTimeMs: httpResult.totalTimeMs,
      ttfbMs: httpResult.ttfbMs,
      serverHeader: headers.get("server") || undefined,
      poweredBy: headers.get("x-powered-by") || undefined,
      contentType: headers.get("content-type") || undefined,
      isUp: res.status >= 200 && res.status < 400,
    };
    const responseGr = gradeResponse(responseResult);

    // Security headers
    const securityHeaders: SecurityHeadersResult = {
      strictTransportSecurity: headers.get("strict-transport-security") || undefined,
      contentSecurityPolicy: headers.get("content-security-policy") || undefined,
      xFrameOptions: headers.get("x-frame-options") || undefined,
      xContentTypeOptions: headers.get("x-content-type-options") || undefined,
      referrerPolicy: headers.get("referrer-policy") || undefined,
      permissionsPolicy: headers.get("permissions-policy") || undefined,
    };
    const securityGr = gradeSecurityHeaders(securityHeaders, finalIsHttps);

    // Read body for content analysis
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch { /* empty */ }

    // Content analysis
    const contentResult = analyzeContent(bodyText);
    const contentGr = gradeContent(contentResult);

    // Performance
    const contentLengthHeader = headers.get("content-length");
    const contentSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : bodyText.length;
    const contentEncoding = headers.get("content-encoding") || undefined;
    const performanceResult: PerformanceResult = {
      totalTimeMs: httpResult.totalTimeMs,
      contentSize,
      contentEncoding,
      compressed: !!contentEncoding && ["gzip", "br", "deflate", "zstd"].includes(contentEncoding),
      httpVersion: undefined, // Not available from fetch API
    };
    const performanceGr = gradePerformance(performanceResult);

    // Overall grade
    const allGrades = [dnsGrade, redirectGrade, responseGr, performanceGr, securityGr, contentGr];
    if (sslGrade) allGrades.push(sslGrade);
    const { grade: overallGrade, score: overallScore } = computeOverallGrade(allGrades);

    const result: UptimeCheckResult = {
      url: targetUrl,
      checkedAt: new Date().toISOString(),
      overallGrade,
      overallScore,
      isUp: responseResult.isUp,
      dns: dnsResult,
      dnsGrade,
      ssl: sslResult,
      sslGrade,
      redirects,
      redirectGrade,
      response: responseResult,
      responseGrade: responseGr,
      performance: performanceResult,
      performanceGrade: performanceGr,
      securityHeaders,
      securityGrade: securityGr,
      content: contentResult,
      contentGrade: contentGr,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
