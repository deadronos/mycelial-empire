import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { clamp, average } from "@/lib/numbers";
import { jitter, pickOne, randomBetween, weightedPick } from "@/lib/random";
import { serializeGameState } from "@/lib/serialization";
import { syncGraphWorld } from "@/ecs/world";
import {
  INITIAL_RESOURCES,
  RESOURCE_CAPS,
  type ActionResult,
  type GraphEdge,
  type GraphNode,
  type GameStats,
  type GameUpgrades,
  type ResourcePool,
  type SerializedGame,
} from "@/types/graph";

const BASE_MAINTENANCE_PER_EDGE = 0.03;
export const EXPLORE_COST = 2_400;
export const NODE_UPGRADE_COST = 6_000;
export const HYPHAE_UPGRADE_BASE_COST = 10_000;
const WORLD_RADIUS = 52;

const DEFAULT_UPGRADES: GameUpgrades = {
  hyphaeLevel: 0,
  maintenanceReduction: 0.1,
  synthesisLevel: 0,
};

let nodeCounter = 1;
let edgeCounter = 1;

interface SimulationInput {
  resources: ResourcePool;
  nodes: GraphNode[];
  edges: GraphEdge[];
  upgrades: GameUpgrades;
}

interface GameStoreState extends SimulationInput {
  stats: GameStats;
  tick: number;
  isPaused: boolean;
}

export interface GameStore extends GameStoreState {
  explore: () => ActionResult;
  upgradeHyphae: () => ActionResult;
  upgradeBestNode: () => ActionResult;
  step: () => void;
  serialize: () => SerializedGame;
  hydrate: (payload: SerializedGame) => void;
  reset: () => void;
}


const createStartingState = (): GameStoreState => {
  nodeCounter = 1;
  edgeCounter = 1;
  const nodes = createInitialNodes();
  const edges = createInitialEdges(nodes);
  return {
    resources: { ...INITIAL_RESOURCES },
    nodes,
    edges,
    upgrades: { ...DEFAULT_UPGRADES },
    stats: deriveStats({ nodes, edges, resources: { ...INITIAL_RESOURCES }, upgrades: { ...DEFAULT_UPGRADES } }),
    tick: 0,
    isPaused: false,
  };
};

const startingState = createStartingState();

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...startingState,
    explore: () => {
      let result: ActionResult = { ok: false, message: "" };

      set((state) => {
        if (state.resources.sugar < EXPLORE_COST) {
          result = {
            ok: false,
            message: "You need more Sugar to scout a new pocket.",
          };
          return state;
        }

        const anchor = pickOne(state.nodes);
        const newNode = createDiscoveredNode(state.tick + 1);
        const newEdge = createEdgeBetween(anchor, newNode);

        result = {
          ok: true,
          message: `Linked ${newNode.label} to the network.`,
        };

        const nextNodes = [...state.nodes, newNode];
        const nextEdges = [...state.edges, newEdge];
        const nextResources = { ...state.resources, sugar: state.resources.sugar - EXPLORE_COST };

        return {
          ...state,
          nodes: nextNodes,
          edges: nextEdges,
          resources: nextResources,
          stats: deriveStats({ nodes: nextNodes, edges: nextEdges, resources: nextResources, upgrades: state.upgrades }),
        };
      });

      return result;
    },
    upgradeHyphae: () => {
      let result: ActionResult = { ok: false, message: "" };

      set((state) => {
        const cost = HYPHAE_UPGRADE_BASE_COST * (state.upgrades.hyphaeLevel + 1);
        if (state.resources.sugar < cost) {
          result = {
            ok: false,
            message: `Hyphae widening requires ${cost.toLocaleString()} Sugar.`,
          };
          return state;
        }

        const nextUpgrades: GameUpgrades = {
          ...state.upgrades,
          hyphaeLevel: state.upgrades.hyphaeLevel + 1,
          maintenanceReduction: clamp(state.upgrades.maintenanceReduction + 0.05, 0, 0.75),
        };

        result = {
          ok: true,
          message: `Hyphae widened to Level ${nextUpgrades.hyphaeLevel}.`,
        };

        const nextResources = { ...state.resources, sugar: state.resources.sugar - cost };

        return {
          ...state,
          upgrades: nextUpgrades,
          resources: nextResources,
          stats: deriveStats({ nodes: state.nodes, edges: state.edges, resources: nextResources, upgrades: nextUpgrades }),
        };
      });

      return result;
    },
    upgradeBestNode: () => {
      let result: ActionResult = { ok: false, message: "" };

      set((state) => {
        const candidates = state.nodes.filter((node) => node.kind !== "heart" && node.rate);
        const target = [...candidates].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0))[0];

        if (!target) {
          result = { ok: false, message: "No eligible nodes to upgrade yet." };
          return state;
        }

        const cost = NODE_UPGRADE_COST * (target.tier + 1);
        if (state.resources.sugar < cost) {
          result = {
            ok: false,
            message: `Node tuning needs ${cost.toLocaleString()} Sugar.`,
          };
          return state;
        }

        const nextNodes = state.nodes.map((node) =>
          node.id === target.id
            ? {
                ...node,
                tier: node.tier + 1,
                rate: (node.rate ?? 0) * 1.3,
                capacity: node.capacity ? node.capacity * 1.15 : undefined,
                integrity: clamp(node.integrity + 0.05, 0, 1),
              }
            : node,
        );

        const nextResources = { ...state.resources, sugar: state.resources.sugar - cost };

        result = {
          ok: true,
          message: `${target.label} now pulses ${((target.rate ?? 0) * 1.3).toFixed(2)}/s.`,
        };

        return {
          ...state,
          nodes: nextNodes,
          resources: nextResources,
          stats: deriveStats({ nodes: nextNodes, edges: state.edges, resources: nextResources, upgrades: state.upgrades }),
        };
      });

      return result;
    },
    step: () => {
      set((state) => {
        if (state.isPaused) {
          return state;
        }

        const { nextResources, stats } = simulateTick(state);
        const nextEdges = evolveEdges(state.edges, stats.flowPressure, state.upgrades);

        return {
          ...state,
          tick: state.tick + 1,
          resources: nextResources,
          stats,
          edges: nextEdges,
        };
      });
    },
    serialize: () =>
      serializeGameState({
        resources: get().resources,
        nodes: get().nodes,
        edges: get().edges,
        upgrades: get().upgrades,
        tick: get().tick,
      }),
    hydrate: (payload) => {
      nodeCounter = payload.nodes.reduce((max, node) => Math.max(max, getNumericSuffix(node.id)), 0) + 1;
      edgeCounter = payload.edges.reduce((max, edge) => Math.max(max, getNumericSuffix(edge.id)), 0) + 1;

      set(() => ({
        resources: { ...payload.resources },
        nodes: payload.nodes.map((node) => ({ ...node, position: { ...node.position } })),
        edges: payload.edges.map((edge) => ({ ...edge })),
        upgrades: { ...payload.upgrades },
        stats: deriveStats({ nodes: payload.nodes, edges: payload.edges, resources: payload.resources, upgrades: payload.upgrades }),
        tick: payload.tick,
        isPaused: false,
      }));
    },
    reset: () => set(() => createStartingState()),
  }))
);

syncGraphWorld({ nodes: useGameStore.getState().nodes, edges: useGameStore.getState().edges });

useGameStore.subscribe(
  (state) => ({ nodes: state.nodes, edges: state.edges }),
  (snapshot) => syncGraphWorld(snapshot),
  { fireImmediately: true }
);

interface SimulationInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  resources: ResourcePool;
  upgrades: GameUpgrades;
}

const simulateTick = (state: SimulationInput) => {
  const { nodes, edges, resources, upgrades } = state;
  const flowMultiplier = 1 + upgrades.hyphaeLevel * 0.35;
  let waterPerSec = 0;
  let carbonPerSec = 0;
  let nutrientsPerSec = 0;
  let sugarFromPockets = 0;

  for (const node of nodes) {
    const rate = (node.rate ?? 0) * flowMultiplier;
    switch (node.kind) {
      case "waterPocket":
        waterPerSec += rate;
        sugarFromPockets += rate * 0.25;
        break;
      case "carbonPocket":
        carbonPerSec += rate;
        sugarFromPockets += rate * 0.35;
        break;
      case "nutrientPocket":
        nutrientsPerSec += rate;
        sugarFromPockets += rate * 0.2;
        break;
      case "junction":
        sugarFromPockets += rate * 0.4;
        break;
      case "toxic":
        sugarFromPockets -= rate * 0.15;
        break;
      default:
        break;
    }
  }

  const maintenancePerEdge = BASE_MAINTENANCE_PER_EDGE * (1 - upgrades.maintenanceReduction);
  const maintenance = maintenancePerEdge * edges.length;
  const sugarGain = sugarFromPockets * (1 + upgrades.synthesisLevel * 0.2);
  const netSugar = sugarGain - maintenance;

  const nextResources: ResourcePool = {
    sugar: clamp(resources.sugar + netSugar, 0, RESOURCE_CAPS.sugar),
    water: clamp(resources.water + waterPerSec, 0, RESOURCE_CAPS.water),
    carbon: clamp(resources.carbon + carbonPerSec, 0, RESOURCE_CAPS.carbon),
    nutrients: clamp(resources.nutrients + nutrientsPerSec, 0, RESOURCE_CAPS.nutrients),
    spores: resources.spores,
  };

  const flowPressure = calculateFlowPressure(edges, waterPerSec, carbonPerSec, nutrientsPerSec);
  const networkHealth = clamp(1 - average(edges.map((edge) => edge.strain)) * 0.7, 0, 1);

  const stats: GameStats = {
    waterPerSec,
    carbonPerSec,
    nutrientsPerSec,
    sugarFromPockets: sugarGain,
    maintenance,
    netSugar,
    networkHealth,
    flowPressure,
    maintenancePerEdge,
  };

  return { nextResources, stats };
};

const deriveStats = (input: SimulationInput): GameStats => simulateTick(input).stats;

const evolveEdges = (edges: GraphEdge[], pressure: number, upgrades: GameUpgrades) =>
  edges.map((edge) => {
    const relief = upgrades.hyphaeLevel * 0.01;
    const trend = pressure * 0.05 - 0.02 - relief;
    const nextStrain = clamp(edge.strain + trend + randomBetween(-0.01, 0.02), 0.05, 0.98);

    let status: GraphEdge["status"] = "healthy";
    if (nextStrain > 0.82) {
      status = "decaying";
    } else if (nextStrain > 0.65) {
      status = "strained";
    }

    const nextFlow = clamp(edge.flow * 0.85 + pressure * 35, 5, 260);

    return {
      ...edge,
      strain: nextStrain,
      status,
      flow: nextFlow,
    };
  });

const calculateFlowPressure = (
  edges: GraphEdge[],
  waterPerSec: number,
  carbonPerSec: number,
  nutrientsPerSec: number
) => {
  if (!edges.length) {
    return 0;
  }

  const throughput = waterPerSec + carbonPerSec + nutrientsPerSec;
  return clamp(throughput / (edges.length * 6), 0, 1);
};

const createInitialNodes = (): GraphNode[] => [
  {
    id: "heart",
    kind: "heart",
    label: "Heart (Core)",
    position: { x: 0, y: 0 },
    tier: 4,
    integrity: 1,
    discoveredAt: 0,
  },
  createPocketNode("waterPocket", { x: -24, y: 18 }, 2.6),
  createPocketNode("carbonPocket", { x: 26, y: 12 }, 1.9),
  createPocketNode("nutrientPocket", { x: -6, y: -28 }, 2.1),
];

const createInitialEdges = (nodes: GraphNode[]): GraphEdge[] =>
  nodes
    .filter((node) => node.id !== "heart")
    .map((node) => createEdgeBetween(nodes[0], node));

const createEdgeBetween = (fromNode: GraphNode, toNode: GraphNode): GraphEdge => {
  const dx = toNode.position.x - fromNode.position.x;
  const dy = toNode.position.y - fromNode.position.y;
  const length = Math.hypot(dx, dy);

  return {
    id: `edge-${edgeCounter++}`,
    from: fromNode.id,
    to: toNode.id,
    width: randomBetween(1.2, 2.4),
    strain: clamp(0.4 + length / 200, 0.15, 0.9),
    length,
    status: "healthy",
    flow: randomBetween(20, 60),
  };
};

const createPocketNode = (kind: GraphNode["kind"], position: { x: number; y: number }, rate: number): GraphNode => ({
  id: `node-${nodeCounter++}`,
  kind,
  label: labelForKind(kind),
  position,
  rate,
  tier: 1,
  capacity: 32,
  integrity: 0.78,
  discoveredAt: 0,
  focus: kind === "waterPocket" ? "water" : kind === "carbonPocket" ? "carbon" : "nutrients",
});

const labelForKind = (kind: GraphNode["kind"]): string => {
  switch (kind) {
    case "waterPocket":
      return "Water Pocket";
    case "carbonPocket":
      return "Carbon Vein";
    case "nutrientPocket":
      return "Nutrient Cache";
    case "junction":
      return "Junction";
    case "toxic":
      return "Toxic Bloom";
    default:
      return "Node";
  }
};

const createDiscoveredNode = (tick: number): GraphNode => {
  const kind = weightedPick<GraphNode["kind"]>([
    { value: "waterPocket", weight: 0.3 },
    { value: "carbonPocket", weight: 0.25 },
    { value: "nutrientPocket", weight: 0.25 },
    { value: "junction", weight: 0.15 },
    { value: "toxic", weight: 0.05 },
  ]);

  const position = {
    x: jitter(randomBetween(-WORLD_RADIUS, WORLD_RADIUS), 6),
    y: jitter(randomBetween(-WORLD_RADIUS, WORLD_RADIUS), 6),
  };

  return {
    id: `node-${nodeCounter++}`,
    kind,
    label: labelForKind(kind),
    position,
    rate: kind === "junction" ? randomBetween(1, 2) : randomBetween(1.4, 3.2),
    tier: kind === "junction" ? 2 : 1,
    capacity: kind === "junction" ? 64 : 40,
    integrity: kind === "toxic" ? 0.4 : 0.8,
    hazard: kind === "toxic" ? "toxic" : null,
    discoveredAt: tick,
    focus:
      kind === "waterPocket"
        ? "water"
        : kind === "carbonPocket"
        ? "carbon"
        : kind === "nutrientPocket"
        ? "nutrients"
      : undefined,
  };
};

const getNumericSuffix = (id: string) => {
  const maybeNumber = Number(id.split("-").pop());
  return Number.isFinite(maybeNumber) ? maybeNumber : 0;
};
