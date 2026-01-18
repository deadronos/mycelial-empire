import { Flame, Leaf, Map as MapIcon, Sparkles, Trees } from "lucide-react";
import type { ReactNode } from "react";

import type { Node, NodeType, ResourceKey } from "../types/game";

/**
 * Order in which resources are displayed.
 */
export const resourceOrder: ResourceKey[] = ["sugar", "water", "carbon", "nutrients", "spores"];

/**
 * Renders a rotated map icon representing a droplet.
 *
 * @returns A JSX element containing the icon.
 */
const dropletIcon = <MapIcon className="h-4 w-4 text-cyan-200 rotate-90" />;

/**
 * Metadata for each resource type including label, color, and icon.
 */
export const resourceCopy: Record<ResourceKey, { label: string; color: string; icon: ReactNode }> = {
  sugar: { label: "Sugar", color: "text-purple-200", icon: <Sparkles className="h-4 w-4 text-purple-300" /> },
  water: { label: "Water", color: "text-cyan-200", icon: dropletIcon },
  carbon: { label: "Carbon", color: "text-slate-200", icon: <Flame className="h-4 w-4 text-slate-200" /> },
  nutrients: { label: "Nutrients", color: "text-lime-200", icon: <Leaf className="h-4 w-4 text-lime-200" /> },
  spores: { label: "Spore Dust", color: "text-amber-200", icon: <Trees className="h-4 w-4 text-amber-200" /> },
};

/**
 * Returns the gradient color class for a given node.
 *
 * @param node - The node to get the color for.
 * @returns The Tailwind class string for the gradient.
 */
export const getNodeGradient = (node: Node): string => {
  const colorMap: Record<Exclude<NodeType, "toxic">, string> = {
    heart: "from-purple-500 to-indigo-500",
    junction: "from-slate-200 to-purple-200",
    water: "from-cyan-400 to-sky-400",
    carbon: "from-slate-300 to-slate-100",
    nutrient: "from-lime-400 to-amber-300",
    ancient: "from-amber-400 to-purple-300",
    artery: "from-purple-300 to-cyan-200",
    enzyme: "from-emerald-300 to-lime-300",
    spore: "from-amber-300 to-rose-200",
    rival: "from-slate-200 to-red-300",
    spring: "from-cyan-300 to-emerald-300",
  };

  if (node.type === "toxic") {
    return node.purified ? "from-emerald-400 to-cyan-400" : "from-rose-500 to-amber-500";
  }

  return colorMap[node.type];
};
