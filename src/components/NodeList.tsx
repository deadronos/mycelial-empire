import { BadgeCheck, Flame, AlertTriangle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const NodeList = () => {
  const { nodes } = useGameStore();
  const discoveredNodes = nodes.filter((n) => n.discovered);

  return (
    <Card className="bg-white/5 border-white/10 flex flex-col h-full overflow-hidden">
      <CardHeader className="py-2 px-3 flex flex-row items-center gap-2 space-y-0 flex-none">
        <BadgeCheck className="h-3.5 w-3.5 text-lime-300" />
        <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-lime-200/80">
          Active Nodes
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-2 py-1">
            {discoveredNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-lg border border-white/5 bg-black/20 p-2 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-100">{node.name}</p>
                  <Badge variant="outline" className="text-[8px] h-4 px-1 border-white/10">
                    LV {node.upgradeLevel + 1}
                  </Badge>
                </div>
                <p className="text-[9px] text-slate-400 leading-tight italic line-clamp-2">
                  {node.description}
                </p>
                <div className="flex items-center gap-1.5 text-[9px]">
                  {node.type === "toxic" && !node.purified ? (
                    <span className="flex items-center gap-1 text-amber-400">
                      <AlertTriangle className="h-2.5 w-2.5" /> Corroding
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-lime-400">
                      <Flame className="h-2.5 w-2.5" /> Stable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
