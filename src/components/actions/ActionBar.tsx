import {
  ActivitySquare,
  Compass,
  Hammer,
  type LucideIcon,
  Settings2,
} from "lucide-react";
import { type ReactNode, useCallback, useMemo } from "react";

import { formatNumber } from "@/lib/numbers";
import {
  EXPLORE_COST,
  HYPHAE_UPGRADE_BASE_COST,
  NODE_UPGRADE_COST,
  useGameStore,
} from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";

interface ActionDefinition {
  icon: LucideIcon;
  label: string;
  description: string;
  hint: string;
  handler: () => { ok: boolean; message: string };
  title: string;
  tone: "primary" | "secondary";
}

export const ActionBar = () => {
  const explore = useGameStore((state) => state.explore);
  const upgradeHyphae = useGameStore((state) => state.upgradeHyphae);
  const upgradeBestNode = useGameStore((state) => state.upgradeBestNode);
  const hyphaeLevel = useGameStore((state) => state.upgrades.hyphaeLevel);
  const stats = useGameStore((state) => state.stats);
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);
  const pushToast = useUiStore((state) => state.pushToast);

  const actions = useMemo<ActionDefinition[]>(
    () => [
      {
        icon: Compass,
        label: "Explore",
        description: "Probe the surrounding soil for new resource pockets.",
        hint: `-${formatNumber(EXPLORE_COST)} sugar`,
        handler: explore,
        title: "Exploration",
        tone: "primary",
      },
      {
        icon: ActivitySquare,
        label: "Widen Hyphae",
        description: "Thicken primary conduits to boost throughput.",
        hint: `-${formatNumber(HYPHAE_UPGRADE_BASE_COST * (hyphaeLevel + 1))} sugar`,
        handler: upgradeHyphae,
        title: "Hyphae upgrade",
        tone: "primary",
      },
      {
        icon: Hammer,
        label: "Tune Node",
        description: "Reinforce the most strained pocket in the lattice.",
        hint: `-${formatNumber(NODE_UPGRADE_COST)}+ sugar`,
        handler: upgradeBestNode,
        title: "Node tuning",
        tone: "secondary",
      },
    ],
    [explore, hyphaeLevel, upgradeBestNode, upgradeHyphae]
  );

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
    <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-white/6 bg-white/4 bg-clip-padding px-4 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-md text-slate-50">
      <div className="flex flex-1 flex-wrap gap-3">
        {actions.map((action) => (
          <ActionButton
            key={action.label}
            icon={<action.icon className="h-4 w-4" />}
            label={action.label}
            description={action.description}
            hint={action.hint}
            tone={action.tone}
            onClick={() => runAction(action.handler, action.title)}
          />
        ))}
      </div>
      <div className="flex flex-col items-end text-right text-[0.65rem] text-slate-400">
        <span className="uppercase tracking-[0.3em]">Hyphae tier {hyphaeLevel + 1}</span>
        <span className="text-[0.65rem] text-slate-500">
          Net sugar {stats.netSugar >= 0 ? "+" : ""}
          {formatNumber(stats.netSugar)} /s
        </span>
      </div>
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/6 bg-white/4 text-slate-300 transition hover:text-white"
        aria-label="Open settings"
      >
        <Settings2 className="h-5 w-5" />
      </button>
    </div>
  );
};

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  description: string;
  hint: string;
  onClick: () => void;
  tone: "primary" | "secondary";
}

const ActionButton = ({ icon, label, description, hint, onClick, tone }: ActionButtonProps) => {
  const toneStyles =
    tone === "primary"
      ? "border-emerald-500/60 bg-emerald-500/12 text-emerald-100 hover:bg-emerald-500/20 backdrop-blur-sm"
      : "border-white/6 bg-white/3 text-slate-200 hover:bg-white/6 backdrop-blur-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-[120px] sm:min-w-[200px] flex-1 flex-col gap-2 rounded-3xl border px-4 py-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.45)] transition ${toneStyles}`}
    >
      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em]">
        <span className="flex items-center gap-2 text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/6 bg-white/6 text-slate-200">
            {icon}
          </span>
          {label}
        </span>
        <span className="text-emerald-200">{hint}</span>
      </div>
      <div className="text-[0.8rem] text-slate-200/90 group-hover:text-slate-100">{description}</div>
    </button>
  );
};
