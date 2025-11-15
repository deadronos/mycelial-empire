import { useRef } from "react";
import { Menu } from "lucide-react";
import { formatNumber, percentFromFraction } from "@/lib/numbers";
import { useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";
import { useAutosave } from "@/hooks/useAutosave";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useHydrateFromStorage } from "@/hooks/useHydrateFromStorage";
import { GraphScene } from "@/graphics/GraphScene";
import { ToastHub } from "@/components/ui/ToastHub";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { LeftDrawer } from "@/components/hud/LeftDrawer";
import { ResourceTray } from "@/components/hud/ResourceTray";
import { StatsPanel } from "@/components/hud/StatsPanel";
import { ActionBar } from "@/components/actions/ActionBar";

const App = () => {
  useGameLoop();
  useAutosave();
  useHydrateFromStorage();

  const tick = useGameStore((state) => state.tick);
  const stats = useGameStore((state) => state.stats);
  const setLeftDrawerOpen = useUiStore((state) => state.setLeftDrawerOpen);
  const centralRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const colonyState =
    stats.netSugar > 0
      ? "Hyphae thicken, channeling resources efficiently."
      : stats.netSugar < 0
        ? "Metabolic strain detected across the network."
        : "Flow equilibrium maintained.";

  const tickDisplay = tick.toLocaleString();
  const maintenanceDisplay = formatNumber(stats.maintenance);
  const sugarFromPockets = formatNumber(stats.sugarFromPockets);
  const netSugarDisplay = `${stats.netSugar >= 0 ? "+" : ""}${formatNumber(stats.netSugar)} /s`;
  const flowPressure = percentFromFraction(stats.flowPressure);
  const networkHealth = percentFromFraction(stats.networkHealth);

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <SettingsDialog />
      <ToastHub />
      <LeftDrawer />
      <header className="relative z-30 border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-800/70 bg-transparent text-slate-300 sm:hidden"
              onClick={() => setLeftDrawerOpen(true)}
              aria-label="Open network drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <ResourceTray />
          </div>
          <div className="flex items-center gap-3 text-[0.7rem] text-slate-400">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            <span className="hidden sm:inline">Network health {networkHealth}</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Tick {tickDisplay}</span>
          </div>
        </div>
      </header>
      <main ref={mainRef} className="relative flex-1 overflow-hidden">
          {/* Soft periphery dimming behind the central card (kept behind via z-index) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0)_45%,rgba(2,6,23,0.28)_100%)] opacity-60" />
        </div>
          {/* Canvas & overlay live inside the central card so the canvas is clipped to it */}
        <div className="relative z-20 flex h-full flex-col">
          <div className="flex-1">
            <div className="mx-auto flex h-full w-full max-w-6xl gap-6 px-6 py-6">
              <div className="flex min-h-[520px] h-full flex-1 flex-col">
                <div
                  ref={centralRef}
                  className="relative flex-1 overflow-hidden rounded-[32px] border border-slate-800/60 bg-gradient-to-t from-white/8 via-white/4 to-slate-900/12 backdrop-blur-lg shadow-[0_35px_90px_rgba(2,6,23,0.65)] ring-1 ring-white/6"
                >
                  {/* subtle milky overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-white/3 mix-blend-overlay opacity-6" />
                  {/* inner vignette shadow for depth */}
                  <div className="pointer-events-none absolute inset-0 z-[12] rounded-[32px] inner-vignette" />
                  <div className="absolute inset-0 z-0 w-full h-full">
                    <GraphScene />
                    <div className="noise-overlay" />
                  </div>
                  {/* optional mask overlay removed when canvas is inside the card to keep clipping predictable */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(45,212,191,0.06),transparent_60%),radial-gradient(circle_at_85%_80%,rgba(129,140,248,0.06),transparent_60%)]" />
                  <div className="pointer-events-none absolute inset-x-6 top-6 flex justify-between text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                    <div>Colony pulse</div>
                    <div className="text-fuchsia-200">Flow pressure {flowPressure}</div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-col gap-2 rounded-2xl border border-emerald-500/30 bg-black/35 px-5 py-4 text-sm text-emerald-100/90 backdrop-blur">
                    <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-emerald-200">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                      Cycle monitor
                    </div>
                    <div className="text-[0.95rem] text-slate-100">{colonyState}</div>
                    <div className="text-[0.75rem] text-slate-300">
                      Intake +{sugarFromPockets} /s · Maintenance {maintenanceDisplay} /s · Net {netSugarDisplay}
                    </div>
                  </div>
                  <div className="absolute left-6 right-6 bottom-6 z-20">
                    <ActionBar />
                  </div>
                </div>
              </div>
              <aside className="w-full max-w-xs hidden sm:block">
                <StatsPanel />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
