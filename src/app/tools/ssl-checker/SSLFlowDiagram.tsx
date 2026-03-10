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
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Clock,
  Fingerprint,
  Network,
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
}

function GradeNode({ data }: { data: { grade: string; valid: boolean } }) {
  const color = data.grade.startsWith("A")
    ? "#34d399"
    : data.grade === "B"
      ? "#60a5fa"
      : data.grade === "C"
        ? "#fbbf24"
        : "#f87171";

  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 bg-black/80 border border-white/10 rounded-xl backdrop-blur-sm text-center">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold border"
        style={{
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
          color,
        }}
      >
        {data.grade}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">Overall Grade</div>
    </div>
  );
}

function InfoNode({
  data,
}: {
  data: { label: string; value: string; icon: string; color: string };
}) {
  const icons: Record<string, React.ReactNode> = {
    globe: <Globe className="w-4 h-4" />,
    lock: <Lock className="w-4 h-4" />,
    shieldCheck: <ShieldCheck className="w-4 h-4" />,
    shieldAlert: <ShieldAlert className="w-4 h-4" />,
    key: <KeyRound className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    fingerprint: <Fingerprint className="w-4 h-4" />,
    network: <Network className="w-4 h-4" />,
  };

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-black/80 border border-white/10 rounded-xl backdrop-blur-sm min-w-[150px]">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
        style={{
          backgroundColor: `${data.color}15`,
          borderColor: `${data.color}30`,
          color: data.color,
        }}
      >
        {icons[data.icon]}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground leading-tight">
          {data.label}
        </div>
        <div className="text-xs font-semibold text-white truncate max-w-[140px]">
          {data.value}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { grade: GradeNode, info: InfoNode };

export default function SSLFlowDiagram({ result }: { result: SSLResult }) {
  const nodes: Node[] = useMemo(() => {
    const gradeColor = result.grade?.startsWith("A")
      ? "#34d399"
      : result.grade === "B"
        ? "#60a5fa"
        : result.grade === "C"
          ? "#fbbf24"
          : "#f87171";

    const n: Node[] = [
      // Grade - center top
      {
        id: "grade",
        type: "grade",
        position: { x: 380, y: 0 },
        data: { grade: result.grade || "?", valid: result.valid },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      // Left column - Connection info
      {
        id: "hostname",
        type: "info",
        position: { x: 0, y: 10 },
        data: {
          label: "Hostname",
          value: result.hostname,
          icon: "globe",
          color: "#63b3ff",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      {
        id: "protocol",
        type: "info",
        position: { x: 200, y: 10 },
        data: {
          label: "Protocol",
          value: result.protocol || "Unknown",
          icon: "lock",
          color: "#a78bfa",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      // Right column - Certificate info
      {
        id: "issuer",
        type: "info",
        position: { x: 570, y: 10 },
        data: {
          label: "Issuer",
          value: result.issuer || "Unknown",
          icon: result.valid ? "shieldCheck" : "shieldAlert",
          color: result.valid ? "#34d399" : "#f87171",
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
      },
      {
        id: "expiry",
        type: "info",
        position: { x: 770, y: 10 },
        data: {
          label: "Expires In",
          value: result.daysUntilExpiry != null ? `${result.daysUntilExpiry} days` : "Unknown",
          icon: "clock",
          color:
            result.daysUntilExpiry != null && result.daysUntilExpiry <= 7
              ? "#f87171"
              : result.daysUntilExpiry != null && result.daysUntilExpiry <= 30
                ? "#fbbf24"
                : "#34d399",
        },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
      },
    ];

    // Bottom row - Technical details
    let bottomX = 50;

    if (result.keySize) {
      n.push({
        id: "keysize",
        type: "info",
        position: { x: bottomX, y: 100 },
        data: {
          label: "Key Size",
          value: `${result.keySize} bits`,
          icon: "key",
          color: result.keySize >= 2048 ? "#34d399" : "#fbbf24",
        },
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
      });
      bottomX += 200;
    }

    if (result.signatureAlgorithm) {
      n.push({
        id: "sigalg",
        type: "info",
        position: { x: bottomX, y: 100 },
        data: {
          label: "Signature",
          value: result.signatureAlgorithm,
          icon: "fingerprint",
          color: "#a78bfa",
        },
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
      });
      bottomX += 200;
    }

    if (result.subject) {
      n.push({
        id: "subject",
        type: "info",
        position: { x: bottomX, y: 100 },
        data: {
          label: "Subject",
          value: result.subject,
          icon: "globe",
          color: "#63b3ff",
        },
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
      });
      bottomX += 200;
    }

    if (result.altNames && result.altNames.length > 0) {
      n.push({
        id: "altnames",
        type: "info",
        position: { x: bottomX, y: 100 },
        data: {
          label: "Alt Names",
          value: result.altNames.length === 1 ? result.altNames[0] : `${result.altNames.length} domains`,
          icon: "network",
          color: "#f472b6",
        },
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
      });
    }

    return n;
  }, [result]);

  const edges: Edge[] = useMemo(() => {
    const gradeColor = result.grade?.startsWith("A")
      ? "#34d399"
      : result.grade === "B"
        ? "#60a5fa"
        : result.grade === "C"
          ? "#fbbf24"
          : "#f87171";

    const e: Edge[] = [
      // Left side → Grade
      {
        id: "e-host-proto",
        source: "hostname",
        target: "protocol",
        animated: true,
        style: { stroke: "#63b3ff", strokeWidth: 1.5 },
      },
      {
        id: "e-proto-grade",
        source: "protocol",
        target: "grade",
        animated: true,
        style: { stroke: "#a78bfa", strokeWidth: 1.5 },
      },
      // Grade → Right side
      {
        id: "e-grade-issuer",
        source: "grade",
        target: "issuer",
        animated: true,
        style: { stroke: gradeColor, strokeWidth: 1.5 },
      },
      {
        id: "e-issuer-expiry",
        source: "issuer",
        target: "expiry",
        animated: true,
        style: { stroke: "#34d399", strokeWidth: 1.5 },
      },
    ];

    // Connect grade to bottom row
    const bottomIds = ["keysize", "sigalg", "subject", "altnames"].filter((id) =>
      nodes.some((n) => n.id === id)
    );
    bottomIds.forEach((id) => {
      e.push({
        id: `e-grade-${id}`,
        source: "grade",
        target: id,
        animated: true,
        style: { stroke: "#ffffff15", strokeWidth: 1 },
        type: "straight",
      });
    });

    return e;
  }, [result, nodes]);

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 50);
  }, []);

  return (
    <div className={cn(
      "w-full h-[240px] rounded-xl border border-white/10 overflow-hidden bg-black/30",
    )}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.2}
      >
        <Background color="#ffffff08" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
