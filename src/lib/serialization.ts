import { z } from "zod";

import {
  type GameUpgrades,
  type GraphEdge,
  type GraphNode,
  NODE_KINDS,
  RESOURCE_TYPES,
  type ResourcePool,
  type SerializedGame,
} from "@/types/graph";

export const SAVE_VERSION = 1 as const;

const resourceSchema = z.object(
  Object.fromEntries(RESOURCE_TYPES.map((type) => [type, z.number().finite()])) as Record<
    typeof RESOURCE_TYPES[number],
    z.ZodNumber
  >
);

const nodeSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(NODE_KINDS),
  label: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  rate: z.number().optional(),
  capacity: z.number().optional(),
  tier: z.number().int().min(0),
  integrity: z.number(),
  hazard: z.union([z.literal("toxic"), z.null()]).optional(),
  discoveredAt: z.number(),
  focus: z.enum(RESOURCE_TYPES).optional(),
});

const edgeSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  width: z.number(),
  strain: z.number(),
  length: z.number(),
  status: z.enum(["healthy", "strained", "decaying"] as const),
  flow: z.number(),
});

const upgradeSchema = z.object({
  hyphaeLevel: z.number().int().min(0),
  maintenanceReduction: z.number().min(0).max(0.9),
  synthesisLevel: z.number().int().min(0),
});

const saveSchema = z.object({
  version: z.literal(SAVE_VERSION),
  timestamp: z.number(),
  tick: z.number().int().nonnegative(),
  resources: resourceSchema,
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  upgrades: upgradeSchema,
});

export type GameSavePayload = z.infer<typeof saveSchema>;

export const serializeGameState = (state: {
  resources: ResourcePool;
  nodes: GraphNode[];
  edges: GraphEdge[];
  upgrades: GameUpgrades;
  tick: number;
}): SerializedGame => ({
  version: SAVE_VERSION,
  timestamp: Date.now(),
  tick: state.tick,
  resources: cloneResourcePool(state.resources),
  nodes: state.nodes.map(cloneNode),
  edges: state.edges.map(cloneEdge),
  upgrades: { ...state.upgrades },
});

export const parseGameSave = (payload: unknown): SerializedGame => saveSchema.parse(payload);

const cloneNode = (node: GraphNode): GraphNode => ({
  ...node,
  position: { ...node.position },
});

const cloneEdge = (edge: GraphEdge): GraphEdge => ({ ...edge });

const cloneResourcePool = (pool: ResourcePool): ResourcePool => ({ ...pool });
