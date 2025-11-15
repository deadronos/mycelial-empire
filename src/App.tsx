import { ActionBar } from "@/components/actions/ActionBar";
import { ResourceTray } from "@/components/hud/ResourceTray";
import { StatsPanel } from "@/components/hud/StatsPanel";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { ToastHub } from "@/components/ui/ToastHub";
import { GraphScene } from "@/graphics/GraphScene";
import { useAutosave } from "@/hooks/useAutosave";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useHydrateFromStorage } from "@/hooks/useHydrateFromStorage";
import { useGameStore } from "@/state/useGameStore";

const App = () => {
  useGameLoop();
  useAutosave();
  useHydrateFromStorage();

  const tick = useGameStore((state) => state.tick);

  return (
    <div className="min-h-screen bg-[#050609] text-slate-50 font-mono">
      <SettingsDialog />
      <ToastHub />
      
      {/* Top resource bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-950/80 to-slate-900/80 backdrop-blur">
        <ResourceTray />
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" />
          <span>Network stable</span>
          <span className="ml-2 text-slate-500">Tick {tick.toLocaleString()}</span>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex h-[calc(100vh-52px)] overflow-hidden">
        {/* Left: Graph + actions */}
        <div className="flex-1 flex flex-col">
          {/* Graph area */}
          <div className="relative flex-1 m-3 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 shadow-[0_0_40px_rgba(15,23,42,0.8)] overflow-hidden">
            <GraphScene />
          </div>

          {/* Action bar */}
          <div className="px-3 pb-3">
            <ActionBar />
          </div>
        </div>

        {/* Right: Stats sidebar */}
        <aside className="w-64 border-l border-slate-800 bg-slate-950/90 backdrop-blur-sm">
          <StatsPanel />
        </aside>
      </main>
    </div>
  );
}

export default App;
