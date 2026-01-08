/**
 * Represents the types of resources available in the game.
 */
export type ResourceKey = "sugar" | "water" | "carbon" | "nutrients" | "spores";

/**
 * Represents the various types of nodes in the network.
 */
export type NodeType =
  | "heart"
  | "water"
  | "carbon"
  | "nutrient"
  | "junction"
  | "ancient"
  | "enzyme"
  | "toxic"
  | "rival"
  | "spring"
  | "artery"
  | "spore";

/**
 * Represents a node in the mycelial network.
 */
export interface Node {
  /** Unique identifier for the node. */
  id: string;
  /** Display name of the node. */
  name: string;
  /** The type of the node. */
  type: NodeType;
  /** The 2D position of the node (0-100 range). */
  position: { x: number; y: number };
  /** Resource yield per tick, if any. */
  yield?: Partial<Record<ResourceKey, number>>;
  /** Whether the node has been discovered by the player. */
  discovered: boolean;
  /** Current upgrade level of the node. */
  upgradeLevel: number;
  /** Description text for the node. */
  description: string;
  /** List of IDs of connected nodes. */
  connections: string[];
  /** Whether a toxic node has been purified. */
  purified?: boolean;
}

/**
 * Represents a connection between two nodes.
 */
export interface Edge {
  /** Unique identifier for the edge. */
  id: string;
  /** ID of the source node. */
  from: string;
  /** ID of the target node. */
  to: string;
  /** Maximum flow capacity of the edge. */
  capacity: number;
  /** Current strain level on the edge. */
  strain: number;
  /** Decay rate of the edge. */
  decay: number;
  /** Whether the edge has been reinforced by the player. */
  reinforced?: boolean;
}

/**
 * Represents an upgrade available upon prestige.
 */
export interface PrestigeUpgrade {
  /** Unique identifier for the upgrade. */
  id:
    | "rich-mycelium"
    | "tensile-hyphae"
    | "enzyme-membrane"
    | "fermentation"
    | "scent-trails"
    | "spore-alchemy";
  /** Display name of the upgrade. */
  name: string;
  /** Description of the upgrade's effect. */
  description: string;
  /** Cost in spores to purchase the upgrade. */
  cost: number;
}

/**
 * Represents the current amounts of collected resources.
 */
export interface Resources {
  /** Amount of sugar available. */
  sugar: number;
  /** Amount of water available. */
  water: number;
  /** Amount of carbon available. */
  carbon: number;
  /** Amount of nutrients available. */
  nutrients: number;
  /** Amount of spores available. */
  spores: number;
}
