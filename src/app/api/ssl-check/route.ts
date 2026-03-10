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
  keySize?: number;
  signatureAlgorithm?: string;
  altNames?: string[];
  grade?: string;
  gradeReasons?: string[];
  error?: string;
}

function computeGrade(result: SSLResult): { grade: string; reasons: string[] } {
  if (!result.valid) return { grade: "F", reasons: ["Certificate is invalid or expired"] };

  let score = 100;
  const reasons: string[] = [];

  // Protocol scoring
  const proto = result.protocol || "";
  if (proto === "TLSv1.3") {
    reasons.push("TLS 1.3 — excellent protocol version");
  } else if (proto === "TLSv1.2") {
    score -= 5;
    reasons.push("TLS 1.2 — good, but TLS 1.3 is recommended");
  } else if (proto === "TLSv1.1") {
    score -= 30;
    reasons.push("TLS 1.1 — deprecated, upgrade immediately");
  } else if (proto === "TLSv1") {
    score -= 40;
    reasons.push("TLS 1.0 — insecure, upgrade immediately");
  } else if (proto.startsWith("SSL")) {
    score -= 60;
    reasons.push(`${proto} — critically insecure`);
  }

  // Key size scoring
  if (result.keySize) {
    if (result.keySize >= 4096) {
      reasons.push(`${result.keySize}-bit key — excellent`);
    } else if (result.keySize >= 2048) {
      reasons.push(`${result.keySize}-bit key — good`);
    } else if (result.keySize >= 1024) {
      score -= 20;
      reasons.push(`${result.keySize}-bit key — weak, upgrade to 2048+`);
    } else {
      score -= 40;
      reasons.push(`${result.keySize}-bit key — critically weak`);
    }
  }

  // Signature algorithm scoring
  const sig = (result.signatureAlgorithm || "").toLowerCase();
  if (sig.includes("sha256") || sig.includes("sha384") || sig.includes("sha512")) {
    reasons.push("Strong signature algorithm");
  } else if (sig.includes("sha1")) {
    score -= 20;
    reasons.push("SHA-1 signature — deprecated, should use SHA-256+");
  } else if (sig.includes("md5")) {
    score -= 40;
    reasons.push("MD5 signature — critically insecure");
  }

  // Expiry scoring
  if (result.daysUntilExpiry != null) {
    if (result.daysUntilExpiry <= 7) {
      score -= 15;
      reasons.push(`Expires in ${result.daysUntilExpiry} days — renew immediately`);
    } else if (result.daysUntilExpiry <= 30) {
      score -= 5;
      reasons.push(`Expires in ${result.daysUntilExpiry} days — renew soon`);
    } else {
      reasons.push(`${result.daysUntilExpiry} days until expiry`);
    }
  }

  // Map score to grade
  let grade: string;
  if (score >= 95) grade = "A+";
  else if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";

  return { grade, reasons };
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

        // Extract key size from bits field
        const keySize = cert.bits || undefined;

        // Extract signature algorithm
        // The raw cert object doesn't always expose this cleanly,
        // but we can get it from the asn1 parsed data if available
        const signatureAlgorithm =
          (cert as Record<string, unknown>).sigalg as string | undefined ||
          undefined;

        // Extract Subject Alternative Names
        const altNames = cert.subjectaltname
          ? cert.subjectaltname.split(", ").map((s: string) => s.replace("DNS:", ""))
          : undefined;

        const protocol = socket.getProtocol() || undefined;

        socket.destroy();

        const result: SSLResult = {
          valid: isValid,
          issuer: cert.issuer?.CN || cert.issuer?.O || "Unknown",
          subject: cert.subject?.CN || cert.subject?.O || hostname,
          validFrom: new Date(cert.valid_from).toISOString(),
          validTo: new Date(cert.valid_to).toISOString(),
          daysUntilExpiry,
          protocol,
          serialNumber: cert.serialNumber || undefined,
          fingerprint: cert.fingerprint256 || cert.fingerprint || undefined,
          keySize,
          signatureAlgorithm,
          altNames,
          error: !isValid
            ? `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`
            : undefined,
        };

        const { grade, reasons } = computeGrade(result);
        result.grade = grade;
        result.gradeReasons = reasons;

        resolve(result);
      }
    );

    socket.on("error", (error) => {
      socket.destroy();
      resolve({
        valid: false,
        grade: "F",
        gradeReasons: ["Connection failed"],
        error: `SSL connection failed: ${error.message}`,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({
        valid: false,
        grade: "F",
        gradeReasons: ["Connection timed out"],
        error: "SSL connection timeout",
      });
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
