import dns from "dns";
import * as tls from "tls";
import { NextRequest, NextResponse } from "next/server";

interface RedirectHop {
  url: string;
  statusCode: number;
}

interface CorsInfo {
  allowOrigin?: string;
  allowMethods?: string;
  allowHeaders?: string;
  allowCredentials?: string;
  exposeHeaders?: string;
  maxAge?: string;
}

interface SecurityHeaders {
  strictTransportSecurity?: string;
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
}

interface CachingInfo {
  cacheControl?: string;
  etag?: string;
  lastModified?: string;
  expires?: string;
  age?: string;
  vary?: string;
}

interface TlsInfo {
  protocol?: string;
  cipherSuite?: string;
  keySize?: number;
}

interface ApiStatusResult {
  url: string;
  finalUrl: string;
  status: "up" | "down" | "redirect" | "error";
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  isHttps: boolean;
  httpVersion?: string;
  method: string;
  contentType?: string;
  contentLength?: number;
  serverHeader?: string;
  poweredBy?: string;
  contentEncoding?: string;
  serverIp?: string;
  cors: CorsInfo | null;
  security: SecurityHeaders;
  securityGrade: string;
  securityReasons: string[];
  caching: CachingInfo | null;
  redirectChain: RedirectHop[];
  tlsInfo?: TlsInfo;
  responseBody?: string;
  responseBodyTruncated?: boolean;
  allHeaders: Record<string, string>;
  error?: string;
}

const ALLOWED_METHODS = ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
const MAX_BODY_SIZE = 2000;

// SSRF protection: block private/reserved IPs
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
  // IPv6 loopback / private
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

function checkTLS(hostname: string): Promise<TlsInfo | undefined> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(undefined), 5000);

    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: false, timeout: 5000 },
      () => {
        clearTimeout(timeout);
        const protocol = socket.getProtocol() || undefined;
        const cipher = socket.getCipher();
        const cert = socket.getPeerCertificate();
        socket.destroy();
        resolve({
          protocol,
          cipherSuite: cipher?.name,
          keySize: cert?.bits,
        });
      }
    );
    socket.on("error", () => { clearTimeout(timeout); socket.destroy(); resolve(undefined); });
    socket.on("timeout", () => { clearTimeout(timeout); socket.destroy(); resolve(undefined); });
  });
}

function extractCors(headers: Headers): CorsInfo | null {
  const allowOrigin = headers.get("access-control-allow-origin") || undefined;
  const allowMethods = headers.get("access-control-allow-methods") || undefined;
  const allowHeaders = headers.get("access-control-allow-headers") || undefined;
  const allowCredentials = headers.get("access-control-allow-credentials") || undefined;
  const exposeHeaders = headers.get("access-control-expose-headers") || undefined;
  const maxAge = headers.get("access-control-max-age") || undefined;

  if (!allowOrigin && !allowMethods && !allowHeaders && !allowCredentials) {
    return null;
  }

  return { allowOrigin, allowMethods, allowHeaders, allowCredentials, exposeHeaders, maxAge };
}

function extractSecurity(headers: Headers): SecurityHeaders {
  return {
    strictTransportSecurity: headers.get("strict-transport-security") || undefined,
    contentSecurityPolicy: headers.get("content-security-policy") || undefined,
    xFrameOptions: headers.get("x-frame-options") || undefined,
    xContentTypeOptions: headers.get("x-content-type-options") || undefined,
    referrerPolicy: headers.get("referrer-policy") || undefined,
    permissionsPolicy: headers.get("permissions-policy") || undefined,
  };
}

function extractCaching(headers: Headers): CachingInfo | null {
  const cacheControl = headers.get("cache-control") || undefined;
  const etag = headers.get("etag") || undefined;
  const lastModified = headers.get("last-modified") || undefined;
  const expires = headers.get("expires") || undefined;
  const age = headers.get("age") || undefined;
  const vary = headers.get("vary") || undefined;

  if (!cacheControl && !etag && !lastModified && !expires) {
    return null;
  }

  return { cacheControl, etag, lastModified, expires, age, vary };
}

function extractAllHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function computeSecurityGrade(
  security: SecurityHeaders,
  isHttps: boolean
): { grade: string; reasons: string[] } {
  let score = 100;
  const reasons: string[] = [];

  if (!isHttps) {
    score -= 30;
    reasons.push("Not using HTTPS — connection is not encrypted");
  } else {
    reasons.push("HTTPS enabled — connection is encrypted");
  }

  if (security.strictTransportSecurity) {
    if (security.strictTransportSecurity.includes("preload")) {
      score += 5;
      reasons.push("HSTS with preload — excellent transport security");
    } else {
      reasons.push("HSTS enabled — enforces HTTPS connections");
    }
  } else {
    score -= 15;
    reasons.push("Missing Strict-Transport-Security header");
  }

  if (security.contentSecurityPolicy) {
    reasons.push("Content-Security-Policy present — mitigates XSS attacks");
  } else {
    score -= 20;
    reasons.push("Missing Content-Security-Policy header");
  }

  if (security.xFrameOptions) {
    reasons.push("X-Frame-Options present — prevents clickjacking");
  } else {
    score -= 10;
    reasons.push("Missing X-Frame-Options header");
  }

  if (security.xContentTypeOptions) {
    reasons.push("X-Content-Type-Options present — prevents MIME sniffing");
  } else {
    score -= 10;
    reasons.push("Missing X-Content-Type-Options header");
  }

  if (security.referrerPolicy) {
    reasons.push("Referrer-Policy present — controls referrer information");
  } else {
    score -= 10;
    reasons.push("Missing Referrer-Policy header");
  }

  if (security.permissionsPolicy) {
    reasons.push("Permissions-Policy present — restricts browser features");
  } else {
    score -= 5;
    reasons.push("Missing Permissions-Policy header");
  }

  let grade: string;
  if (score >= 100) grade = "A+";
  else if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  return { grade, reasons };
}

async function readResponseBody(response: Response, contentType: string | undefined): Promise<{ body?: string; truncated: boolean }> {
  // Only read text-based responses
  const isText = contentType && (
    contentType.includes("json") ||
    contentType.includes("text") ||
    contentType.includes("xml") ||
    contentType.includes("html") ||
    contentType.includes("javascript") ||
    contentType.includes("css")
  );

  if (!isText) {
    return { truncated: false };
  }

  try {
    const text = await response.text();
    if (text.length > MAX_BODY_SIZE) {
      return { body: text.slice(0, MAX_BODY_SIZE), truncated: true };
    }
    return { body: text, truncated: false };
  } catch {
    return { truncated: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, method: rawMethod } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const method = ALLOWED_METHODS.includes((rawMethod || "").toUpperCase())
      ? (rawMethod as string).toUpperCase()
      : "GET";

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

    // Check TLS info in parallel (only for HTTPS)
    const tlsPromise = parsed.protocol === "https:" ? checkTLS(parsed.hostname) : Promise.resolve(undefined);

    // Follow redirects manually
    const redirectChain: RedirectHop[] = [];
    let currentUrl = targetUrl;
    let finalResponse: Response | null = null;
    const maxRedirects = 10;

    const startTime = performance.now();

    for (let i = 0; i <= maxRedirects; i++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(currentUrl, {
          method: i === 0 ? method : "GET", // Only use custom method on first request
          redirect: "manual",
          signal: controller.signal,
          headers: {
            "User-Agent": "exit1.dev API Status Checker/1.0",
            Accept: "*/*",
          },
        });
        clearTimeout(timeout);

        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get("location");
          if (location) {
            redirectChain.push({ url: currentUrl, statusCode: res.status });
            currentUrl = new URL(location, currentUrl).href;
            continue;
          }
        }

        finalResponse = res;
        break;
      } catch (err) {
        clearTimeout(timeout);

        const responseTimeMs = Math.round(performance.now() - startTime);

        const result: ApiStatusResult = {
          url: targetUrl,
          finalUrl: currentUrl,
          status: "error",
          statusCode: 0,
          statusText: err instanceof Error && err.name === "AbortError" ? "Timeout" : "Connection Failed",
          responseTimeMs,
          isHttps: currentUrl.startsWith("https://"),
          method,
          cors: null,
          security: {},
          securityGrade: "F",
          securityReasons: ["Connection failed — unable to assess security"],
          caching: null,
          redirectChain,
          allHeaders: {},
          error: err instanceof Error
            ? err.name === "AbortError"
              ? "Request timed out after 15 seconds"
              : err.message
            : "Connection failed",
        };

        return NextResponse.json(result);
      }
    }

    const responseTimeMs = Math.round(performance.now() - startTime);

    if (!finalResponse) {
      return NextResponse.json({
        url: targetUrl,
        finalUrl: currentUrl,
        status: "error",
        statusCode: 0,
        statusText: "Too Many Redirects",
        responseTimeMs,
        isHttps: currentUrl.startsWith("https://"),
        method,
        cors: null,
        security: {},
        securityGrade: "F",
        securityReasons: ["Too many redirects — unable to assess security"],
        caching: null,
        redirectChain,
        allHeaders: {},
        error: "Too many redirects (exceeded 10)",
      } satisfies ApiStatusResult);
    }

    const headers = finalResponse.headers;
    const isHttps = currentUrl.startsWith("https://");

    // Extract response info
    const contentType = headers.get("content-type") || undefined;
    const contentLengthRaw = headers.get("content-length");
    const contentLength = contentLengthRaw ? parseInt(contentLengthRaw, 10) : undefined;
    const serverHeader = headers.get("server") || undefined;
    const poweredBy = headers.get("x-powered-by") || undefined;
    const contentEncoding = headers.get("content-encoding") || undefined;

    // Extract all headers
    const allHeaders = extractAllHeaders(headers);

    // Read response body for text content
    const { body: responseBody, truncated: responseBodyTruncated } = await readResponseBody(finalResponse, contentType);

    // Extract security, CORS, caching
    const security = extractSecurity(headers);
    const cors = extractCors(headers);
    const caching = extractCaching(headers);

    // Compute security grade
    const { grade: securityGrade, reasons: securityReasons } = computeSecurityGrade(security, isHttps);

    // Wait for TLS info
    const tlsInfo = await tlsPromise;

    // Determine status
    let status: "up" | "down" | "redirect" | "error";
    if (finalResponse.status >= 200 && finalResponse.status < 300) {
      status = redirectChain.length > 0 ? "redirect" : "up";
    } else if (finalResponse.status >= 400) {
      status = "down";
    } else {
      status = "up";
    }

    const result: ApiStatusResult = {
      url: targetUrl,
      finalUrl: currentUrl,
      status,
      statusCode: finalResponse.status,
      statusText: finalResponse.statusText,
      responseTimeMs,
      isHttps,
      method,
      contentType,
      contentLength,
      serverHeader,
      poweredBy,
      contentEncoding,
      serverIp,
      cors,
      security,
      securityGrade,
      securityReasons,
      caching,
      redirectChain,
      tlsInfo,
      responseBody,
      responseBodyTruncated,
      allHeaders,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
