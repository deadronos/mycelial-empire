import { useGameStore } from "@/state/useGameStore";
import { formatNumber, percentFromFraction } from "@/lib/numbers";

export const StatsPanel = () => {
  const stats = useGameStore((state) => state.stats);
  const edges = useGameStore((state) => state.edges);

  return (
    <div className="w-[240px] rounded-3xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-xs text-slate-300">
      <div className="text-[0.7rem] uppercase tracking-[0.15em] text-slate-500">Network</div>
      <StatRow label="Flow Pressure" value={percentFromFraction(stats.flowPressure)} highlight />
      <StatRow label="Hyphae" value={`${edges.length} paths`} />
      <StatRow label="Maintenance" value={`-${formatNumber(stats.maintenance)} /s`} />
      <StatRow label="Per Edge" value={`-${stats.maintenancePerEdge.toFixed(2)}`} />
      <StatRow label="Net Sugar" value={`${stats.netSugar >= 0 ? "+" : ""}${formatNumber(stats.netSugar)} /s`} highlight={stats.netSugar >= 0} />
    </div>
  );
};

const StatRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="mt-1 flex items-center justify-between">
    <span className="text-slate-500">{label}</span>
    <span className={highlight ? "text-emerald-300" : "text-slate-200"}>{value}</span>
  </div>
);
