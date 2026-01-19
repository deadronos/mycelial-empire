import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore } from "@/store/gameStore";

export const EventLog = () => {
  const { events } = useGameStore();

  return (
    <Card className="bg-white/5 border-white/10 flex flex-col h-full overflow-hidden">
      <CardHeader className="py-2 px-3 flex flex-row items-center gap-2 space-y-0 flex-none">
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
          Neural Events
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full pr-3">
          <ul className="space-y-1.5 text-[11px] text-slate-300 py-1">
            {events.map((event, index) => (
              <li key={index} className="flex items-start gap-2 group">
                <span className="h-1.5 w-1.5 mt-1 rounded-full bg-purple-500/50 shrink-0 group-first:bg-purple-400 group-first:animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                <span className="leading-snug">{event}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
