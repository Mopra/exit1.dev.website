"use client";

import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo } from "react";
import {
  Globe,
  Lock,
  Cable,
  Handshake,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SSLResult {
  hostname: string;
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  protocol?: string;
  keySize?: number;
  signatureAlgorithm?: string;
  altNames?: string[];
  grade?: string;
  fingerprint?: string;
  cipherSuite?: string;
  cipherVersion?: string;
  browserTrusted?: boolean;
  browserTrustedReason?: string;
  hostnameMatch?: boolean;
  hsts?: boolean;
  certType?: string;
  chain?: { subject: string; issuer: string; validFrom: string; validTo: string; isSelfSigned: boolean }[];
}

function StepNode({
  data,
}: {
  data: {
    step: number;
    title: string;
    details: string[];
    color: string;
    icon: string;
    grade?: string;
    gradeColor?: string;
  };
}) {
  const icons: Record<string, React.ReactNode> = {
    globe: <Globe className="w-4 h-4" />,
    cable: <Cable className="w-4 h-4" />,
    handshake: <Handshake className="w-4 h-4" />,
    fileCheck: <FileCheck className="w-4 h-4" />,
    shieldCheck: <ShieldCheck className="w-4 h-4" />,
    shieldAlert: <ShieldAlert className="w-4 h-4" />,
    lock: <Lock className="w-4 h-4" />,
    checkCircle: <CheckCircle className="w-4 h-4" />,
  };

  const tint = (c: string | undefined, percent: number) =>
    c ? `color-mix(in oklch, ${c} ${percent}%, transparent)` : undefined;

  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-background/80 border border-foreground/10 rounded-xl backdrop-blur-sm w-[420px]">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold"
        style={{
          backgroundColor: tint(data.color, 8),
          borderColor: tint(data.color, 18),
          color: data.color,
        }}
      >
        {icons[data.icon] || data.step}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">
            STEP {data.step}
          </span>
          {data.grade && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
              style={{
                backgroundColor: tint(data.gradeColor, 12),
                borderColor: tint(data.gradeColor, 25),
                color: data.gradeColor,
              }}
            >
              {data.grade}
            </span>
          )}
        </div>
        <div className="text-xs font-semibold text-foreground mt-0.5">
          {data.title}
        </div>
        {data.details.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {data.details.map((detail, i) => (
              <div
                key={i}
                className="text-[11px] text-muted-foreground leading-tight"
              >
                {detail}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = { step: StepNode };

export default function SSLFlowDiagram({ result }: { result: SSLResult }) {
  const gradeColor = result.grade?.startsWith("A")
    ? "var(--success)"
    : result.grade === "B"
      ? "var(--info)"
      : result.grade === "C"
        ? "var(--warning)"
        : "var(--destructive)";

  const validColor = result.valid ? "var(--success)" : "var(--destructive)";

  const nodes: Node[] = useMemo(() => {
    const yGap = 90;

    return [
      {
        id: "dns",
        type: "step",
        position: { x: 0, y: 0 },
        data: {
          step: 1,
          title: "DNS Lookup",
          details: [`Resolve ${result.hostname}`],
          color: "var(--info)",
          icon: "globe",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: "tcp",
        type: "step",
        position: { x: 0, y: yGap },
        data: {
          step: 2,
          title: "TCP Connection",
          details: [`Connect to ${result.hostname}:443`],
          color: "var(--secondary)",
          icon: "cable",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: "tls",
        type: "step",
        position: { x: 0, y: yGap * 2 },
        data: {
          step: 3,
          title: "TLS Handshake",
          details: [
            `Negotiated ${result.protocol || "TLS"}`,
            result.cipherSuite ? `Cipher: ${result.cipherSuite}` : "",
            result.keySize ? `Key exchange: ${result.keySize}-bit` : "",
          ].filter(Boolean),
          color: "var(--tier-nano)",
          icon: "handshake",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: "cert",
        type: "step",
        position: { x: 0, y: yGap * 3 },
        data: {
          step: 4,
          title: "Server Certificate",
          details: [
            `Issuer: ${result.issuer || "Unknown"}`,
            `Subject: ${result.subject || result.hostname}`,
            result.altNames && result.altNames.length > 1
              ? `SANs: ${result.altNames.slice(0, 3).join(", ")}${result.altNames.length > 3 ? ` +${result.altNames.length - 3} more` : ""}`
              : "",
            result.signatureAlgorithm
              ? `Signature: ${result.signatureAlgorithm}`
              : "",
          ].filter(Boolean),
          color: "var(--warning)",
          icon: "fileCheck",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: "validate",
        type: "step",
        position: { x: 0, y: yGap * 4 },
        data: {
          step: 5,
          title: "Certificate Validation",
          details: [
            result.browserTrusted != null
              ? (result.browserTrusted ? "Browser trusted: Yes" : "Browser trusted: No")
              : (result.valid ? "Trusted CA: Yes" : "Trusted CA: No"),
            result.hostnameMatch != null
              ? (result.hostnameMatch ? "Hostname match: Yes" : "Hostname match: No")
              : (result.valid ? "Domain matches certificate" : "Domain mismatch or invalid"),
            result.daysUntilExpiry != null
              ? result.daysUntilExpiry > 0
                ? `Expires in ${result.daysUntilExpiry} days`
                : `Expired ${Math.abs(result.daysUntilExpiry)} days ago`
              : "",
          ].filter(Boolean),
          color: validColor,
          icon: result.valid ? "shieldCheck" : "shieldAlert",
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: "secure",
        type: "step",
        position: { x: 0, y: yGap * 5 },
        data: {
          step: 6,
          title: "Secure Connection Established",
          details: [
            result.valid
              ? "Encrypted session active"
              : "Connection insecure",
          ],
          color: gradeColor,
          icon: result.valid ? "lock" : "shieldAlert",
          grade: result.grade,
          gradeColor,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
    ];
  }, [result, validColor, gradeColor]);

  const edges: Edge[] = useMemo(() => {
    const ids = ["dns", "tcp", "tls", "cert", "validate", "secure"];
    return ids.slice(0, -1).map((id, i) => ({
      id: `e-${id}-${ids[i + 1]}`,
      source: id,
      target: ids[i + 1],
      animated: true,
      style: { stroke: "color-mix(in oklch, var(--foreground) 12%, transparent)", strokeWidth: 1.5 },
    }));
  }, []);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 50);
  }, []);

  return (
    <div className="w-full h-[600px] rounded-xl border border-foreground/10 overflow-hidden bg-background/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background color="color-mix(in oklch, var(--foreground) 5%, transparent)" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
