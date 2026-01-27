import { Crown, Zap } from "lucide-react";
import { useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CommandPanel, EventLog, EvolutionPanel, NetworkMap, NodeList, ResourcePanel, StatsHeader } from "./components/container";
import { useGameStore } from "./store/gameStore";

/**
 * The main application component for Mycelial Empire.
 *
 * Manages the game state and renders the responsive, no-scroll UI.
 *
 * @returns The rendered application component.
 */
const App = () => {
  const { tick } = useGameStore();

  useEffect(() => {
    const interval = window.setInterval(tick, 1200);
    return () => window.clearInterval(interval);
  }, [tick]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#04060f] text-slate-100 flex flex-col relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -left-10 top-10 w-72 h-72 bg-purple-500/10 blur-[120px]" />
        <div className="absolute right-10 top-20 w-64 h-64 bg-cyan-400/10 blur-[120px]" />
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-96 h-96 bg-lime-400/5 blur-[120px]" />
      </div>

      <StatsHeader />

      <div className="flex-1 flex gap-4 px-6 pb-6 min-h-0 z-10">
        {/* Left Control Panel */}
        <aside className="w-80 flex flex-col gap-4 flex-none overflow-hidden">
          <ResourcePanel />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Accordion type="multiple" defaultValue={["commands", "evolution"]} className="space-y-4">
              <AccordionItem value="commands" className="border-white/10 bg-white/5 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-cyan-300" />
                    <span className="uppercase text-[10px] tracking-[0.3em] text-cyan-200/80">Commands</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <CommandPanel />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="evolution" className="border-white/10 bg-white/5 rounded-2xl px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4 text-amber-300" />
                    <span className="uppercase text-[10px] tracking-[0.3em] text-amber-200/80">Fruiting & Evolution</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <EvolutionPanel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Center Map Area */}
        <main className="flex-1 min-w-0">
          <NetworkMap />
        </main>

        {/* Right Info Panels */}
        <aside className="w-72 flex flex-col gap-4 flex-none overflow-hidden text-slate-100">
          <div className="flex-1 overflow-hidden">
            <EventLog />
          </div>
          <div className="flex-1 overflow-hidden">
            <NodeList />
          </div>
        </aside>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default App;
