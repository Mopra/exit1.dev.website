import * as tls from "tls";
import { NextRequest, NextResponse } from "next/server";

interface SSLResult {
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  protocol?: string;
  serialNumber?: string;
  fingerprint?: string;
  error?: string;
}

function checkSSL(hostname: string): Promise<SSLResult> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
        timeout: 10000,
      },
      () => {
        const cert = socket.getPeerCertificate();

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve({ valid: false, error: "No certificate received" });
          return;
        }

        const now = Date.now();
        const validFrom = new Date(cert.valid_from).getTime();
        const validTo = new Date(cert.valid_to).getTime();
        const daysUntilExpiry = Math.ceil(
          (validTo - now) / (1000 * 60 * 60 * 24)
        );
        const isValid = now >= validFrom && now <= validTo;

        socket.destroy();

        resolve({
          valid: isValid,
          issuer: cert.issuer?.CN || cert.issuer?.O || "Unknown",
          subject: cert.subject?.CN || cert.subject?.O || hostname,
          validFrom: new Date(cert.valid_from).toISOString(),
          validTo: new Date(cert.valid_to).toISOString(),
          daysUntilExpiry,
          protocol: socket.getProtocol() || undefined,
          serialNumber: cert.serialNumber || undefined,
          fingerprint: cert.fingerprint256 || cert.fingerprint || undefined,
          error: !isValid
            ? `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`
            : undefined,
        });
      }
    );

    socket.on("error", (error) => {
      socket.destroy();
      resolve({
        valid: false,
        error: `SSL connection failed: ${error.message}`,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ valid: false, error: "SSL connection timeout" });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Extract hostname from URL
    let hostname: string;
    try {
      const cleaned = url.trim().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
      if (!cleaned || cleaned.length < 3 || !cleaned.includes(".")) {
        return NextResponse.json(
          { error: "Invalid domain" },
          { status: 400 }
        );
      }
      hostname = cleaned;
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const result = await checkSSL(hostname);

    return NextResponse.json({ hostname, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
