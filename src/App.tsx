import {
  Activity,
  AlertTriangle,
  ArrowUpCircle,
  BadgeCheck,
  Crown,
  Flame,
  Leaf,
  Map as MapIcon,
  Network,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
  Trees,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import { format, prestigeUpgrades, useGameStore } from "./store/gameStore";
import type { NodeType, ResourceKey } from "./types/game";

/**
 * Order in which resources are displayed.
 */
const resourceOrder: ResourceKey[] = ["sugar", "water", "carbon", "nutrients", "spores"];

/**
 * Renders a rotated map icon representing a droplet.
 *
 * @returns A JSX element containing the icon.
 */
const DropletIcon = () => <MapIcon className="h-4 w-4 text-cyan-200 rotate-90" />;

/**
 * Metadata for each resource type including label, color, and icon.
 */
const resourceCopy: Record<ResourceKey, { label: string; color: string; icon: ReactNode }> = {
  sugar: { label: "Sugar", color: "text-purple-200", icon: <Sparkles className="h-4 w-4 text-purple-300" /> },
  water: { label: "Water", color: "text-cyan-200", icon: <DropletIcon /> },
  carbon: { label: "Carbon", color: "text-slate-200", icon: <Flame className="h-4 w-4 text-slate-200" /> },
  nutrients: { label: "Nutrients", color: "text-lime-200", icon: <Leaf className="h-4 w-4 text-lime-200" /> },
  spores: { label: "Spore Dust", color: "text-amber-200", icon: <Trees className="h-4 w-4 text-amber-200" /> },
};



/**
 * The main application component for Mycelial Empire.
 *
 * Manages the game state including resources, nodes, edges, and game loop.
 * Renders the UI for the game including the header, resource panel, command panel,
 * prestige panel, event log, and the network map.
 *
 * @returns The rendered application component.
 */
const App = () => {
  const {
    resources,
    nodes,
    edges,
    flowRate,
    pulse,
    prestigeLevel,
    purchasedUpgrades,
    events,
    tick,
    explore,
    upgrade,
    reinforce,
    purify,
    prestige,
    purchaseUpgrade,
  } = useGameStore();

  useEffect(() => {
    const interval = window.setInterval(tick, 1200);
    return () => window.clearInterval(interval);
  }, [tick]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);

  const cloggedEdges = useMemo(
    () => edges.filter((edge) => edge.strain > 1 && nodeMap[edge.from]?.discovered && nodeMap[edge.to]?.discovered),
    [edges, nodeMap],
  );

  const prestigeEffects = useMemo(() => {
    const purchased = new Set(purchasedUpgrades);
    return {
      toxinMitigation: purchased.has("enzyme-membrane") ? 0.45 : 1,
    };
  }, [purchasedUpgrades]);

  const networkHealth = useMemo(() => {
    const strainPenalty = Math.min(
      35,
      cloggedEdges.length * 6 + edges.reduce((sum, edge) => sum + edge.strain * 4, 0) / 8,
    );
    const toxinPenalty = nodes.some((node) => node.type === "toxic" && node.discovered && !node.purified)
      ? 12 * prestigeEffects.toxinMitigation
      : 0;
    const rivalPenalty = nodes.some((node) => node.type === "rival" && node.discovered) ? 4 : 0;
    return Math.max(18, 100 - strainPenalty - toxinPenalty - rivalPenalty);
  }, [cloggedEdges.length, edges, nodes, prestigeEffects.toxinMitigation]);

  const networkPulse = useMemo(() => Math.max(0, pulse), [pulse]);

  const buttons = [
    { label: "Explore Soil", onClick: explore, icon: MapIcon, glow: "from-purple-500/50 to-cyan-400/40" },
    { label: "Upgrade Node", onClick: upgrade, icon: ArrowUpCircle, glow: "from-lime-400/40 to-purple-400/30" },
    {
      label: "Reinforce Hyphae",
      onClick: reinforce,
      icon: ShieldCheck,
      glow: "from-cyan-400/40 to-purple-400/30",
    },
    {
      label: "Purify Toxins",
      onClick: purify,
      icon: TestTubeDiagonal,
      glow: "from-amber-400/40 to-rose-400/30",
    },
  ];

  const discoveredNodes = nodes.filter((node) => node.discovered);

  return (
    <div className="min-h-screen bg-soil-900 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 w-72 h-72 bg-purple-500 nebula-blur" />
        <div className="absolute right-10 top-20 w-64 h-64 bg-cyan-400 nebula-blur" />
        <div className="absolute left-20 bottom-8 w-72 h-72 bg-lime-400 nebula-blur" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-purple-200/80">Mycelial Empire</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-50 drop-shadow-hyphae">
              Beneath the canopy, the network never sleeps.
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Grow luminous hyphae, siphon hidden resources, and balance pressure before the colony collapses.
            </p>
          </div>
          <div className="blur-card px-5 py-4 rounded-2xl flex gap-6 items-center panel-sheen relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Network className="h-10 w-10 text-purple-300" />
              <div>
                <p className="text-xs uppercase text-slate-300">Flow Rate</p>
                <p className="text-2xl font-semibold text-purple-50">{format(flowRate)} /s</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-600/40" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-lime-300" />
              <div>
                <p className="text-xs uppercase text-slate-300">Network Health</p>
                <p className="text-2xl font-semibold text-lime-50">{Math.round(networkHealth)}%</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          <div className="space-y-6">
            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-purple-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-purple-200/80">Resources</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {resourceOrder.map((key) => (
                  <div
                    key={key}
                    className="border border-slate-700/50 rounded-2xl px-3 py-3 bg-white/5 flex flex-col gap-1 shadow-panel"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      {resourceCopy[key].icon}
                      <span className="uppercase tracking-[0.25em] text-slate-400">{resourceCopy[key].label}</span>
                    </div>
                    <p className={`text-2xl font-semibold ${resourceCopy[key].color}`}>{format(resources[key])}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-300">
                Idle extraction channels {format(networkPulse)} flow/sec back to the Heart.
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-cyan-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-cyan-200/80">Commands</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {buttons.map(({ icon: Icon, label, onClick, glow }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-purple-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${glow} opacity-40`} />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{label}</p>
                        <p className="text-xs text-slate-300">
                          {label === "Explore Soil" && "Reveal hidden pockets and junctions."}
                          {label === "Upgrade Node" && "Refine absorbers to pull faster."}
                          {label === "Reinforce Hyphae" && "Widen stressed connections."}
                          {label === "Purify Toxins" && "Cleanse corrupted soil to restore flow."}
                        </p>
                      </div>
                      <Icon className="h-5 w-5 text-purple-100" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-5 w-5 text-amber-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-amber-200/80">Fruiting & Evolution</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase text-slate-300">Prestige Level</p>
                  <p className="text-2xl font-semibold text-amber-100">{prestigeLevel}</p>
                </div>
                <button
                  onClick={prestige}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/80 to-purple-400/70 text-soil-900 font-semibold shadow hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-soil-900"
                  disabled={resources.sugar < 380 || nodes.filter((node) => node.discovered).length < 6}
                >
                  Trigger Fruiting
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Reset the network for spores. Requires 380 sugar and at least six discovered nodes. Upgrades persist.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {prestigeUpgrades.map((item) => {
                  const owned = purchasedUpgrades.includes(item.id);
                  const affordable = resources.spores >= item.cost;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-50">{item.name}</p>
                          <p className="text-xs text-slate-300">{item.description}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full border border-slate-700/60 text-amber-200 bg-amber-500/10">
                          {owned ? "Integrated" : `${item.cost} spores`}
                        </div>
                      </div>
                      <button
                        onClick={() => purchaseUpgrade(item.id)}
                        disabled={owned || !affordable}
                        className="text-sm font-semibold px-3 py-2 rounded-xl border border-amber-400/40 text-amber-100 bg-amber-500/10 hover:bg-amber-400/20 transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        {owned ? "Locked In" : "Weave Upgrade"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-amber-200/80">Events</p>
              </div>
              <ul
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="space-y-2 text-sm text-slate-200"
              >
                {events.map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="h-2 w-2 mt-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(124,58,237,0.65)]" />
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <MapIcon className="h-5 w-5 text-purple-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-purple-200/80">Network Map</p>
              </div>
              <div className="rounded-3xl border border-slate-800/60 hyphae-grid relative h-[440px] overflow-hidden">
                <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {edges.map((edge) => {
                    const from = nodeMap[edge.from];
                    const to = nodeMap[edge.to];
                    if (!from || !to || !from.discovered || !to.discovered) return null;
                    const opacity = Math.min(1, 0.25 + edge.strain);
                    return (
                      <line
                        key={edge.id}
                        x1={from.position.x}
                        y1={from.position.y}
                        x2={to.position.x}
                        y2={to.position.y}
                        stroke={edge.strain > 1 ? "#fb7185" : "url(#hyphae)"}
                        strokeWidth={Math.max(0.75, Math.min(2.4, edge.capacity / 28))}
                        opacity={opacity}
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="hyphae" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {discoveredNodes.map((node) => {
                  const colorMap: Record<NodeType, string> = {
                    heart: "from-purple-500 to-indigo-500",
                    junction: "from-slate-200 to-purple-200",
                    water: "from-cyan-400 to-sky-400",
                    carbon: "from-slate-300 to-slate-100",
                    nutrient: "from-lime-400 to-amber-300",
                    ancient: "from-amber-400 to-purple-300",
                    artery: "from-purple-300 to-cyan-200",
                    enzyme: "from-emerald-300 to-lime-300",
                    spore: "from-amber-300 to-rose-200",
                    toxic: node.purified ? "from-emerald-400 to-cyan-400" : "from-rose-500 to-amber-500",
                    rival: "from-slate-200 to-red-300",
                    spring: "from-cyan-300 to-emerald-300",
                  };

                  const pulse = node.type === "heart" ? "animate-pulse" : "";

                  return (
                    <div
                      key={node.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 select-none`}
                      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                    >
                      <div
                        className={`relative rounded-full px-3 py-2 bg-gradient-to-r ${colorMap[node.type]} text-soil-900 shadow-lg ${pulse}`}
                      >
                        <p className="text-xs font-semibold">{node.name}</p>
                        <p className="text-[11px] text-soil-800/80">LV {node.upgradeLevel + 1}</p>
                        {node.type === "toxic" && !node.purified && (
                          <div className="absolute -right-2 -top-2 bg-amber-400 text-soil-900 text-[10px] font-bold px-2 py-1 rounded-full shadow">
                            Toxic
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm text-slate-200">
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-purple-200/80">Flow</p>
                  <p className="text-lg font-semibold text-purple-50">{format(flowRate)} /s</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Clog Risk</p>
                  <p className="text-lg font-semibold text-amber-100">{cloggedEdges.length} branches</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-lime-200/80">Maintenance</p>
                  <p className="text-lg font-semibold text-lime-50">-{format(edges.length * 0.35)} sugar</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-200/80">Pulse</p>
                  <p className="text-lg font-semibold text-slate-50">{format(networkPulse)} /s</p>
                </div>
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <BadgeCheck className="h-5 w-5 text-lime-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-lime-200/80">Active Nodes</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {discoveredNodes.map((node) => (
                  <div key={node.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-50">{node.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-slate-700/60 text-slate-200">
                        LV {node.upgradeLevel + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 min-h-[40px]">{node.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      {node.type === "toxic" && !node.purified ? (
                        <div className="flex items-center gap-1 text-amber-200">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Corroding hyphae</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-lime-200">
                          <Flame className="h-4 w-4" />
                          <span>Flow stable</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
