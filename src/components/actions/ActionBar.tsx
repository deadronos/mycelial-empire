import { Settings2 } from "lucide-react";
import { useCallback } from "react";

import { useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";

export const ActionBar = () => {
  const explore = useGameStore((state) => state.explore);
  const upgradeHyphae = useGameStore((state) => state.upgradeHyphae);
  const upgradeBestNode = useGameStore((state) => state.upgradeBestNode);
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);
  const pushToast = useUiStore((state) => state.pushToast);

  const setLatestMessage = useUiStore((state) => state.setLatestMessage);

  const runAction = useCallback(
    (action: () => { ok: boolean; message: string }, title: string) => {
      const outcome = action();
      pushToast({
        title: outcome.ok ? `${title} complete` : `${title} blocked`,
        description: outcome.message,
        intent: outcome.ok ? "success" : "error",
      });
      setLatestMessage(outcome.message);
    },
    [pushToast, setLatestMessage]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionButton
        icon="🔍"
        label="Explore"
        hotkey="E"
        onClick={() => runAction(explore, "Exploration")}
      />
      <ActionButton
        icon="⬆️"
        label="Upgrade Hyphae"
        hotkey="U"
        onClick={() => runAction(upgradeHyphae, "Hyphae upgrade")}
      />
      <ActionButton
        icon="🍄"
        label="Tune Node"
        hotkey="N"
        onClick={() => runAction(upgradeBestNode, "Node tuning")}
        secondary
      />
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-700 text-slate-300 bg-slate-900/70 hover:bg-slate-800/80 text-xs transition"
        aria-label="Open settings"
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span>Settings</span>
      </button>
    </div>
  );
};

interface ActionButtonProps {
  icon: string;
  label: string;
  hotkey: string;
  onClick: () => void;
  secondary?: boolean;
}

const ActionButton = ({ icon, label, hotkey, onClick, secondary }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition " +
      (secondary
        ? "border-slate-700 text-slate-300 bg-slate-900/70 hover:bg-slate-800/80"
        : "border-emerald-500/70 text-emerald-100 bg-emerald-600/20 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.4)]")
    }
  >
    <span>{icon}</span>
    <span>{label}</span>
    <span className="text-[0.6rem] text-slate-400 ml-1">[{hotkey}]</span>
  </button>
);
