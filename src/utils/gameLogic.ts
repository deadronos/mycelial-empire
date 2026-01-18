import type { Edge, Node, ResourceKey } from "../types/game";

/**
 * Calculates the various game effects based on the list of purchased prestige upgrades.
 *
 * @param purchasedUpgrades - An array of IDs of the upgrades the player has purchased.
 * @returns An object containing multipliers and bonus values for different game mechanics.
 */
export const calculatePrestigeEffects = (purchasedUpgrades: string[]) => {
  const purchased = new Set(purchasedUpgrades);
  return {
    /** Multiplier for resource production from nodes. */
    resourceYield: purchased.has("rich-mycelium") ? 1.2 : 1,
    /** Multiplier for the capacity of edges. */
    edgeCapacity: purchased.has("tensile-hyphae") ? 1.25 : 1,
    /** Multiplier for the negative effects of toxic nodes (lower is better). */
    toxinMitigation: purchased.has("enzyme-membrane") ? 0.45 : 1,
    /** Multiplier for resource conversion efficiency. */
    conversionBonus: purchased.has("fermentation") ? 1.25 : 1,
    /** Multiplier for spore generation. */
    sporeBonus: purchased.has("spore-alchemy") ? 1.3 : 1,
    /** Multiplier for exploration cost (lower is better). */
    exploreDiscount: purchased.has("scent-trails") ? 0.75 : 1,
    /** Flat bonus to capacity for new edges created during exploration. */
    exploreCapacityBoost: purchased.has("tensile-hyphae") ? 4 : 0,
  };
};

/**
 * Calculates the current resource yield of a node, factoring in upgrade level and prestige effects.
 *
 * @param node - The node to calculate yield for.
 * @param resourceYieldMultiplier - The global resource yield multiplier from prestige effects.
 * @returns A partial record of resource keys mapped to their calculated yield values.
 */
export const calculateNodeYield = (
  node: Node,
  resourceYieldMultiplier: number
): Partial<Record<ResourceKey, number>> => {
  if (!node.yield) return {};
  const multiplier = (1 + node.upgradeLevel * 0.35) * resourceYieldMultiplier;
  return Object.fromEntries(
    Object.entries(node.yield).map(([key, value]) => [
      key,
      (value ?? 0) * multiplier,
    ])
  ) as Partial<Record<ResourceKey, number>>;
};

/**
 * Determines if an edge is active based on whether both its connected nodes are discovered.
 *
 * @param edge - The edge to check.
 * @param nodeMap - A dictionary mapping node IDs to Node objects.
 * @returns True if both the start and end nodes of the edge are discovered, false otherwise.
 */
export const isEdgeActive = (
  edge: Edge,
  nodeMap: Record<string, Node>
): boolean => {
  const from = nodeMap[edge.from];
  const to = nodeMap[edge.to];
  return !!(from?.discovered && to?.discovered);
};
