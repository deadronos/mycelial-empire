import { useMemo } from "react";

import { formatNumber, percentFromFraction } from "@/lib/numbers";
import { useGameStore } from "@/state/useGameStore";
import type { GraphEdge, GraphNode } from "@/types/graph";

export const StatsPanel = () => {
  const stats = useGameStore((state) => state.stats);
  const edges = useGameStore((state) => state.edges);
  const nodes = useGameStore((state) => state.nodes);
  const upgrades = useGameStore((state) => state.upgrades);

  const flowRates = [
    { label: "Water", value: `+${formatNumber(stats.waterPerSec)}/s` },
    { label: "Carbon", value: `+${formatNumber(stats.carbonPerSec)}/s` },
    { label: "Nutrients", value: `+${formatNumber(stats.nutrientsPerSec)}/s` },
  ];

  const sugarEconomy = [
    { label: "Gross Inflow", value: `+${formatNumber(stats.sugarFromPockets)}/s` },
    { label: "Maintenance", value: `-${formatNumber(stats.maintenance)}/s` },
    {
      label: "Net Sugar",
      value: `${stats.netSugar >= 0 ? "+" : ""}${formatNumber(stats.netSugar)}/s`,
      highlight: stats.netSugar >= 0,
    },
  ];

  const networkShape = [
    { label: "Nodes", value: nodes.length.toString() },
    { label: "Hyphae", value: edges.length.toString() },
    { label: "Health", value: percentFromFraction(stats.networkHealth) },
    { label: "Flow Pressure", value: percentFromFraction(stats.flowPressure) },
  ];

  const upgradeRows = [
    { label: "Hyphae Level", value: (upgrades.hyphaeLevel + 1).toString() },
    {
      label: "Maintenance Red.",
      value: `${Math.round(upgrades.maintenanceReduction * 100)}%`,
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-900/70 bg-slate-950/75 shadow-[0_32px_80px_rgba(2,6,23,0.65)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-900 px-5 py-4">
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">Network Status</span>
        <span className="flex items-center gap-2 text-[0.6rem] text-slate-500">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          Stable
        </span>
      </div>
      <div className="px-5 pt-5">
        <div className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-3">
          <MiniNetworkMap nodes={nodes} edges={edges} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 text-sm">
        <StatSection title="Flow Rates" rows={flowRates} />
        <StatSection title="Sugar Economy" rows={sugarEconomy} />
        <StatSection title="Network Shape" rows={networkShape} />
        <StatSection title="Upgrades" rows={upgradeRows} />
        <div className="mt-5 border-t border-slate-900 pt-4 text-[0.65rem] text-slate-500 leading-relaxed">
          Colony telemetry mirrors the prototype: monitor flow, reinforce weak links, and keep net sugar positive to expand.
        </div>
      </div>
    </div>
  );
};

interface StatSectionProps {
  title: string;
  rows: { label: string; value: string; highlight?: boolean }[];
}

const StatSection = ({ title, rows }: StatSectionProps) => (
  <section className="mt-5 first:mt-0">
    <h3 className="mb-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{title}</h3>
    <div className="space-y-2 rounded-2xl border border-slate-900/70 bg-slate-950/70 p-3">
      {rows.map((row) => (
        <StatRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />
      ))}
    </div>
  </section>
);

const StatRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between text-[0.8rem] text-slate-300">
    <span>{label}</span>
    <span className={highlight ? "text-emerald-300" : "text-slate-100"}>{value}</span>
  </div>
);

const MiniNetworkMap = ({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) => {
  const { viewBox, edgeSegments, nodePoints } = useMemo(() => buildMiniMap(nodes, edges), [nodes, edges]);

  return (
    <svg viewBox={viewBox} className="h-32 w-full">
      <defs>
        <radialGradient id="node-glow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(129, 140, 248, 0.8)" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
        </radialGradient>
        <linearGradient id="edge-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
          <stop offset="100%" stopColor="rgba(192, 38, 211, 0.45)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" rx="18" className="fill-slate-950/85 stroke-slate-900" strokeWidth={0.5} />
      {edgeSegments.map((segment) => (
        <line
          key={segment.id}
          x1={segment.from.x}
          y1={segment.from.y}
          x2={segment.to.x}
          y2={segment.to.y}
          stroke="url(#edge-glow)"
          strokeWidth={1.2}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
      {nodePoints.map((point) => (
        <g key={point.id}>
          <circle cx={point.x} cy={point.y} r={3.4} fill="url(#node-glow)" opacity={0.45} />
          <circle cx={point.x} cy={point.y} r={2.2} fill={point.color} stroke="rgba(226, 232, 240, 0.45)" strokeWidth={0.8} />
        </g>
      ))}
    </svg>
  );
};

const buildMiniMap = (nodes: GraphNode[], edges: GraphEdge[]) => {
  if (nodes.length === 0) {
    return {
      viewBox: "0 0 100 100",
      edgeSegments: [],
      nodePoints: [],
    };
  }

  const padding = 16;
  const xs = nodes.map((node) => node.position.x);
  const ys = nodes.map((node) => node.position.y);

  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const width = Math.max(maxX - minX, 40);
  const height = Math.max(maxY - minY, 40);

  const nodeLookup = new Map(nodes.map((node) => [node.id, node] as const));

  const edgeSegments = edges
    .map((edge) => {
      const from = nodeLookup.get(edge.from);
      const to = nodeLookup.get(edge.to);
      if (!from || !to) {
        return null;
      }

      return {
        id: edge.id,
        from: {
          x: project(from.position.x, minX),
          y: project(from.position.y, minY),
        },
        to: {
          x: project(to.position.x, minX),
          y: project(to.position.y, minY),
        },
      };
    })
    .filter((segment): segment is NonNullable<typeof segment> => segment !== null);

  const nodePoints = nodes.map((node) => ({
    id: node.id,
    x: project(node.position.x, minX),
    y: project(node.position.y, minY),
    color: colorForNode(node.kind),
  }));

  return {
    viewBox: `0 0 ${width} ${height}`,
    edgeSegments,
    nodePoints,
  };
};

const project = (value: number, min: number) => value - min;

const colorForNode = (kind: GraphNode["kind"]) => {
  switch (kind) {
    case "heart":
      return "rgba(244, 114, 182, 0.9)";
    case "waterPocket":
      return "rgba(56, 189, 248, 0.9)";
    case "carbonPocket":
      return "rgba(248, 250, 252, 0.9)";
    case "nutrientPocket":
      return "rgba(74, 222, 128, 0.9)";
    case "junction":
      return "rgba(129, 140, 248, 0.9)";
    case "toxic":
      return "rgba(190, 242, 100, 0.9)";
    default:
      return "rgba(203, 213, 225, 0.9)";
  }
};
