import { ActivitySquare, Compass, Settings2 } from "lucide-react";
import { type ReactNode,useCallback } from "react";

import { formatNumber } from "@/lib/numbers";
import { EXPLORE_COST, HYPHAE_UPGRADE_BASE_COST, NODE_UPGRADE_COST,useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";

export const ActionBar = () => {
  const explore = useGameStore((state) => state.explore);
  const upgradeHyphae = useGameStore((state) => state.upgradeHyphae);
  const upgradeBestNode = useGameStore((state) => state.upgradeBestNode);
  const hyphaeLevel = useGameStore((state) => state.upgrades.hyphaeLevel);
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);
  const pushToast = useUiStore((state) => state.pushToast);

  const runAction = useCallback(
    (action: () => { ok: boolean; message: string }, title: string) => {
      const outcome = action();
      pushToast({
        title: outcome.ok ? `${title} complete` : `${title} blocked`,
        description: outcome.message,
        intent: outcome.ok ? "success" : "error",
      });
    },
    [pushToast]
  );

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-800/70 bg-slate-950/80 px-4 py-3">
      <ActionButton
        icon={<Compass className="h-4 w-4" />}
        label="Explore"
        hint={`-${formatNumber(EXPLORE_COST)} sugar`}
        onClick={() => runAction(explore, "Exploration")}
      />
      <ActionButton
        icon={<ActivitySquare className="h-4 w-4" />}
        label="Widen Hyphae"
        hint={`-${formatNumber(HYPHAE_UPGRADE_BASE_COST * (hyphaeLevel + 1))} sugar`}
        onClick={() => runAction(upgradeHyphae, "Hyphae upgrade")}
      />
      <ActionButton
        icon={<ActivitySquare className="h-4 w-4 rotate-45" />}
        label="Tune Node"
        hint={`-${formatNumber(NODE_UPGRADE_COST)}+ sugar`}
        onClick={() => runAction(upgradeBestNode, "Node tuning")}
      />
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800/80 bg-slate-900/60 text-slate-300 transition hover:text-white"
        aria-label="Open settings"
      >
        <Settings2 className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, hint, onClick }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500/20"
  >
    {icon}
    <span className="font-semibold uppercase tracking-wide">{label}</span>
    <span className="text-[0.65rem] text-emerald-200">{hint}</span>
  </button>
);
