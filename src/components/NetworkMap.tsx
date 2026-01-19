import { Map as MapIcon } from "lucide-react";
import { useMemo } from "react";

import { format, useGameStore } from "@/store/gameStore";
import { getNodeGradient } from "@/utils/uiConstants";

export const NetworkMap = () => {
  const { nodes, edges, flowRate } = useGameStore();

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const discoveredNodes = nodes.filter((node) => node.discovered);

  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
        <MapIcon className="h-4 w-4 text-purple-300" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-purple-200/80">
          Network Map
        </p>
      </div>

      <div className="absolute bottom-3 right-3 z-20 pointer-events-none text-[10px] bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/5">
        <span className="text-slate-400">Net Flow: </span>
        <span className="text-purple-300 font-bold">{format(flowRate)}/s</span>
      </div>

      <div className="flex-1 hyphae-grid relative overflow-hidden group">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to || !from.discovered || !to.discovered) return null;
            const opacity = Math.min(1, 0.25 + edge.strain);
            return (
              <line
                key={edge.id}
                x1={from.position.x}
                y1={from.position.y}
                x2={to.position.x}
                y2={to.position.y}
                stroke={edge.strain > 1 ? "#fb7185" : "url(#hyphae)"}
                strokeWidth={Math.max(0.75, Math.min(2.4, edge.capacity / 28))}
                opacity={opacity}
                strokeLinecap="round"
                filter="url(#glow)"
              />
            );
          })}
          <defs>
            <linearGradient id="hyphae" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {discoveredNodes.map((node) => {
          const isHeart = node.type === "heart";
          const pulse = isHeart ? "animate-pulse" : "";

          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 select-none z-10`}
              style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
            >
              <div
                className={`relative rounded-full px-2 py-1 bg-gradient-to-r ${getNodeGradient(node)} text-soil-900 shadow-lg border border-white/20 hover:scale-110 transition-transform cursor-default ${pulse}`}
              >
                <p className="text-[9px] font-bold leading-none">{node.name}</p>
                <div className="flex items-center justify-between text-[7px] font-medium opacity-80 mt-0.5">
                  <span>LV {node.upgradeLevel + 1}</span>
                  {node.type === "toxic" && !node.purified && (
                     <span className="bg-red-500/80 text-white px-1 rounded-full ml-1">!</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
