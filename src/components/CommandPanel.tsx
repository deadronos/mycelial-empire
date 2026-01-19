import { ArrowUpCircle, Map as MapIcon, ShieldCheck, TestTubeDiagonal } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";

export const CommandPanel = () => {
  const { explore, upgrade, reinforce, purify } = useGameStore();

  const commands = [
    { label: "Explore Soil", onClick: explore, icon: MapIcon, color: "text-purple-300", glow: "from-purple-500/20 to-cyan-400/10" },
    { label: "Upgrade Node", onClick: upgrade, icon: ArrowUpCircle, color: "text-lime-300", glow: "from-lime-400/20 to-purple-400/10" },
    { label: "Reinforce Hyphae", onClick: reinforce, icon: ShieldCheck, color: "text-cyan-300", glow: "from-cyan-400/20 to-purple-400/10" },
    { label: "Purify Toxins", onClick: purify, icon: TestTubeDiagonal, color: "text-amber-300", glow: "from-amber-400/20 to-rose-400/10" },
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {commands.map(({ icon: Icon, label, onClick, color, glow }) => (
        <Button
          key={label}
          variant="outline"
          onClick={onClick}
          className={`h-auto py-2.5 px-3 justify-start gap-3 bg-black/40 border-white/10 hover:border-purple-400/40 relative overflow-hidden group transition-all`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <Icon className={`h-4 w-4 relative z-10 ${color}`} />
          <div className="text-left relative z-10">
            <p className="text-xs font-semibold text-slate-100">{label}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};
