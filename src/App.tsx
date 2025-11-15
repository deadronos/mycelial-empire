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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <SettingsDialog />
      <ToastHub />
      <main className="relative h-screen overflow-hidden">
        <GraphScene />
        <div className="noise-overlay" />
        <div className="pointer-events-none absolute inset-0">
          <div className="pointer-events-auto absolute left-8 top-6">
            <ResourceTray />
          </div>
          <div className="pointer-events-auto absolute right-8 top-6">
            <StatsPanel />
          </div>
          <div className="pointer-events-auto absolute left-1/2 top-8 -translate-x-1/2">
            <div className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-fuchsia-200">
              Tick {tick.toLocaleString()}
            </div>
          </div>
          <div className="pointer-events-auto absolute left-8 bottom-10">
            <ActionBar />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
