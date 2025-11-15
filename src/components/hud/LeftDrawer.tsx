import { X } from "lucide-react";
import { useUiStore } from "@/state/useUiStore";
import { StatsPanel } from "@/components/hud/StatsPanel";

export const LeftDrawer = () => {
  const open = useUiStore((state) => state.leftDrawerOpen);
  const setOpen = useUiStore((state) => state.setLeftDrawerOpen);

  // Drawer open state does not modify global body overflow now;
  // We rely on `main` overflow rules for scroll behavior.

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform sm:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="h-full bg-slate-950/90 border-r border-slate-800 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Network</h3>
          <button onClick={() => setOpen(false)} aria-label="Close network drawer" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-800/70 text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-full overflow-auto">
          <StatsPanel />
        </div>
      </div>
    </div>
  );
};

export default LeftDrawer;
