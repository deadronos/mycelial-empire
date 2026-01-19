import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, useGameStore } from "@/store/gameStore";
import { resourceCopy, resourceOrder } from "@/utils/uiConstants";

export const ResourcePanel = () => {
  const { resources, pulse } = useGameStore();

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
      <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 space-y-0">
        <Activity className="h-4 w-4 text-purple-300" />
        <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-purple-200/80">
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {resourceOrder.map((key) => (
            <div
              key={key}
              className="border border-white/5 rounded-lg px-2 py-1.5 bg-black/20 flex flex-col gap-0.5 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                {resourceCopy[key].icon}
                <span className="uppercase tracking-wider">{resourceCopy[key].label}</span>
              </div>
              <p className={`text-base font-semibold ${resourceCopy[key].color}`}>
                {format(resources[key])}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[10px] text-slate-400 italic">
          Pulse: +{format(Math.max(0, pulse))} flow/s
        </div>
      </CardContent>
    </Card>
  );
};
