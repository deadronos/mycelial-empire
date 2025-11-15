import { formatNumber } from "@/lib/numbers";
import { useGameStore } from "@/state/useGameStore";
import { RESOURCE_CAPS, type ResourceType } from "@/types/graph";

const RESOURCE_ORDER: ResourceType[] = ["sugar", "water", "carbon", "nutrients", "spores"];

const RESOURCE_META: Record<
  ResourceType,
  {
    label: string;
    gradient: string;
  }
> = {
  sugar: {
    label: "Sugar",
    gradient: "from-amber-400/70 via-rose-500/60 to-fuchsia-500/60",
  },
  water: {
    label: "Water",
    gradient: "from-cyan-400/70 via-sky-500/60 to-indigo-500/60",
  },
  carbon: {
    label: "Carbon",
    gradient: "from-slate-200/70 via-slate-400/60 to-slate-500/60",
  },
  nutrients: {
    label: "Nutrients",
    gradient: "from-lime-200/70 via-emerald-400/60 to-emerald-500/60",
  },
  spores: {
    label: "Spore Dust",
    gradient: "from-violet-400/70 via-fuchsia-500/60 to-rose-500/60",
  },
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
    <div className="flex flex-wrap gap-3 text-xs">
      {RESOURCE_ORDER.map((type) => (
        <ResourcePill
          key={type}
          label={RESOURCE_META[type].label}
          value={resources[type]}
          perSecond={perSecondMap[type] ?? 0}
          cap={RESOURCE_CAPS[type]}
          gradient={RESOURCE_META[type].gradient}
        />
      ))}
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
    <div className="relative flex min-w-[200px] flex-col gap-2 rounded-full border border-slate-800/70 bg-slate-950/80 px-5 py-3 shadow-[0_0_24px_rgba(15,23,42,0.65)] backdrop-blur">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">{label}</div>
        <div className="flex items-baseline gap-2 text-sm text-slate-100">
          <span>{formatNumber(value)}</span>
          <span className="text-[0.6rem] text-slate-500">/ {formatNumber(cap)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-[0.65rem] text-slate-400">
        <span>Rate</span>
        <span className={isPositive ? "text-emerald-300" : "text-rose-300"}>
          {isPositive ? "+" : ""}
          {formatNumber(perSecond)} /s
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/80">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
