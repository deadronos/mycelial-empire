import type { Edge, Node, ResourceKey, Resources } from "../types/game";
import { CONVERSION, COSTS, MAINTENANCE, SCALING } from "./constants";

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
 * Pre-calculates yields for all discovered nodes to optimize simulation performance.
 *
 * @param nodes - Array of all nodes in the network.
 * @param resourceYieldMultiplier - The global resource yield multiplier.
 * @returns A map of node IDs to their calculated yields.
 */
export const calculateAllDiscoveredYields = (
  nodes: Node[],
  resourceYieldMultiplier: number
): Record<string, Partial<Record<ResourceKey, number>>> => {
  const yields: Record<string, Partial<Record<ResourceKey, number>>> = {};
  nodes.forEach((node) => {
    if (node.discovered) {
      yields[node.id] = calculateNodeYield(node, resourceYieldMultiplier);
    }
  });
  return yields;
};

/**
 * Calculates resource accumulation for a tick.
 *
 * @param nodes - Array of discovered nodes.
 * @param nodeYields - Pre-calculated yields map.
 * @param prestigeEffects - Current prestige bonuses.
 * @returns An object containing the base resource gains and sugar gain.
 */
export const calculateResourceAccumulation = (
  nodes: Node[],
  nodeYields: Record<string, Partial<Record<ResourceKey, number>>>,
  prestigeEffects: ReturnType<typeof calculatePrestigeEffects>
) => {
  const gains: Partial<Record<ResourceKey, number>> = {
    sugar: 0,
    water: 0,
    carbon: 0,
    nutrients: 0,
    spores: 0,
  };
  let flow = 0;

  nodes.forEach((node) => {
    const yieldValues = nodeYields[node.id] || {};
    Object.entries(yieldValues).forEach(([key, value]) => {
      const resourceKey = key as ResourceKey;
      gains[resourceKey] = (gains[resourceKey] || 0) + (value ?? 0);
      flow += value ?? 0;
    });

    // Special node type bonuses
    if (node.type === "ancient") {
      gains.spores = (gains.spores || 0) + 0.15 * prestigeEffects.sporeBonus;
      gains.sugar = (gains.sugar || 0) + 1.3;
    }
    if (node.type === "spore") {
      gains.spores = (gains.spores || 0) + 0.25 * prestigeEffects.sporeBonus;
      gains.sugar = (gains.sugar || 0) + 1.1;
    }
    if (node.type === "enzyme") {
      gains.sugar = (gains.sugar || 0) + 0.4;
    }
    if (node.type === "rival") {
      gains.sugar = (gains.sugar || 0) - 1.5;
    }
    if (node.type === "toxic" && !node.purified) {
      gains.sugar = (gains.sugar || 0) - 1.1 * prestigeEffects.toxinMitigation;
    }
  });

  return { gains, flow };
};

/**
 * Performs resource processing at junction nodes.
 *
 * @param currentResources - Current resource totals.
 * @param processingNodesCount - Number of discovered junction nodes.
 * @param prestigeEffects - Current prestige bonuses.
 * @returns Updated resources and additional sugar gain.
 */
export const performResourceProcessing = (
  currentResources: Resources,
  processingNodesCount: number,
  prestigeEffects: ReturnType<typeof calculatePrestigeEffects>
) => {
  const updated = { ...currentResources };
  let sugarGain = 0;

  const conversionPotential = Math.min(
    updated.water * CONVERSION.POTENTIAL_FACTOR,
    updated.carbon * CONVERSION.POTENTIAL_FACTOR,
    CONVERSION.MAX_PER_NODE * processingNodesCount
  );

  if (conversionPotential > 0) {
    updated.water -= conversionPotential * CONVERSION.RESOURCE_CONSUMPTION;
    updated.carbon -= conversionPotential * CONVERSION.RESOURCE_CONSUMPTION;
    sugarGain =
      conversionPotential *
      (CONVERSION.BASE_SUGAR_YIELD + processingNodesCount * CONVERSION.NODE_BONUS) *
      prestigeEffects.conversionBonus;
  }

  return { updatedResources: updated, sugarGain };
};

/**
 * Calculates edge strain based on throughput and capacity.
 *
 * @param edges - Array of game edges.
 * @param nodes - Array of game nodes.
 * @param nodeYields - Pre-calculated node yields.
 * @param prestigeEffects - Current prestige bonuses.
 * @returns Updated edges with calculated strain.
 */
export const calculateEdgesWithStrain = (
  edges: Edge[],
  nodes: Node[],
  nodeYields: Record<string, Partial<Record<ResourceKey, number>>>,
  prestigeEffects: ReturnType<typeof calculatePrestigeEffects>
): Edge[] => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return edges.map((edge) => {
    const toNode = nodeMap[edge.to];
    const fromNode = nodeMap[edge.from];
    const active = toNode?.discovered && fromNode?.discovered;

    if (!active) return { ...edge, strain: 0 };

    const yieldValues = nodeYields[edge.to] || {};
    const throughput = Object.values(yieldValues).reduce((sum, val) => sum + (val ?? 0), 0);
    const toxicity =
      toNode?.type === "toxic" && !toNode.purified
        ? MAINTENANCE.TOXIC_STRAIN * prestigeEffects.toxinMitigation
        : 0;

    const effectiveCapacity = edge.capacity * prestigeEffects.edgeCapacity;
    const strain = Math.min(
      MAINTENANCE.MAX_STRAIN,
      throughput / effectiveCapacity + toxicity
    );

    return { ...edge, strain };
  });
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

/**
 * Returns an array of nodes that have been discovered.
 *
 * @param nodes - Array of all nodes.
 * @returns Array of discovered nodes.
 */
export const getDiscoveredNodes = (nodes: Node[]): Node[] => {
  return nodes.filter((node) => node.discovered);
};

/**
 * Returns the count of discovered nodes.
 *
 * @param nodes - Array of all nodes.
 * @returns Number of discovered nodes.
 */
export const getDiscoveredNodesCount = (nodes: Node[]): number => {
  return getDiscoveredNodes(nodes).length;
};

/**
 * Creates a map of node IDs to Node objects for faster lookups.
 *
 * @param nodes - Array of nodes.
 * @returns A dictionary mapping node IDs to Node objects.
 */
export const createNodeMap = (nodes: Node[]): Record<string, Node> => {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
};

/**
 * Calculates the cost of exploring a new node.
 *
 * @param discoveredCount - Number of currently discovered nodes.
 * @param exploreDiscount - Discount multiplier from prestige effects.
 * @returns The calculated sugar cost for exploration.
 */
export const calculateExploreCost = (
  discoveredCount: number,
  exploreDiscount: number
): number => {
  return Math.max(
    60,
    COSTS.EXPLORE * (SCALING.EXPLORE_EXPONENT ** (discoveredCount - 5)) * exploreDiscount
  );
};

/**
 * Calculates the cost of upgrading a node.
 *
 * @param upgradeLevel - The current upgrade level of the node.
 * @returns The calculated sugar cost for the upgrade.
 */
export const calculateUpgradeCost = (upgradeLevel: number): number => {
  return COSTS.UPGRADE * (SCALING.UPGRADE_EXPONENT ** upgradeLevel);
};

/**
 * Calculates the overall health percentage of the network.
 *
 * @param edges - Array of all game edges.
 * @param nodes - Array of all game nodes.
 * @param toxinMitigation - Multiplier for toxin penalties from prestige effects.
 * @param nodeMap - Map of node IDs to Node objects.
 * @returns The network health percentage as a number.
 */
export const calculateNetworkHealth = (
  edges: Edge[],
  nodes: Node[],
  toxinMitigation: number,
  nodeMap: Record<string, Node>
): number => {
  const cloggedEdges = edges.filter((edge) => edge.strain > 1 && isEdgeActive(edge, nodeMap));

  const strainPenalty = Math.min(
    35,
    cloggedEdges.length * 6 + edges.reduce((sum, edge) => sum + edge.strain * 4, 0) / 8,
  );

  const toxinPenalty = nodes.some((node) => node.type === "toxic" && node.discovered && !node.purified)
    ? 12 * toxinMitigation
    : 0;

  const rivalPenalty = nodes.some((node) => node.type === "rival" && node.discovered) ? 4 : 0;

  return Math.max(18, 100 - strainPenalty - toxinPenalty - rivalPenalty);
};
