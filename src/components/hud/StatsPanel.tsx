import { formatNumber, percentFromFraction } from "@/lib/numbers";
import { useGameStore } from "@/state/useGameStore";

export const StatsPanel = () => {
  const stats = useGameStore((state) => state.stats);
  const nodes = useGameStore((state) => state.nodes);
  const edges = useGameStore((state) => state.edges);
  const upgrades = useGameStore((state) => state.upgrades);

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="text-slate-300 uppercase tracking-wide text-[0.65rem]">Network Status</span>
        <span className="text-[0.6rem] text-slate-500">Live</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        <div>
          <div className="text-slate-400 mb-1">Flow Rates</div>
          <StatRow label="Water" value={`+${formatNumber(stats.waterPerSec)}/s`} />
          <StatRow label="Carbon" value={`+${formatNumber(stats.carbonPerSec)}/s`} />
          <StatRow label="Nutrients" value={`+${formatNumber(stats.nutrientsPerSec)}/s`} />
        </div>

        <div>
          <div className="text-slate-400 mb-1">Sugar Economy</div>
          <StatRow label="Gross Inflow" value={`+${formatNumber(stats.sugarFromPockets)}/s`} />
          <StatRow label="Maintenance" value={`-${formatNumber(stats.maintenance)}/s`} />
          <StatRow
            label="Net Sugar"
            value={`${stats.netSugar >= 0 ? "+" : ""}${formatNumber(stats.netSugar)}/s`}
            highlight
          />
        </div>

        <div>
          <div className="text-slate-400 mb-1">Network Shape</div>
          <StatRow label="Nodes" value={nodes.length.toString()} />
          <StatRow label="Hyphae" value={edges.length.toString()} />
          <StatRow label="Flow Pressure" value={percentFromFraction(stats.flowPressure)} />
        </div>

        <div>
          <div className="text-slate-400 mb-1">Upgrades</div>
          <StatRow label="Hyphae Level" value={upgrades.hyphaeLevel.toString()} />
          <StatRow
            label="Maintenance Red."
            value={`${(upgrades.maintenanceReduction * 100).toFixed(0)}%`}
          />
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800 text-[0.65rem] text-slate-500 leading-relaxed">
          Mycelial network spreading through the underground soil ecosystem.
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-slate-400">{label}</span>
    <span className={`ml-2 font-semibold ${highlight ? "text-emerald-300" : "text-slate-100"}`}>
      {value}
    </span>
  </div>
);
