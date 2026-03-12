import net from "net";
import dns from "dns";
import { NextRequest, NextResponse } from "next/server";

interface PingEntry {
  seq: number;
  timeMs: number | null;
  error?: string;
}

interface PingStats {
  sent: number;
  received: number;
  lost: number;
  lossPercent: number;
  minMs: number;
  avgMs: number;
  maxMs: number;
  jitterMs: number;
  stdDevMs: number;
}

interface PingResult {
  host: string;
  ip: string;
  reverseDns: string | null;
  port: number;
  dnsTimeMs: number;
  pings: PingEntry[];
  stats: PingStats;
  grade: string;
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
  if (ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) {
    return true;
  }
  return false;
}

function tcpPing(ip: string, port: number, timeoutMs: number): Promise<PingEntry & { seq: 0 }> {
  return new Promise((resolve) => {
    const start = performance.now();

    const socket = net.createConnection({ host: ip, port, timeout: timeoutMs }, () => {
      const timeMs = Math.round((performance.now() - start) * 100) / 100;
      socket.destroy();
      resolve({ seq: 0, timeMs });
    });

    socket.on("error", (err) => {
      socket.destroy();
      resolve({ seq: 0, timeMs: null, error: err.message });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ seq: 0, timeMs: null, error: "Timeout" });
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function computeGrade(avgMs: number, lossPercent: number, jitterMs: number): string {
  if (lossPercent === 100) return "F";
  let score = 100;
  // Latency penalty
  if (avgMs <= 30) score -= 0;
  else if (avgMs <= 60) score -= 5;
  else if (avgMs <= 100) score -= 15;
  else if (avgMs <= 200) score -= 30;
  else if (avgMs <= 500) score -= 50;
  else score -= 70;
  // Packet loss penalty
  score -= lossPercent * 2;
  // Jitter penalty
  if (jitterMs > 30) score -= 20;
  else if (jitterMs > 15) score -= 10;
  else if (jitterMs > 5) score -= 5;

  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

async function reverseDnsLookup(ip: string): Promise<string | null> {
  try {
    const hostnames = await dns.promises.reverse(ip);
    return hostnames.length > 0 ? hostnames[0] : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { host: rawHost, count: rawCount, port: rawPort } = body;

    if (!rawHost || typeof rawHost !== "string") {
      return NextResponse.json({ error: "Host is required" }, { status: 400 });
    }

    // Clean host: strip protocol, path, port, whitespace
    let host = rawHost.trim();
    host = host.replace(/^https?:\/\//, "");
    host = host.split("/")[0];
    host = host.split(":")[0];
    host = host.toLowerCase();

    if (!host || host.length < 1) {
      return NextResponse.json({ error: "Invalid host" }, { status: 400 });
    }

    const count = Math.min(Math.max(parseInt(String(rawCount)) || 4, 1), 10);
    const customPort = rawPort ? Math.min(Math.max(parseInt(String(rawPort)), 1), 65535) : null;

    // DNS resolution with timing
    let ip: string;
    let dnsTimeMs: number;

    // Check if host is already an IP
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      ip = host;
      dnsTimeMs = 0;
    } else {
      const dnsStart = performance.now();
      try {
        const result = await dns.promises.lookup(host);
        ip = result.address;
        dnsTimeMs = Math.round((performance.now() - dnsStart) * 100) / 100;
      } catch (err) {
        return NextResponse.json({
          error: `DNS resolution failed: ${err instanceof Error ? err.message : "Unknown host"}`,
        }, { status: 400 });
      }
    }

    // SSRF protection
    if (isPrivateIP(ip)) {
      return NextResponse.json({ error: "Cannot ping private/internal addresses" }, { status: 400 });
    }

    // Reverse DNS lookup (run in parallel with port probing)
    const reverseDnsPromise = reverseDnsLookup(ip);

    // Determine port: custom port, or auto-detect (443 then 80)
    let port: number;
    if (customPort) {
      port = customPort;
    } else {
      port = 443;
      const probe = await tcpPing(ip, 443, 3000);
      if (probe.timeMs === null) {
        const probe80 = await tcpPing(ip, 80, 3000);
        if (probe80.timeMs !== null) {
          port = 80;
        }
        // If both fail, still use 443 — the pings will show the failures
      }
    }

    // Run pings sequentially
    const pings: PingEntry[] = [];
    for (let i = 0; i < count; i++) {
      if (i > 0) await sleep(200);
      const result = await tcpPing(ip, port, 5000);
      pings.push({ seq: i + 1, timeMs: result.timeMs, error: result.error });
    }

    // Wait for reverse DNS
    const reverseDns = await reverseDnsPromise;

    // Compute statistics
    const successful = pings.filter((p) => p.timeMs !== null);
    const times = successful.map((p) => p.timeMs as number);

    const sent = pings.length;
    const received = successful.length;
    const lost = sent - received;
    const lossPercent = sent > 0 ? Math.round((lost / sent) * 100) : 100;

    const minMs = times.length > 0 ? Math.round(Math.min(...times) * 100) / 100 : 0;
    const maxMs = times.length > 0 ? Math.round(Math.max(...times) * 100) / 100 : 0;
    const avgMs = times.length > 0 ? Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 100) / 100 : 0;

    // Standard deviation
    let stdDevMs = 0;
    if (times.length > 1) {
      const variance = times.reduce((sum, t) => sum + Math.pow(t - avgMs, 2), 0) / times.length;
      stdDevMs = Math.round(Math.sqrt(variance) * 100) / 100;
    }

    // Jitter: average difference between consecutive successful pings
    let jitterMs = 0;
    if (times.length > 1) {
      let totalDiff = 0;
      for (let i = 1; i < times.length; i++) {
        totalDiff += Math.abs(times[i] - times[i - 1]);
      }
      jitterMs = Math.round((totalDiff / (times.length - 1)) * 100) / 100;
    }

    const grade = computeGrade(avgMs, lossPercent, jitterMs);

    const result: PingResult = {
      host,
      ip,
      reverseDns,
      port,
      dnsTimeMs,
      pings,
      stats: { sent, received, lost, lossPercent, minMs, avgMs, maxMs, jitterMs, stdDevMs },
      grade,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: `Ping failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
