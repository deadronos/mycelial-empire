import { create } from "zustand";

import type { Edge, Node, PrestigeUpgrade, ResourceKey, Resources } from "../types/game";

interface GameState {
  resources: Resources;
  nodes: Node[];
  edges: Edge[];
  generatedNodes: number;
  flowRate: number;
  pulse: number;
  prestigeLevel: number;
  purchasedUpgrades: string[];
  events: string[];

  // Actions
  addEvent: (message: string) => void;
  tick: () => void;
  explore: () => void;
  upgrade: () => void;
  reinforce: () => void;
  purify: () => void;
  prestige: () => void;
  purchaseUpgrade: (id: PrestigeUpgrade["id"]) => void;

  // Helpers exposed for UI
  resetNetwork: (sporeGain: number) => void;
}

const initialResources: Resources = {
  sugar: 120,
  water: 85,
  carbon: 70,
  nutrients: 55,
  spores: 4,
};

const initialNodes: Node[] = [
  {
    id: "heart",
    name: "Heart (Core)",
    type: "heart",
    position: { x: 50, y: 58 },
    yield: { sugar: 4 },
    discovered: true,
    upgradeLevel: 1,
    description: "Pulsing core that routes every resource and keeps the colony alive.",
    connections: ["junction-a"],
  },
  {
    id: "junction-a",
    name: "Central Junction",
    type: "junction",
    position: { x: 50, y: 40 },
    yield: { sugar: 0 },
    discovered: true,
    upgradeLevel: 1,
    description: "First branching point; processes resources into sugar once upgraded.",
    connections: ["heart", "water-pocket", "carbon-vent", "nutrient-vein"],
  },
  {
    id: "water-pocket",
    name: "Water Pocket",
    type: "water",
    position: { x: 28, y: 26 },
    yield: { water: 12 },
    discovered: true,
    upgradeLevel: 0,
    description: "Cool, iridescent pocket leeching moisture into the network.",
    connections: ["junction-a"],
  },
  {
    id: "carbon-vent",
    name: "Carbon Vent",
    type: "carbon",
    position: { x: 72, y: 26 },
    yield: { carbon: 10 },
    discovered: true,
    upgradeLevel: 0,
    description: "Charcoal-rich vein exhaling slow plumes of carbon.",
    connections: ["junction-a"],
  },
  {
    id: "nutrient-vein",
    name: "Nutrient Vein",
    type: "nutrient",
    position: { x: 62, y: 16 },
    yield: { nutrients: 9 },
    discovered: true,
    upgradeLevel: 0,
    description: "A warm, loamy seam humming with trace minerals.",
    connections: ["junction-a"],
  },
  {
    id: "ancient-root",
    name: "Ancient Root",
    type: "ancient",
    position: { x: 35, y: 14 },
    yield: { sugar: 3, spores: 0.4 },
    discovered: false,
    upgradeLevel: 0,
    description: "An elder root that remembers storms; grants spores when tapped.",
    connections: ["water-pocket"],
  },
  {
    id: "deep-spring",
    name: "Deep Spring",
    type: "spring",
    position: { x: 18, y: 40 },
    yield: { water: 18, sugar: 1 },
    discovered: false,
    upgradeLevel: 0,
    description: "Pressurized aquifer filled with mineral-rich water.",
    connections: ["water-pocket"],
  },
  {
    id: "toxic-soil",
    name: "Toxic Soil",
    type: "toxic",
    position: { x: 78, y: 40 },
    yield: { sugar: -1 },
    discovered: false,
    upgradeLevel: 0,
    description: "Sickly patch that corrodes hyphae until purified.",
    connections: ["carbon-vent"],
  },
  {
    id: "rival-colony",
    name: "Rival Colony",
    type: "rival",
    position: { x: 60, y: 8 },
    yield: { sugar: -2 },
    discovered: false,
    upgradeLevel: 0,
    description: "Aggressive neighbor siphoning sugar unless contained.",
    connections: ["nutrient-vein"],
  },
  {
    id: "artery-nexus",
    name: "Artery Nexus",
    type: "artery",
    position: { x: 32, y: 48 },
    yield: { sugar: 2 },
    discovered: false,
    upgradeLevel: 0,
    description: "Thicker bundle primed to branch into new chambers.",
    connections: ["heart"],
  },
  {
    id: "spore-bloom",
    name: "Spore Bloom",
    type: "spore",
    position: { x: 82, y: 18 },
    yield: { spores: 0.7, sugar: 1.6 },
    discovered: false,
    upgradeLevel: 0,
    description: "Pulsing puffball that feeds prestige cycles.",
    connections: ["carbon-vent"],
  },
  {
    id: "enzyme-pool",
    name: "Enzyme Pool",
    type: "enzyme",
    position: { x: 12, y: 22 },
    yield: { nutrients: 7, sugar: 1 },
    discovered: false,
    upgradeLevel: 0,
    description: "Soup of catalysts that helps neutralize toxins.",
    connections: ["water-pocket"],
  },
];

const initialEdges: Edge[] = [
  { id: "e-heart", from: "heart", to: "junction-a", capacity: 52, strain: 0.2, decay: 0.01 },
  { id: "e-water", from: "junction-a", to: "water-pocket", capacity: 26, strain: 0.35, decay: 0.02 },
  { id: "e-carbon", from: "junction-a", to: "carbon-vent", capacity: 24, strain: 0.4, decay: 0.02 },
  { id: "e-nutrient", from: "junction-a", to: "nutrient-vein", capacity: 20, strain: 0.32, decay: 0.02 },
  { id: "e-ancient", from: "water-pocket", to: "ancient-root", capacity: 18, strain: 0, decay: 0.03 },
  { id: "e-spring", from: "water-pocket", to: "deep-spring", capacity: 18, strain: 0, decay: 0.03 },
  { id: "e-toxic", from: "carbon-vent", to: "toxic-soil", capacity: 16, strain: 0, decay: 0.03 },
  { id: "e-rival", from: "nutrient-vein", to: "rival-colony", capacity: 16, strain: 0, decay: 0.03 },
  { id: "e-artery", from: "heart", to: "artery-nexus", capacity: 30, strain: 0, decay: 0.02 },
  { id: "e-spore", from: "carbon-vent", to: "spore-bloom", capacity: 16, strain: 0, decay: 0.03 },
  { id: "e-enzyme", from: "water-pocket", to: "enzyme-pool", capacity: 18, strain: 0, decay: 0.03 },
];

const dynamicTemplates: Omit<Node, "id" | "position" | "connections" | "discovered">[] = [
  {
    name: "Crystalline Carbon",
    type: "carbon",
    yield: { carbon: 14, sugar: 1.4 },
    upgradeLevel: 0,
    description: "Shards of charcoal glint with trapped energy.",
  },
  {
    name: "Capillary Junction",
    type: "artery",
    yield: { sugar: 2.2 },
    upgradeLevel: 0,
    description: "A broad hub ready to branch into new caverns.",
  },
  {
    name: "Verdant Compost",
    type: "nutrient",
    yield: { nutrients: 13 },
    upgradeLevel: 0,
    description: "Steaming compost thick with minerals.",
  },
  {
    name: "Mineral Seep",
    type: "water",
    yield: { water: 15, sugar: 0.8 },
    upgradeLevel: 0,
    description: "Warm flow that keeps hyphae slick and pliable.",
  },
  {
    name: "Spore Orchard",
    type: "spore",
    yield: { spores: 0.9, sugar: 1.8 },
    upgradeLevel: 0,
    description: "A ring of puffballs that remembers ancient cycles.",
  },
  {
    name: "Catalyst Vat",
    type: "enzyme",
    yield: { nutrients: 6, sugar: 1.6 },
    upgradeLevel: 0,
    description: "Enzymes brew quietly, shielding hyphae from rot.",
  },
];

const prestigeUpgrades: PrestigeUpgrade[] = [
  {
    id: "rich-mycelium",
    name: "Rich Mycelium",
    description: "+20% yield from every pocket and processor.",
    cost: 3,
  },
  {
    id: "tensile-hyphae",
    name: "Tensile Hyphae",
    description: "Edge capacity grows sturdier, easing clog risk.",
    cost: 4,
  },
  {
    id: "enzyme-membrane",
    name: "Enzyme Membrane",
    description: "Toxic soil drains less sugar and recovers faster.",
    cost: 4,
  },
  {
    id: "fermentation",
    name: "Fermentation Vats",
    description: "Carbon + Water conversion yields +25% sugar.",
    cost: 5,
  },
  {
    id: "scent-trails",
    name: "Scent Trails",
    description: "Exploring deep soil costs 25% less sugar.",
    cost: 3,
  },
  {
    id: "spore-alchemy",
    name: "Spore Alchemy",
    description: "Prestige rewards +30% extra spores.",
    cost: 6,
  },
];

/**
 * Formatter for numbers to have simplified US locale formatting with max 1 decimal.
 */
const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

/**
 * Formats a number for display, ensuring it is non-negative.
 *
 * @param value - The number to format.
 * @returns A string representation of the number.
 */
export const format = (value: number) => formatter.format(Math.max(0, value));

export const useGameStore = create<GameState>((set, get) => ({
  resources: { ...initialResources },
  nodes: initialNodes,
  edges: initialEdges,
  generatedNodes: 0,
  flowRate: 0,
  pulse: 0,
  prestigeLevel: 0,
  purchasedUpgrades: [],
  events: [
    "Heart awakens beneath the forest floor.",
    "Hyphae senses moisture veins nearby.",
    "Mineral shimmer hints at deeper secrets.",
  ],

  addEvent: (message) => set((state) => ({ events: [message, ...state.events].slice(0, 7) })),

  tick: () => {
    const { nodes, edges, purchasedUpgrades } = get();

    // Calculate prestige effects
    const purchased = new Set(purchasedUpgrades);
    const prestigeEffects = {
      resourceYield: purchased.has("rich-mycelium") ? 1.2 : 1,
      edgeCapacity: purchased.has("tensile-hyphae") ? 1.25 : 1,
      toxinMitigation: purchased.has("enzyme-membrane") ? 0.45 : 1,
      conversionBonus: purchased.has("fermentation") ? 1.25 : 1,
      sporeBonus: purchased.has("spore-alchemy") ? 1.3 : 1,
    };

    const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const calculateNodeYield = (node: Node) => {
      if (!node.yield) return {} as Partial<Record<ResourceKey, number>>;
      const multiplier = (1 + node.upgradeLevel * 0.35) * prestigeEffects.resourceYield;
      return Object.fromEntries(
        Object.entries(node.yield).map(([key, value]) => [key, (value ?? 0) * multiplier]),
      ) as Partial<Record<ResourceKey, number>>;
    };

    set((state) => {
      const updatedResources = { ...state.resources };
      let sugarGain = 0;
      let flow = 0;

      // Resource Accumulation
      nodes.forEach((node) => {
        if (!node.discovered) return;
        const yieldValues = calculateNodeYield(node);
        Object.entries(yieldValues).forEach(([key, value]) => {
          if (key === "sugar") {
            sugarGain += value ?? 0;
          } else {
            const resourceKey = key as Exclude<ResourceKey, "sugar">;
            updatedResources[resourceKey] += value ?? 0;
          }
          flow += value ?? 0;
        });

        if (node.type === "ancient") {
          updatedResources.spores += 0.15 * prestigeEffects.sporeBonus;
          sugarGain += 1.3;
        }
        if (node.type === "spore") {
          updatedResources.spores += 0.25 * prestigeEffects.sporeBonus;
          sugarGain += 1.1;
        }
        if (node.type === "enzyme") {
          sugarGain += 0.4;
        }
        if (node.type === "rival") {
          sugarGain -= 1.5;
        }
        if (node.type === "toxic" && !node.purified) {
          sugarGain -= 1.1 * prestigeEffects.toxinMitigation;
        }
      });

      // Processing
      const processingNodes = nodes.filter((node) => node.type === "junction" && node.discovered);
      const conversionPotential = Math.min(updatedResources.water * 0.08, updatedResources.carbon * 0.08, 6 * processingNodes.length);
      if (conversionPotential > 0) {
        updatedResources.water -= conversionPotential * 0.65;
        updatedResources.carbon -= conversionPotential * 0.65;
        sugarGain += conversionPotential * (1.35 + processingNodes.length * 0.1) * prestigeEffects.conversionBonus;
      }

      // Maintenance
      const activeEdgeCount = edges.filter((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        return from?.discovered && to?.discovered;
      }).length;
      const maintenance = activeEdgeCount * 0.35 * (prestigeEffects.edgeCapacity > 1 ? 0.9 : 1);
      const finalSugar = Math.max(0, updatedResources.sugar + sugarGain - maintenance);

      // Edge Strain Calculation
      const nextEdges = edges.map((edge) => {
        const node = nodes.find((entry) => entry.id === edge.to);
        const fromNode = nodes.find((entry) => entry.id === edge.from);
        const active = node?.discovered && fromNode?.discovered;
        const yieldValues = node ? calculateNodeYield(node) : {};
        const throughput = Object.values(yieldValues).reduce((sum, value) => sum + (value ?? 0), 0);
        const toxicity = node?.type === "toxic" && !node.purified ? 0.5 * prestigeEffects.toxinMitigation : 0;
        const effectiveCapacity = edge.capacity * prestigeEffects.edgeCapacity;
        const strain = active ? Math.min(1.6, throughput / effectiveCapacity + toxicity) : 0;
        return { ...edge, strain };
      });

      return {
        resources: { ...updatedResources, sugar: finalSugar },
        flowRate: sugarGain - maintenance,
        pulse: flow,
        edges: nextEdges,
      };
    });
  },

  explore: () => {
    const { resources, nodes, generatedNodes, purchasedUpgrades, addEvent } = get();

    const purchased = new Set(purchasedUpgrades);
    const exploreDiscount = purchased.has("scent-trails") ? 0.75 : 1;
    const exploreCost = Math.max(60, 120 * exploreDiscount);

    if (resources.sugar < exploreCost) {
      addEvent(`Not enough sugar to explore deeper soil (${Math.ceil(exploreCost)} needed).`);
      return;
    }

    const undiscovered = nodes.find((node) => !node.discovered);

    if (undiscovered) {
      set((state) => ({
        resources: { ...state.resources, sugar: state.resources.sugar - exploreCost },
        nodes: state.nodes.map((node) => (node.id === undiscovered.id ? { ...node, discovered: true } : node)),
      }));
      addEvent(`Hyphae breached a new chamber: ${undiscovered.name}.`);
      return;
    }

    // Spawn dynamic node
    const anchors = nodes.filter((node) => node.discovered && node.type !== "rival");
    if (anchors.length === 0) {
      addEvent("No stable anchor exists for deeper exploration.");
      return;
    }
    const anchor = anchors[Math.floor(Math.random() * anchors.length)];

    const template = dynamicTemplates[generatedNodes % dynamicTemplates.length];
    const id = `${template.type}-${generatedNodes + 1}`;
    const jitterPosition = (value: number) => Math.min(92, Math.max(8, value + (Math.random() * 18 - 9)));
    const position = { x: jitterPosition(anchor.position.x), y: jitterPosition(anchor.position.y) };

    // Check if tensile-hyphae is active
    const capacityBoost = purchased.has("tensile-hyphae") ? 4 : 0;

    const newNode: Node = {
      ...template,
      id,
      position,
      discovered: true,
      connections: [anchor.id],
      yield: template.yield,
      upgradeLevel: template.upgradeLevel,
      description: template.description,
    };

    const newEdge: Edge = {
      id: `e-${anchor.id}-${id}-${generatedNodes}`,
      from: anchor.id,
      to: id,
      capacity: 15 + Math.round(Math.random() * 12) + capacityBoost,
      strain: 0,
      decay: 0.03,
    };

    set((state) => ({
      resources: { ...state.resources, sugar: state.resources.sugar - exploreCost },
      nodes: [...state.nodes.map((node) =>
        node.id === anchor.id ? { ...node, connections: [...node.connections, id] } : node
      ), newNode],
      edges: [...state.edges, newEdge],
      generatedNodes: state.generatedNodes + 1,
    }));
    addEvent(`New pocket uncovered: ${newNode.name}.`);
  },

  upgrade: () => {
    const { resources, nodes, addEvent } = get();

    if (resources.sugar < 90) {
      addEvent("Insufficient sugar to upgrade a node.");
      return;
    }

    const candidate = nodes.find(
      (node) =>
        node.discovered &&
        ["water", "carbon", "nutrient", "spring", "spore", "enzyme", "artery"].includes(node.type) &&
        node.upgradeLevel < 3,
    );

    if (!candidate) {
      addEvent("All resource pockets are tuned to their limit.");
      return;
    }

    set((state) => ({
      resources: { ...state.resources, sugar: state.resources.sugar - 90 },
      nodes: state.nodes.map((node) =>
        node.id === candidate.id
          ? { ...node, upgradeLevel: node.upgradeLevel + 1, description: `${node.description} (refined)` }
          : node,
      ),
    }));
    addEvent(`${candidate.name} now channels resources 35% faster.`);
  },

  reinforce: () => {
    const { resources, edges, addEvent } = get();

    if (resources.sugar < 70) {
      addEvent("Reinforcement requires more sugar reserves.");
      return;
    }

    const target = [...edges].sort((a, b) => b.strain - a.strain)[0];
    if (!target) return;

    set((state) => ({
      resources: { ...state.resources, sugar: state.resources.sugar - 70 },
      edges: state.edges.map((edge) =>
        edge.id === target.id
          ? { ...edge, capacity: edge.capacity + 6, strain: Math.max(0.2, edge.strain - 0.25), reinforced: true }
          : edge,
      ),
    }));
    addEvent(`Hyphae thickened along ${target.id}, easing pressure.`);
  },

  purify: () => {
    const { resources, nodes, addEvent } = get();

    const toxicNode = nodes.find((node) => node.type === "toxic" && node.discovered && !node.purified);
    if (!toxicNode) {
      addEvent("No corrupted soil currently threatens the network.");
      return;
    }

    if (resources.sugar < 110 || resources.spores < 1) {
      addEvent("Purification needs 110 sugar and a spore charge.");
      return;
    }

    set((state) => ({
      resources: { ...state.resources, sugar: state.resources.sugar - 110, spores: Math.max(0, state.resources.spores - 1) },
      nodes: state.nodes.map((node) => (node.id === toxicNode.id ? { ...node, purified: true } : node)),
    }));
    addEvent(`${toxicNode.name} neutralized with enzyme wash.`);
  },

  prestige: () => {
    const { resources, nodes, flowRate, purchasedUpgrades, addEvent, resetNetwork } = get();

    const discoveredCount = nodes.filter((node) => node.discovered).length;
    if (discoveredCount < 6) {
      addEvent("The network is too small to fruit.");
      return;
    }
    if (resources.sugar < 380) {
      addEvent("Fruiting needs 380 sugar to gather strength.");
      return;
    }

    const purchased = new Set(purchasedUpgrades);
    const sporeBonus = purchased.has("spore-alchemy") ? 1.3 : 1;

    const sporeGain = Math.max(
      2,
      Math.round((discoveredCount * 0.9 + flowRate * 0.8 + resources.sugar / 90) * sporeBonus),
    );

    resetNetwork(resources.spores + sporeGain);
    set((state) => ({ prestigeLevel: state.prestigeLevel + 1 }));
    addEvent(`Fruiting body rises, scattering ${format(sporeGain)} spores into memory.`);
  },

  purchaseUpgrade: (id) => {
    const { resources, purchasedUpgrades, addEvent } = get();
    const upgrade = prestigeUpgrades.find((entry) => entry.id === id);
    if (!upgrade) return;

    if (purchasedUpgrades.includes(id)) {
      addEvent(`${upgrade.name} already woven through the hyphae.`);
      return;
    }
    if (resources.spores < upgrade.cost) {
      addEvent("Not enough spores to weave this trait.");
      return;
    }

    set((state) => ({
      resources: { ...state.resources, spores: state.resources.spores - upgrade.cost },
      purchasedUpgrades: [...state.purchasedUpgrades, id],
    }));
    addEvent(`${upgrade.name} woven into the lineage.`);
  },

  resetNetwork: (sporeGain) => {
    set({
      nodes: initialNodes.map((node) => ({ ...node })),
      edges: initialEdges.map((edge) => ({ ...edge, strain: 0 })),
      generatedNodes: 0,
      resources: { ...initialResources, spores: sporeGain },
    });
  },
}));

export { prestigeUpgrades };
