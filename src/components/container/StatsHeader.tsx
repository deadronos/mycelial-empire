import { Network, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

import { format, useGameStore } from "@/store/gameStore";
import { calculateNetworkHealth,calculatePrestigeEffects, createNodeMap } from "@/utils/gameLogic";

export const StatsHeader = () => {
  const { flowRate, nodes, edges, purchasedUpgrades } = useGameStore();

  const nodeMap = useMemo(() => createNodeMap(nodes), [nodes]);

  const prestigeEffects = useMemo(
    () => calculatePrestigeEffects(purchasedUpgrades),
    [purchasedUpgrades],
  );

  const networkHealth = useMemo(
    () => calculateNetworkHealth(edges, nodes, prestigeEffects.toxinMitigation, nodeMap),
    [edges, nodes, prestigeEffects.toxinMitigation, nodeMap]
  );

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
