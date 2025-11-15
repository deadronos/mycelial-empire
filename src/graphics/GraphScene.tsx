import type { EdgeEntity, NodeEntity } from "@/ecs/world";
import { useEdgeEntities, useNodeEntities } from "@/ecs/world";
import { useUiStore } from "@/state/useUiStore";

export const GraphScene = () => {
  const showGrid = useUiStore((state) => state.devtools.showGridOverlay);
  const latestMessage = useUiStore((state) => state.latestMessage);

  return (
    <div className="relative h-full w-full">
      {/* Ambient glow background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(45,212,191,0.15) 0, transparent 55%)," +
            "radial-gradient(circle at 80% 80%, rgba(96,165,250,0.15) 0, transparent 55%)",
        }}
      />

      {/* SVG Graph */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {/* Define all gradients in defs section */}
          <SVGGradientDefs />
        </defs>

        {showGrid && <GridOverlay />}
        <EdgesLayer />
        <NodesLayer />
      </svg>

      {/* Message overlay */}
      {latestMessage && (
        <div className="absolute left-3 right-3 bottom-3 text-xs sm:text-sm text-emerald-100/90 bg-black/40 border border-emerald-500/30 rounded-xl px-3 py-2 flex items-center gap-2 backdrop-blur">
          <span className="w-1.5 h-4 bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="truncate">{latestMessage}</span>
        </div>
      )}
    </div>
  );
};

const SVGGradientDefs = () => {
  const edgeBucket = useEdgeEntities();
  const edges = edgeBucket.entities as EdgeEntity[];
  const nodeBucket = useNodeEntities();
  const nodes = nodeBucket.entities as NodeEntity[];

  return (
    <>
      {/* Edge gradients */}
      {edges.map((entity) => (
        <linearGradient key={`edgeGradient-${entity.id}`} id={`edgeGradient-${entity.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
        </linearGradient>
      ))}

      {/* Node gradients */}
      {nodes.map((entity) => {
        const { node } = entity;
        const color =
          node.kind === "heart"
            ? "#a855f7"
            : node.kind === "waterPocket"
            ? "#22d3ee"
            : node.kind === "carbonPocket"
            ? "#e5e7eb"
            : node.kind === "nutrientPocket"
            ? "#bef264"
            : node.kind === "junction"
            ? "#38bdf8"
            : "#f87171";

        return (
          <radialGradient key={`nodeGradient-${entity.id}`} id={`nodeGradient-${entity.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="60%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        );
      })}
    </>
  );
};

const GridOverlay = () => (
  <g opacity={0.1}>
    {Array.from({ length: 11 }).map((_, i) => (
      <line key={`h-${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#1f2937" strokeWidth="0.1" />
    ))}
    {Array.from({ length: 11 }).map((_, i) => (
      <line key={`v-${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#1f2937" strokeWidth="0.1" />
    ))}
  </g>
);

const NodesLayer = () => {
  const bucket = useNodeEntities();
  const nodes = bucket.entities as NodeEntity[];
  return (
    <g>
      {nodes.map((entity) => (
        <NodeGlyph key={entity.id} entity={entity} />
      ))}
    </g>
  );
};

const EdgesLayer = () => {
  const bucket = useEdgeEntities();
  const edges = bucket.entities as EdgeEntity[];
  return (
    <g>
      {edges.map((entity) => (
        <HyphaeEdge key={entity.id} entity={entity} />
      ))}
    </g>
  );
};

const HyphaeEdge = ({ entity }: { entity: EdgeEntity }) => {
  const { edge } = entity;
  const fromNode = edge.fromNode;
  const toNode = edge.toNode;

  if (!fromNode || !toNode) {
    return null;
  }

  const from = fromNode.position;
  const to = toNode.position;

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={`url(#edgeGradient-${entity.id})`}
      strokeWidth={1.8}
      strokeLinecap="round"
      className="drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
    />
  );
};

const NodeGlyph = ({ entity }: { entity: NodeEntity }) => {
  const { node } = entity;
  const { x, y } = node.position;

  const color =
    node.kind === "heart"
      ? "#a855f7"
      : node.kind === "waterPocket"
      ? "#22d3ee"
      : node.kind === "carbonPocket"
      ? "#e5e7eb"
      : node.kind === "nutrientPocket"
      ? "#bef264"
      : node.kind === "junction"
      ? "#38bdf8"
      : "#f87171";

  const glowColor =
    node.kind === "heart"
      ? "rgba(217,70,239,0.9)"
      : node.kind === "waterPocket"
      ? "rgba(34,211,238,0.9)"
      : node.kind === "carbonPocket"
      ? "rgba(148,163,184,0.9)"
      : node.kind === "nutrientPocket"
      ? "rgba(190,242,100,0.9)"
      : node.kind === "junction"
      ? "rgba(56,189,248,0.9)"
      : "rgba(248,113,113,0.9)";

  const baseRadius = node.kind === "heart" ? 5 : 2.8;
  const radius = baseRadius + (node.tier - 1) * 0.3;

  const label =
    node.kind === "heart"
      ? "Heart (Core)"
      : node.kind === "waterPocket"
      ? "Water Pocket"
      : node.kind === "carbonPocket"
      ? "Carbon Pocket"
      : node.kind === "nutrientPocket"
      ? "Nutrient Pocket"
      : node.kind === "junction"
      ? "Junction"
      : "Unknown Node";

  return (
    <g>
      {/* Outer glow */}
      <circle cx={x} cy={y} r={radius * 2.2} fill={`url(#nodeGradient-${entity.id})`} />

      {/* Core with filter glow */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        <title>{label}</title>
      </circle>
    </g>
  );
};
