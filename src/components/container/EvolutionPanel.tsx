import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prestigeUpgrades, useGameStore } from "@/store/gameStore";

export const EvolutionPanel = () => {
  const { resources, prestigeLevel, purchasedUpgrades, nodes, prestige, purchaseUpgrade } = useGameStore();

  const discoveredCount = nodes.filter((n) => n.discovered).length;
  const canPrestige = resources.sugar >= 380 && discoveredCount >= 6;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
        <div>
          <p className="text-[10px] uppercase text-slate-400">Level</p>
          <p className="text-xl font-bold text-amber-200">{prestigeLevel}</p>
        </div>
        <Button
          size="sm"
          onClick={prestige}
          disabled={!canPrestige}
          className="bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white border-0"
        >
          Fruiting
        </Button>
      </div>

      <div className="space-y-2">
        {prestigeUpgrades.map((item) => {
          const owned = purchasedUpgrades.includes(item.id);
          const affordable = resources.spores >= item.cost;
          return (
            <div
              key={item.id}
              className="p-2.5 rounded-lg border border-white/5 bg-black/40 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-100">{item.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{item.description}</p>
                </div>
                <Badge variant={owned ? "default" : "outline"} className="text-[9px] shrink-0">
                  {owned ? "Owned" : `${item.cost} SP`}
                </Badge>
              </div>
              {!owned && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => purchaseUpgrade(item.id)}
                  disabled={!affordable}
                  className="w-full h-7 text-[10px] border border-amber-500/30 text-amber-200 hover:bg-amber-500/10"
                >
                  Weave Upgrade
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
