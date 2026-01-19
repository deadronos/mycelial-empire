import { Network, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

import { format, useGameStore } from "@/store/gameStore";
import { calculatePrestigeEffects, isEdgeActive } from "@/utils/gameLogic";

export const StatsHeader = () => {
  const { flowRate, nodes, edges, purchasedUpgrades } = useGameStore();

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);

  const cloggedEdges = useMemo(
    () => edges.filter((edge) => edge.strain > 1 && isEdgeActive(edge, nodeMap)),
    [edges, nodeMap],
  );

  const prestigeEffects = useMemo(
    () => calculatePrestigeEffects(purchasedUpgrades),
    [purchasedUpgrades],
  );

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

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 px-6 pt-4 flex-none">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-purple-200/80">Mycelial Empire</p>
        <h1 className="text-2xl font-semibold text-slate-50 drop-shadow-hyphae">
          Beneath the canopy...
        </h1>
      </div>
      <div className="flex gap-4 items-center backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-purple-300" />
          <div>
            <p className="text-[10px] uppercase text-slate-400">Flow Rate</p>
            <p className="text-sm font-semibold text-purple-50">{format(flowRate)} /s</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-lime-300" />
          <div>
            <p className="text-[10px] uppercase text-slate-400">Health</p>
            <p className="text-sm font-semibold text-lime-50">{Math.round(networkHealth)}%</p>
          </div>
        </div>
      </div>
    </header>
  );
};
