import React, { useEffect, useState } from "react";

// Simple working prototype for "Mycelial Empire"
// - Top-left resource HUD
// - Center graph view with Heart + resource pockets + glowing hyphae
// - Bottom-left action bar (Explore is implemented, others are stubbed)
// - Bottom-right network stats
// - Idle loop: connected pockets generate resources + sugar each second

const RESOURCE_CAPS = {
  sugar: 500_000,
  water: 300_000,
  carbon: 200_000,
  nutrients: 150_000,
  spores: 999,
};

const BASE_MAINTENANCE_PER_EDGE = 0.03; // sugar/sec per edge

const formatNumber = (value) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "m";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toFixed(1);
};

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

let nextNodeId = 1;
let nextEdgeId = 1;

const createInitialWorld = () => {
  const nodes = [
    {
      id: "heart",
      type: "heart",
      x: 50,
      y: 50,
      label: "Heart (Core)",
    },
    {
      id: "n" + nextNodeId++,
      type: "waterPocket",
      x: 25,
      y: 30,
      label: "Water Pocket",
      rate: 2.5,
    },
    {
      id: "n" + nextNodeId++,
      type: "carbonPocket",
      x: 75,
      y: 40,
      label: "Carbon Pocket",
      rate: 1.8,
    },
    {
      id: "n" + nextNodeId++,
      type: "nutrientPocket",
      x: 40,
      y: 75,
      label: "Nutrient Pocket",
      rate: 2.0,
    },
  ];

  const edges = [
    { id: "e" + nextEdgeId++, from: "heart", to: nodes[1].id },
    { id: "e" + nextEdgeId++, from: "heart", to: nodes[2].id },
    { id: "e" + nextEdgeId++, from: "heart", to: nodes[3].id },
  ];

  return { nodes, edges };
};

function simulateStep(resources, world, upgrades) {
  const { nodes, edges } = world;
  const next = { ...resources };

  // Base generation from pockets
  let sugarFromPockets = 0;
  let waterPerSec = 0;
  let carbonPerSec = 0;
  let nutrientsPerSec = 0;

  const flowMultiplier = 1 + upgrades.hyphaeLevel * 0.35; // each level +35% flow

  for (const node of nodes) {
    const rate = (node.rate || 0) * flowMultiplier;
    if (node.type === "waterPocket") {
      waterPerSec += rate;
      sugarFromPockets += rate * 0.25;
    } else if (node.type === "carbonPocket") {
      carbonPerSec += rate;
      sugarFromPockets += rate * 0.35;
    } else if (node.type === "nutrientPocket") {
      nutrientsPerSec += rate;
      sugarFromPockets += rate * 0.2;
    }
  }

  // Apply production (clamped by caps)
  next.water = Math.min(next.water + waterPerSec, RESOURCE_CAPS.water);
  next.carbon = Math.min(next.carbon + carbonPerSec, RESOURCE_CAPS.carbon);
  next.nutrients = Math.min(next.nutrients + nutrientsPerSec, RESOURCE_CAPS.nutrients);

  // Sugar gain
  next.sugar = Math.min(next.sugar + sugarFromPockets, RESOURCE_CAPS.sugar);

  // Maintenance based on total edge length (simplified: number of edges)
  const maintenance = edges.length * BASE_MAINTENANCE_PER_EDGE * (1 - upgrades.maintenanceReduction);
  next.sugar = Math.max(0, next.sugar - maintenance);

  return {
    nextResources: next,
    stats: {
      waterPerSec,
      carbonPerSec,
      nutrientsPerSec,
      sugarFromPockets,
      maintenance,
      netSugar: sugarFromPockets - maintenance,
    },
  };
}

const MycelialEmpirePrototype = () => {
  const [world, setWorld] = useState(() => createInitialWorld());
  const [resources, setResources] = useState({
    sugar: 120,
    water: 0,
    carbon: 0,
    nutrients: 0,
    spores: 0,
  });

  const [stats, setStats] = useState({
    waterPerSec: 0,
    carbonPerSec: 0,
    nutrientsPerSec: 0,
    sugarFromPockets: 0,
    maintenance: 0,
    netSugar: 0,
  });

  const [upgrades, setUpgrades] = useState({
    hyphaeLevel: 0,
    maintenanceReduction: 0,
  });

  const [message, setMessage] = useState("Hyphae stir in the dark soil...");

  // Idle loop
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prev) => {
        const { nextResources, stats: newStats } = simulateStep(prev, world, upgrades);
        setStats(newStats);
        return nextResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [world, upgrades]);

  const canAfford = (cost) => resources.sugar >= cost;

  const spendSugar = (cost) => {
    setResources((prev) => ({ ...prev, sugar: Math.max(0, prev.sugar - cost) }));
  };

  const bumpMessage = (text) => {
    setMessage(text);
  };

  const handleExplore = () => {
    const cost = 40;
    if (!canAfford(cost)) {
      bumpMessage("Not enough Sugar to push new hyphae. (Need 40)");
      return;
    }
    spendSugar(cost);

    setWorld((prev) => {
      const newNodes = [...prev.nodes];
      const newEdges = [...prev.edges];

      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 30;
      const cx = 50 + Math.cos(angle) * radius;
      const cy = 50 + Math.sin(angle) * radius;

      const type = randomChoice(["waterPocket", "carbonPocket", "nutrientPocket"]);
      const baseRates = {
        waterPocket: 2 + Math.random() * 2,
        carbonPocket: 1.5 + Math.random() * 1.5,
        nutrientPocket: 1.8 + Math.random() * 1.2,
      };

      const node = {
        id: "n" + nextNodeId++,
        type,
        x: Math.max(10, Math.min(90, cx)),
        y: Math.max(10, Math.min(90, cy)),
        label:
          type === "waterPocket"
            ? "Water Pocket"
            : type === "carbonPocket"
            ? "Carbon Pocket"
            : "Nutrient Pocket",
        rate: baseRates[type],
      };

      newNodes.push(node);

      // Attach to Heart or a random existing node for flavor
      const attachTo = randomChoice(prev.nodes.filter((n) => n.id === "heart" || n.type !== "heart"));
      newEdges.push({ id: "e" + nextEdgeId++, from: attachTo.id, to: node.id });

      bumpMessage("New " + node.label + " discovered and linked to the network.");

      return { nodes: newNodes, edges: newEdges };
    });
  };

  const handleUpgradeHyphae = () => {
    const cost = 120 + upgrades.hyphaeLevel * 80;
    if (!canAfford(cost)) {
      bumpMessage("You need more Sugar to reinforce the hyphae. (Need " + cost + ")");
      return;
    }
    spendSugar(cost);
    setUpgrades((prev) => ({ ...prev, hyphaeLevel: prev.hyphaeLevel + 1 }));
    bumpMessage("Hyphae thicken, channeling resources more efficiently.");
  };

  const handleNewJunction = () => {
    bumpMessage("Junction upgrades will come in a later build.");
  };

  const handleResearch = () => {
    bumpMessage("Research UI is not implemented in this prototype.");
  };

  const handleSpecialNodes = () => {
    bumpMessage("Special nodes and rival colonies are planned features.");
  };

  const totalFlow = stats.sugarFromPockets;
  const maintenance = stats.maintenance;
  const netSugar = stats.netSugar;

  return (
    <div className="w-full h-full min-h-[480px] bg-[#050609] text-slate-100 flex flex-col font-mono">
      {/* Top bar: Resources */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-950/80 to-slate-900/80 backdrop-blur">
        <div className="flex gap-4 text-xs sm:text-sm">
          <ResourcePill label="Sugar" value={resources.sugar} cap={RESOURCE_CAPS.sugar} accent="sugar" />
          <ResourcePill label="Water" value={resources.water} cap={RESOURCE_CAPS.water} accent="water" />
          <ResourcePill label="Carbon" value={resources.carbon} cap={RESOURCE_CAPS.carbon} accent="carbon" />
          <ResourcePill label="Nutrients" value={resources.nutrients} cap={RESOURCE_CAPS.nutrients} accent="nutrients" />
          <ResourcePill label="Spore Dust" value={resources.spores} cap={RESOURCE_CAPS.spores} accent="spores" />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" />
          <span>Network stable</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Left: Graph + actions */}
        <div className="flex-1 flex flex-col">
          {/* Graph */}
          <div className="relative flex-1 m-3 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 shadow-[0_0_40px_rgba(15,23,42,0.8)] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
              backgroundImage:
                "radial-gradient(circle at 10% 20%, rgba(45,212,191,0.15) 0, transparent 55%)," +
                "radial-gradient(circle at 80% 80%, rgba(96,165,250,0.15) 0, transparent 55%)",
            }} />
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Hyphae / edges */}
              {world.edges.map((edge) => {
                const from = world.nodes.find((n) => n.id === edge.from);
                const to = world.nodes.find((n) => n.id === edge.to);
                if (!from || !to) return null;
                return (
                  <g key={edge.id}>
                    <defs>
                      <linearGradient id={`edgeGradient-${edge.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={`url(#edgeGradient-${edge.id})`}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]"
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {world.nodes.map((node) => (
                <NodeVisual key={node.id} node={node} />
              ))}
            </svg>

            {/* Message overlay */}
            <div className="absolute left-3 right-3 bottom-3 text-xs sm:text-sm text-emerald-100/90 bg-black/40 border border-emerald-500/30 rounded-xl px-3 py-2 flex items-center gap-2 backdrop-blur">
              <span className="w-1.5 h-4 bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="truncate">{message}</span>
            </div>
          </div>

          {/* Action bar */}
          <div className="px-3 pb-3 flex flex-wrap gap-2 text-xs sm:text-sm">
            <ActionButton label="Explore" icon="🔍" onClick={handleExplore} hotkey="E" />
            <ActionButton label="New Junction" icon="🍄" onClick={handleNewJunction} hotkey="J" secondary />
            <ActionButton label="Upgrade Hyphae" icon="⬆️" onClick={handleUpgradeHyphae} hotkey="U" />
            <ActionButton label="Research" icon="⚗️" onClick={handleResearch} hotkey="R" secondary />
            <ActionButton label="Special Nodes" icon="✨" onClick={handleSpecialNodes} hotkey="S" secondary />
          </div>
        </div>

        {/* Right: Stats panel */}
        <div className="w-64 border-l border-slate-800 bg-slate-950/90 backdrop-blur-sm flex flex-col text-xs sm:text-sm">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 uppercase tracking-wide text-[0.65rem]">Network Status</span>
            <span className="text-[0.6rem] text-slate-500">Prototype build</span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            <div>
              <div className="text-slate-400 mb-1">Flow Rates</div>
              <StatRow label="Water" value={`+${formatNumber(stats.waterPerSec)}/s`} />
              <StatRow label="Carbon" value={`+${formatNumber(stats.carbonPerSec)}/s`} />
              <StatRow label="Nutrients" value={`+${formatNumber(stats.nutrientsPerSec)}/s`} />
            </div>

            <div>
              <div className="text-slate-400 mb-1">Sugar Economy</div>
              <StatRow label="Gross Inflow" value={`+${formatNumber(totalFlow)}/s`} />
              <StatRow label="Maintenance" value={`-${stats.maintenance.toFixed(2)}/s`} />
              <StatRow
                label="Net Sugar"
                value={`${netSugar >= 0 ? "+" : ""}${netSugar.toFixed(2)}/s`}
                highlight
              />
            </div>

            <div>
              <div className="text-slate-400 mb-1">Network Shape</div>
              <StatRow label="Nodes" value={world.nodes.length} />
              <StatRow label="Hyphae" value={world.edges.length} />
            </div>

            <div>
              <div className="text-slate-400 mb-1">Upgrades</div>
              <StatRow label="Hyphae Level" value={upgrades.hyphaeLevel} />
              <StatRow
                label="Maintenance Red."
                value={`${(upgrades.maintenanceReduction * 100).toFixed(0)}%`}
              />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 text-[0.65rem] text-slate-500 leading-relaxed">
              This is a small, self-contained prototype.
              <br />
              Focus is on the feel of the underground network and the core idle loop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourcePill = ({ label, value, cap, accent }) => {
  const pct = Math.min(100, (value / cap) * 100);
  const accentClass = {
    sugar: "from-amber-400/70 to-rose-500/70",
    water: "from-cyan-400/70 to-sky-500/70",
    carbon: "from-slate-300/70 to-slate-500/70",
    nutrients: "from-lime-300/70 to-emerald-400/70",
    spores: "from-violet-400/70 to-fuchsia-500/70",
  }[accent];

  return (
    <div className="relative px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 shadow-inner flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className="text-[0.65rem] uppercase tracking-wide text-slate-400">{label}</span>
        <span className="text-xs text-slate-50">{formatNumber(value)}</span>
        <span className="text-[0.6rem] text-slate-500">/ {formatNumber(cap)}</span>
      </div>
      <div className="mt-0.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${accentClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ label, icon, onClick, hotkey, secondary }) => {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition " +
        (secondary
          ? "border-slate-700 text-slate-300 bg-slate-900/70 hover:bg-slate-800/80"
          : "border-emerald-500/70 text-emerald-100 bg-emerald-600/20 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.4)]")
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
      {hotkey && <span className="text-[0.6rem] text-slate-400 ml-1">[{hotkey}]</span>}
    </button>
  );
};

const StatRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-slate-400">{label}</span>
    <span
      className={
        "ml-2 font-semibold " +
        (highlight ? "text-emerald-300" : "text-slate-100")
      }
    >
      {value}
    </span>
  </div>
);

const NodeVisual = ({ node }) => {
  const baseRadius = node.type === "heart" ? 5 : 2.8;
  const color =
    node.type === "heart"
      ? "#a855f7"
      : node.type === "waterPocket"
      ? "#22d3ee"
      : node.type === "carbonPocket"
      ? "#e5e7eb"
      : node.type === "nutrientPocket"
      ? "#bef264"
      : "#e5e7eb";

  const glowColor =
    node.type === "heart"
      ? "rgba(217,70,239,0.9)"
      : node.type === "waterPocket"
      ? "rgba(34,211,238,0.9)"
      : node.type === "carbonPocket"
      ? "rgba(148,163,184,0.9)"
      : node.type === "nutrientPocket"
      ? "rgba(190,242,100,0.9)"
      : "rgba(226,232,240,0.9)";

  return (
    <g>
      <defs>
        <radialGradient id={`nodeGradient-${node.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle
        cx={node.x}
        cy={node.y}
        r={baseRadius * 2.2}
        fill={`url(#nodeGradient-${node.id})`}
      />

      {/* Core */}
      <circle
        cx={node.x}
        cy={node.y}
        r={baseRadius}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
      >
        <title>
          {node.label}
          {node.rate ? `\nProduction: ${node.rate.toFixed(2)}/s` : ""}
        </title>
      </circle>
    </g>
  );
};

export default MycelialEmpirePrototype;
