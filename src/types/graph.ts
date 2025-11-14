export const RESOURCE_TYPES = ["sugar", "water", "carbon", "nutrients", "spores"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type ResourcePool = Record<ResourceType, number>;
export type ResourceCaps = Record<ResourceType, number>;

export const RESOURCE_CAPS: ResourceCaps = {
  sugar: 500_000,
  water: 300_000,
  carbon: 200_000,
  nutrients: 150_000,
  spores: 999,
};

export const INITIAL_RESOURCES: ResourcePool = {
  sugar: 125_700,
  water: 89_200,
  carbon: 67_100,
  nutrients: 45_300,
  spores: 12,
};

export const NODE_KINDS = [
  "heart",
  "waterPocket",
  "carbonPocket",
  "nutrientPocket",
  "junction",
  "toxic",
  "rival",
] as const;
export type NodeKind = (typeof NODE_KINDS)[number];
export type EdgeStatus = "healthy" | "strained" | "decaying";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  position: { x: number; y: number };
  rate?: number;
  capacity?: number;
  tier: number;
  integrity: number;
  hazard?: "toxic" | null;
  discoveredAt: number;
  focus?: ResourceType;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  width: number;
  strain: number;
  length: number;
  status: EdgeStatus;
  flow: number;
}

export interface GameUpgrades {
  hyphaeLevel: number;
  maintenanceReduction: number;
  synthesisLevel: number;
}

export interface GameStats {
  waterPerSec: number;
  carbonPerSec: number;
  nutrientsPerSec: number;
  sugarFromPockets: number;
  maintenance: number;
  netSugar: number;
  networkHealth: number;
  flowPressure: number;
  maintenancePerEdge: number;
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SerializedGame {
  version: 1;
  timestamp: number;
  tick: number;
  resources: ResourcePool;
  nodes: GraphNode[];
  edges: GraphEdge[];
  upgrades: GameUpgrades;
}

export type ActionResult = { ok: boolean; message: string };
