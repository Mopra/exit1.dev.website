import * as tls from "tls";
import * as https from "https";
import { NextRequest, NextResponse } from "next/server";

interface ChainCert {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  isSelfSigned: boolean;
}

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
  // New fields
  cipherSuite?: string;
  cipherVersion?: string;
  browserTrusted?: boolean;
  browserTrustedReason?: string;
  chain?: ChainCert[];
  hsts?: boolean;
  hstsMaxAge?: number;
  hstsIncludeSubdomains?: boolean;
  hstsPreload?: boolean;
  certType?: string; // DV, OV, EV
  hostnameMatch?: boolean;
}

function detectCertType(issuerOrg: string, subject: Record<string, string> | undefined): string {
  // EV certs typically have serialNumber and businessCategory in subject,
  // and the issuer org often contains "Extended Validation"
  const issuerLower = (issuerOrg || "").toLowerCase();
  const subjectO = (subject as Record<string, string | undefined>)?.O || "";
  const subjectSerialNumber = (subject as Record<string, string | undefined>)?.serialNumber || "";

  if (
    issuerLower.includes("extended validation") ||
    issuerLower.includes(" ev ") ||
    subjectSerialNumber
  ) {
    return "EV";
  }

  // OV certs have an Organization (O) field in the subject
  if (subjectO && subjectO.length > 0) {
    return "OV";
  }

  // DV certs have no organization info
  return "DV";
}

function computeGrade(result: SSLResult): { grade: string; reasons: string[] } {
  if (!result.valid) return { grade: "F", reasons: ["Certificate is invalid or expired"] };

  let score = 100;
  const reasons: string[] = [];

  // Browser trust
  if (result.browserTrusted === false) {
    score -= 25;
    reasons.push("Not trusted by browsers — " + (result.browserTrustedReason || "unknown reason"));
  } else if (result.browserTrusted === true) {
    reasons.push("Trusted by browsers");
  }

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

  // Cipher suite scoring
  const cipher = (result.cipherSuite || "").toUpperCase();
  if (cipher) {
    if (cipher.includes("CHACHA20") || cipher.includes("AES_256_GCM") || cipher.includes("AES_128_GCM")) {
      reasons.push(`Strong cipher: ${result.cipherSuite}`);
    } else if (cipher.includes("AES")) {
      reasons.push(`Acceptable cipher: ${result.cipherSuite}`);
    } else if (cipher.includes("RC4") || cipher.includes("DES") || cipher.includes("3DES")) {
      score -= 25;
      reasons.push(`Weak cipher: ${result.cipherSuite} — upgrade immediately`);
    } else {
      reasons.push(`Cipher: ${result.cipherSuite}`);
    }
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

  // HSTS scoring
  if (result.hsts) {
    if (result.hstsPreload && result.hstsIncludeSubdomains && (result.hstsMaxAge || 0) >= 31536000) {
      reasons.push("HSTS enabled with preload — excellent");
    } else {
      reasons.push("HSTS enabled");
    }
  } else if (result.hsts === false) {
    score -= 5;
    reasons.push("HSTS not enabled — recommended for security");
  }

  // Hostname match
  if (result.hostnameMatch === false) {
    score -= 20;
    reasons.push("Certificate does not match hostname");
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

function checkHSTS(hostname: string): Promise<{ hsts: boolean; maxAge?: number; includeSubdomains?: boolean; preload?: boolean }> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ hsts: false });
    }, 5000);

    const req = https.request(
      {
        hostname,
        port: 443,
        path: "/",
        method: "HEAD",
        timeout: 5000,
        headers: { "User-Agent": "exit1-ssl-checker/1.0" },
      },
      (res) => {
        clearTimeout(timeout);
        const hstsHeader = res.headers["strict-transport-security"];
        if (!hstsHeader) {
          resolve({ hsts: false });
          return;
        }
        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/i);
        resolve({
          hsts: true,
          maxAge: maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : undefined,
          includeSubdomains: /includesubdomains/i.test(hstsHeader),
          preload: /preload/i.test(hstsHeader),
        });
      }
    );

    req.on("error", () => {
      clearTimeout(timeout);
      resolve({ hsts: false });
    });

    req.on("timeout", () => {
      clearTimeout(timeout);
      req.destroy();
      resolve({ hsts: false });
    });

    req.end();
  });
}

function checkSSL(hostname: string): Promise<SSLResult & { hostname: string }> {
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
        const cert = socket.getPeerCertificate(true); // true = include full chain
        const authorized = socket.authorized;
        const authError = socket.authorizationError ? String(socket.authorizationError) : undefined;

        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve({ hostname, valid: false, error: "No certificate received" });
          return;
        }

        const now = Date.now();
        const validFrom = new Date(cert.valid_from).getTime();
        const validTo = new Date(cert.valid_to).getTime();
        const daysUntilExpiry = Math.ceil(
          (validTo - now) / (1000 * 60 * 60 * 24)
        );
        const isValid = now >= validFrom && now <= validTo;

        const keySize = cert.bits || undefined;

        // Extract signature algorithm from the raw cert object
        const certAny = cert as unknown as Record<string, unknown>;
        const signatureAlgorithm =
          (certAny.sigalg as string) ||
          (certAny.signatureAlgorithm as string) ||
          (certAny.asn1Curve as string) ||
          undefined;

        // Extract Subject Alternative Names
        const altNames = cert.subjectaltname
          ? cert.subjectaltname.split(", ").map((s: string) => s.replace("DNS:", ""))
          : undefined;

        // Check hostname match
        let hostnameMatch = false;
        if (altNames && altNames.length > 0) {
          hostnameMatch = altNames.some((name: string) => {
            if (name.startsWith("*.")) {
              const wildcard = name.slice(2);
              return hostname === wildcard || hostname.endsWith("." + wildcard);
            }
            return name === hostname;
          });
        } else if (cert.subject?.CN) {
          hostnameMatch = cert.subject.CN === hostname;
        }

        const protocol = socket.getProtocol() || undefined;

        // Get cipher suite
        const cipherInfo = socket.getCipher();
        const cipherSuite = cipherInfo?.name || undefined;
        const cipherVersion = cipherInfo?.version || undefined;

        // Build certificate chain
        const chain: ChainCert[] = [];
        let current = cert;
        const seen = new Set<string>();
        while (current) {
          const serialKey = current.serialNumber || "";
          if (seen.has(serialKey)) break;
          seen.add(serialKey);

          const subjectCN = current.subject?.CN || current.subject?.O || "Unknown";
          const issuerCN = current.issuer?.CN || current.issuer?.O || "Unknown";
          const isSelfSigned = subjectCN === issuerCN;

          chain.push({
            subject: subjectCN,
            issuer: issuerCN,
            validFrom: new Date(current.valid_from).toISOString(),
            validTo: new Date(current.valid_to).toISOString(),
            isSelfSigned,
          });

          if (isSelfSigned) break; // Root cert, stop traversing
          current = (current as unknown as { issuerCertificate?: typeof cert }).issuerCertificate as typeof cert;
          if (!current || Object.keys(current).length === 0) break;
        }

        // Detect cert type
        const certType = detectCertType(
          cert.issuer?.O || "",
          cert.subject as unknown as Record<string, string>
        );

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
          hostnameMatch,
          cipherSuite,
          cipherVersion,
          browserTrusted: authorized,
          browserTrustedReason: authError || undefined,
          chain,
          certType,
          error: !isValid
            ? `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`
            : undefined,
        };

        const { grade, reasons } = computeGrade(result);
        result.grade = grade;
        result.gradeReasons = reasons;

        resolve({ hostname, ...result });
      }
    );

    socket.on("error", (error) => {
      socket.destroy();
      resolve({
        hostname,
        valid: false,
        grade: "F",
        gradeReasons: ["Connection failed"],
        error: `SSL connection failed: ${error.message}`,
      });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({
        hostname,
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

    // Run SSL check and HSTS check in parallel
    const [sslResult, hstsResult] = await Promise.all([
      checkSSL(hostname),
      checkHSTS(hostname),
    ]);

    // Merge HSTS data into result
    sslResult.hsts = hstsResult.hsts;
    sslResult.hstsMaxAge = hstsResult.maxAge;
    sslResult.hstsIncludeSubdomains = hstsResult.includeSubdomains;
    sslResult.hstsPreload = hstsResult.preload;

    // Recompute grade with HSTS info included
    const { grade, reasons } = computeGrade(sslResult);
    sslResult.grade = grade;
    sslResult.gradeReasons = reasons;

    return NextResponse.json(sslResult);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
