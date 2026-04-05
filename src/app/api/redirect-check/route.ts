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

async function resolveAndValidateHost(hostname: string): Promise<void> {
  let address: string;
  try {
    const result = await dns.promises.lookup(hostname);
    address = result.address;
  } catch {
    throw new Error(`DNS resolution failed for ${hostname}`);
  }
  if (isPrivateIP(address)) {
    throw new Error("Cannot check private/internal addresses");
  }
}

function extractAllHeaders(headers: Headers): Record<string, string> {
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
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(targetUrl)) {
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

    // SSRF: resolve and block private IPs for the initial URL
    try {
      await resolveAndValidateHost(parsed.hostname);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "DNS resolution failed" },
        { status: 400 }
      );
    }

    const chain: RedirectHop[] = [];
    const visitedUrls = new Set<string>();
    let currentUrl = targetUrl;
    const maxRedirects = 10;
    const overallStart = performance.now();

    for (let i = 0; i <= maxRedirects; i++) {
      // SSRF check for each hop (redirects could point to internal IPs)
      if (i > 0) {
        try {
          const hopParsed = new URL(currentUrl);
          if (!["http:", "https:"].includes(hopParsed.protocol)) {
            const totalTimeMs = Math.round(performance.now() - overallStart);
            const result: RedirectCheckResult = {
              inputUrl: targetUrl,
              finalUrl: currentUrl,
              totalHops: chain.length,
              totalTimeMs,
              isRedirect: chain.length > 0,
              finalStatusCode: 0,
              finalStatusText: "Invalid Protocol",
              chain,
              error: `Redirect pointed to non-HTTP(S) URL: ${currentUrl}`,
            };
            return NextResponse.json(result);
          }
          await resolveAndValidateHost(hopParsed.hostname);
        } catch (err) {
          const totalTimeMs = Math.round(performance.now() - overallStart);
          const result: RedirectCheckResult = {
            inputUrl: targetUrl,
            finalUrl: currentUrl,
            totalHops: chain.length,
            totalTimeMs,
            isRedirect: chain.length > 0,
            finalStatusCode: 0,
            finalStatusText: "Blocked",
            chain,
            error: err instanceof Error ? err.message : "Redirect target blocked",
          };
          return NextResponse.json(result);
        }
      }

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

        const hopTimeMs = Math.round(performance.now() - hopStart);
        const responseHeaders = extractAllHeaders(res.headers);
        const location = res.headers.get("location");
        const server = res.headers.get("server") || undefined;

        const hop: RedirectHop = {
          url: currentUrl,
          statusCode: res.status,
          statusText: res.statusText,
          location,
          responseTimeMs: hopTimeMs,
          server,
          headers: responseHeaders,
        };

        // If it's a redirect with a location header, continue following
        if (res.status >= 300 && res.status < 400 && location) {
          chain.push(hop);
          const nextUrl = new URL(location, currentUrl).href;

          // Detect redirect loops
          if (visitedUrls.has(nextUrl)) {
            const totalTimeMs = Math.round(performance.now() - overallStart);
            return NextResponse.json({
              inputUrl: targetUrl,
              finalUrl: nextUrl,
              totalHops: chain.length,
              totalTimeMs,
              isRedirect: true,
              finalStatusCode: res.status,
              finalStatusText: res.statusText,
              chain,
              error: `Redirect loop detected: ${nextUrl} was already visited`,
            } satisfies RedirectCheckResult);
          }

          visitedUrls.add(currentUrl);
          currentUrl = nextUrl;
          continue;
        }

        // Final response (non-redirect or no location header)
        chain.push(hop);
        const totalTimeMs = Math.round(performance.now() - overallStart);

        const result: RedirectCheckResult = {
          inputUrl: targetUrl,
          finalUrl: currentUrl,
          totalHops: chain.length - 1, // Don't count the final response
          totalTimeMs,
          isRedirect: chain.length > 1,
          finalStatusCode: res.status,
          finalStatusText: res.statusText,
          chain,
        };

        return NextResponse.json(result);
      } catch (err) {
        clearTimeout(timeout);
        const totalTimeMs = Math.round(performance.now() - overallStart);

        const isTimeout = err instanceof Error && err.name === "AbortError";
        const result: RedirectCheckResult = {
          inputUrl: targetUrl,
          finalUrl: currentUrl,
          totalHops: chain.length,
          totalTimeMs,
          isRedirect: chain.length > 0,
          finalStatusCode: 0,
          finalStatusText: isTimeout ? "Timeout" : "Connection Failed",
          chain,
          error: isTimeout
            ? "Request timed out after 10 seconds"
            : err instanceof Error
              ? err.message
              : "Connection failed",
        };

        return NextResponse.json(result);
      }
    }

    // Too many redirects
    const totalTimeMs = Math.round(performance.now() - overallStart);
    const result: RedirectCheckResult = {
      inputUrl: targetUrl,
      finalUrl: currentUrl,
      totalHops: chain.length,
      totalTimeMs,
      isRedirect: true,
      finalStatusCode: 0,
      finalStatusText: "Too Many Redirects",
      chain,
      error: "Too many redirects (exceeded 10)",
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
