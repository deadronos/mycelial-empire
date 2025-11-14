import { RESOURCE_CAPS, type ResourceType } from "@/types/graph";
import { useGameStore } from "@/state/useGameStore";
import { formatNumber, percentFromFraction } from "@/lib/numbers";

const RESOURCE_ORDER: ResourceType[] = ["sugar", "water", "carbon", "nutrients", "spores"];

const ACCENTS: Record<ResourceType, string> = {
  sugar: "from-amber-400/80 to-rose-500/60",
  water: "from-cyan-400/80 to-sky-500/60",
  carbon: "from-slate-200/80 to-slate-500/60",
  nutrients: "from-lime-200/80 to-emerald-500/60",
  spores: "from-violet-400/80 to-fuchsia-500/60",
};

export const ResourceTray = () => {
  const resources = useGameStore((state) => state.resources);
  const stats = useGameStore((state) => state.stats);

  const perSecondMap: Partial<Record<ResourceType, number>> = {
    sugar: stats.netSugar,
    water: stats.waterPerSec,
    carbon: stats.carbonPerSec,
    nutrients: stats.nutrientsPerSec,
  };

  return (
    <div className="flex flex-col gap-2 text-xs text-slate-100">
      {RESOURCE_ORDER.map((type) => (
        <ResourcePill
          key={type}
          label={type}
          value={resources[type]}
          perSecond={perSecondMap[type] ?? 0}
          cap={RESOURCE_CAPS[type]}
          gradient={ACCENTS[type]}
        />
      ))}
      <div className="text-[0.7rem] text-slate-400">
        Network Health: <span className="text-emerald-300">{percentFromFraction(stats.networkHealth)}</span>
      </div>
    </div>
  );
};

interface ResourcePillProps {
  label: string;
  value: number;
  perSecond: number;
  cap: number;
  gradient: string;
}

const ResourcePill = ({ label, value, perSecond, cap, gradient }: ResourcePillProps) => {
  const pct = Math.min(100, (value / cap) * 100);
  const isPositive = perSecond >= 0;

  return (
    <div className="min-w-[220px] rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 shadow-panel">
      <div className="flex items-baseline justify-between gap-2 uppercase tracking-wide">
        <span className="text-[0.65rem] text-slate-500">{label}</span>
        <span className="text-sm text-slate-50">{formatNumber(value)}</span>
        <span className="text-[0.65rem] text-slate-500">/ {formatNumber(cap)}</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800/80">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[0.65rem] text-slate-400">
        {isPositive ? "+" : ""}
        {formatNumber(perSecond)} /s
      </div>
    </div>
  );
};
