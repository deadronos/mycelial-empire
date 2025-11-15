import { formatNumber, percentFromFraction } from "@/lib/numbers";
import { useGameStore } from "@/state/useGameStore";
import { RESOURCE_CAPS, type ResourceType } from "@/types/graph";

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
    <div className="flex gap-4 text-xs">
      {RESOURCE_ORDER.map((type) => (
        <ResourcePill
          key={type}
          label={type}
          value={resources[type]}
          cap={RESOURCE_CAPS[type]}
          gradient={ACCENTS[type]}
        />
      ))}
    </div>
  );
};

interface ResourcePillProps {
  label: string;
  value: number;
  cap: number;
  gradient: string;
}

const ResourcePill = ({ label, value, cap, gradient }: ResourcePillProps) => {
  const pct = Math.min(100, (value / cap) * 100);

  return (
    <div className="relative px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 shadow-inner flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className="text-[0.65rem] uppercase tracking-wide text-slate-400">{label}</span>
        <span className="text-xs text-slate-50">{formatNumber(value)}</span>
        <span className="text-[0.6rem] text-slate-500">/ {formatNumber(cap)}</span>
      </div>
      <div className="mt-0.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
