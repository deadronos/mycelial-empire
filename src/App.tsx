import {
  Activity,
  AlertTriangle,
  ArrowUpCircle,
  BadgeCheck,
  Crown,
  Flame,
  Leaf,
  Map,
  Network,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
  Trees,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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
const format = (value: number) => formatter.format(Math.max(0, value));

/**
 * Represents the types of resources available in the game.
 */
type ResourceKey = "sugar" | "water" | "carbon" | "nutrients" | "spores";

/**
 * Represents the various types of nodes in the network.
 */
type NodeType =
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
interface Node {
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
interface Edge {
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
interface PrestigeUpgrade {
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
interface Resources {
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

/**
 * List of available prestige upgrades.
 */
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
 * Initial set of nodes for a new game.
 */
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

/**
 * Initial set of edges for a new game.
 */
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

/**
 * Order in which resources are displayed.
 */
const resourceOrder: ResourceKey[] = ["sugar", "water", "carbon", "nutrients", "spores"];

/**
 * Metadata for each resource type including label, color, and icon.
 */
const resourceCopy: Record<ResourceKey, { label: string; color: string; icon: ReactNode }>
  = {
    sugar: { label: "Sugar", color: "text-purple-200", icon: <Sparkles className="h-4 w-4 text-purple-300" /> },
    water: { label: "Water", color: "text-cyan-200", icon: <DropletIcon /> },
    carbon: { label: "Carbon", color: "text-slate-200", icon: <Flame className="h-4 w-4 text-slate-200" /> },
    nutrients: { label: "Nutrients", color: "text-lime-200", icon: <Leaf className="h-4 w-4 text-lime-200" /> },
    spores: { label: "Spore Dust", color: "text-amber-200", icon: <Trees className="h-4 w-4 text-amber-200" /> },
  };

/**
 * Renders a rotated map icon representing a droplet.
 *
 * @returns A JSX element containing the icon.
 */
function DropletIcon() {
  return <Map className="h-4 w-4 text-cyan-200 rotate-90" />;
}

/**
 * Templates for dynamically spawned nodes.
 */
const dynamicTemplates: Omit<Node, "id" | "position" | "connections" | "discovered">[] = [
  {
    name: "Crystalline Carbon", // uses carbon type
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

/**
 * The main application component for Mycelial Empire.
 *
 * Manages the game state including resources, nodes, edges, and game loop.
 * Renders the UI for the game including the header, resource panel, command panel,
 * prestige panel, event log, and the network map.
 *
 * @returns The rendered application component.
 */
function App() {
  const [resources, setResources] = useState<Resources>({
    sugar: 120,
    water: 85,
    carbon: 70,
    nutrients: 55,
    spores: 4,
  });

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [generatedNodes, setGeneratedNodes] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [prestigeLevel, setPrestigeLevel] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([
    "Heart awakens beneath the forest floor.",
    "Hyphae senses moisture veins nearby.",
    "Mineral shimmer hints at deeper secrets.",
  ]);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);

  const prestigeEffects = useMemo(() => {
    const purchased = new Set(purchasedUpgrades);
    return {
      resourceYield: purchased.has("rich-mycelium") ? 1.2 : 1,
      edgeCapacity: purchased.has("tensile-hyphae") ? 1.25 : 1,
      toxinMitigation: purchased.has("enzyme-membrane") ? 0.45 : 1,
      conversionBonus: purchased.has("fermentation") ? 1.25 : 1,
      exploreDiscount: purchased.has("scent-trails") ? 0.75 : 1,
      sporeBonus: purchased.has("spore-alchemy") ? 1.3 : 1,
    };
  }, [purchasedUpgrades]);

  /**
   * Adds a new event message to the log, keeping the most recent 7.
   *
   * @param message - The event message to add.
   */
  const addEvent = (message: string) =>
    setEvents((prev) => [message, ...prev].slice(0, 7));

  /**
   * Calculates the resource yield for a specific node based on its type, upgrades, and prestige effects.
   *
   * @param node - The node to calculate yield for.
   * @returns An object containing the resource yield values.
   */
  const calculateNodeYield = (node: Node) => {
    if (!node.yield) return {} as Partial<Record<ResourceKey, number>>;
    const multiplier = (1 + node.upgradeLevel * 0.35) * prestigeEffects.resourceYield;
    return Object.fromEntries(
      Object.entries(node.yield).map(([key, value]) => [key, (value ?? 0) * multiplier]),
    ) as Partial<Record<ResourceKey, number>>;
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setResources((previous) => {
        const updated = { ...previous };
        let sugarGain = 0;
        let flow = 0;
        const currentNodes = nodesRef.current;

        currentNodes.forEach((node) => {
          if (!node.discovered) return;
          const yieldValues = calculateNodeYield(node);
          Object.entries(yieldValues).forEach(([key, value]) => {
            if (key === "sugar") {
              sugarGain += value ?? 0;
            } else {
              const resourceKey = key as Exclude<ResourceKey, "sugar">;
              updated[resourceKey] += value ?? 0;
            }
            flow += value ?? 0;
          });

          if (node.type === "ancient") {
            updated.spores += 0.15 * prestigeEffects.sporeBonus;
            sugarGain += 1.3;
          }
          if (node.type === "spore") {
            updated.spores += 0.25 * prestigeEffects.sporeBonus;
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

        const processingNodes = currentNodes.filter((node) => node.type === "junction" && node.discovered);
        const conversionPotential = Math.min(updated.water * 0.08, updated.carbon * 0.08, 6 * processingNodes.length);
        if (conversionPotential > 0) {
          updated.water -= conversionPotential * 0.65;
          updated.carbon -= conversionPotential * 0.65;
          sugarGain += conversionPotential * (1.35 + processingNodes.length * 0.1) * prestigeEffects.conversionBonus;
        }

        const activeEdgeCount = edgesRef.current.filter((edge) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          return from?.discovered && to?.discovered;
        }).length;
        const maintenance = activeEdgeCount * 0.35 * (prestigeEffects.edgeCapacity > 1 ? 0.9 : 1);
        const finalSugar = Math.max(0, updated.sugar + sugarGain - maintenance);

        setFlowRate(sugarGain - maintenance);
        setPulse(flow);
        return { ...updated, sugar: finalSugar };
      });

      setEdges((current) => {
        const currentNodes = nodesRef.current;
        const nextEdges = current.map((edge) => {
          const node = currentNodes.find((entry) => entry.id === edge.to);
          const fromNode = currentNodes.find((entry) => entry.id === edge.from);
          const active = node?.discovered && fromNode?.discovered;
          const yieldValues = node ? calculateNodeYield(node) : {};
          const throughput = Object.values(yieldValues).reduce((sum, value) => sum + (value ?? 0), 0);
          const toxicity = node?.type === "toxic" && !node.purified ? 0.5 * prestigeEffects.toxinMitigation : 0;
          const effectiveCapacity = edge.capacity * prestigeEffects.edgeCapacity;
          const strain = active ? Math.min(1.6, throughput / effectiveCapacity + toxicity) : 0;
          return { ...edge, strain };
        });
        edgesRef.current = nextEdges;
        return nextEdges;
      });
    }, 1200);

    return () => window.clearInterval(interval);
  }, [nodeMap, prestigeEffects]);

  const cloggedEdges = useMemo(
    () => edges.filter((edge) => edge.strain > 1 && nodeMap[edge.from]?.discovered && nodeMap[edge.to]?.discovered),
    [edges, nodeMap],
  );

  const networkHealth = useMemo(() => {
    const strainPenalty = Math.min(35, cloggedEdges.length * 6 + edges.reduce((sum, edge) => sum + edge.strain * 4, 0) / 8);
    const toxinPenalty = nodes.some((node) => node.type === "toxic" && node.discovered && !node.purified)
      ? 12 * prestigeEffects.toxinMitigation
      : 0;
    const rivalPenalty = nodes.some((node) => node.type === "rival" && node.discovered) ? 4 : 0;
    return Math.max(18, 100 - strainPenalty - toxinPenalty - rivalPenalty);
  }, [cloggedEdges.length, edges, nodes, prestigeEffects.toxinMitigation]);

  /**
   * Selects a random discovered node to serve as an anchor for new growth.
   *
   * @returns A random anchor node or null if none are available.
   */
  const pickAnchorNode = () => {
    const anchors = nodesRef.current.filter((node) => node.discovered && node.type !== "rival");
    if (anchors.length === 0) return null;
    return anchors[Math.floor(Math.random() * anchors.length)];
  };

  /**
   * Adds random jitter to a coordinate value within bounds [8, 92].
   *
   * @param value - The original coordinate value.
   * @returns The jittered coordinate value.
   */
  const jitterPosition = (value: number) => Math.min(92, Math.max(8, value + (Math.random() * 18 - 9)));

  /**
   * Spawns a new dynamic node connected to an existing anchor.
   *
   * @returns The newly created node or null if spawning failed.
   */
  const spawnDynamicNode = () => {
    const anchor = pickAnchorNode();
    if (!anchor) return null;
    const template = dynamicTemplates[generatedNodes % dynamicTemplates.length];
    const id = `${template.type}-${generatedNodes + 1}`;
    const position = { x: jitterPosition(anchor.position.x), y: jitterPosition(anchor.position.y) };
    const capacityBoost = prestigeEffects.edgeCapacity > 1 ? 4 : 0;
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

    setNodes((prev) => {
      const updated = prev.map((node) =>
        node.id === anchor.id ? { ...node, connections: [...node.connections, id] } : node,
      );
      return [...updated, newNode];
    });
    setEdges((prev) => [...prev, newEdge]);
    setGeneratedNodes((count) => count + 1);
    return newNode;
  };

  /**
   * Resets the network state for a new run (prestige).
   *
   * @param sporeGain - The amount of spores to start with in the new run.
   */
  const resetNetwork = (sporeGain: number) => {
    setNodes(initialNodes.map((node) => ({ ...node })));
    setEdges(initialEdges.map((edge) => ({ ...edge, strain: 0 })));
    setGeneratedNodes(0);
    setResources({ sugar: 120, water: 85, carbon: 70, nutrients: 55, spores: sporeGain });
  };

  /**
   * Handles the exploration action.
   * Consumes sugar to reveal a hidden node or spawn a new one.
   */
  const handleExplore = () => {
    const exploreCost = Math.max(60, 120 * prestigeEffects.exploreDiscount);
    if (resources.sugar < exploreCost)
      return addEvent(`Not enough sugar to explore deeper soil (${Math.ceil(exploreCost)} needed).`);
    const undiscovered = nodes.find((node) => !node.discovered);

    if (undiscovered) {
      setResources((prev) => ({ ...prev, sugar: prev.sugar - exploreCost }));
      setNodes((prev) =>
        prev.map((node) => (node.id === undiscovered.id ? { ...node, discovered: true } : node)),
      );
      addEvent(`Hyphae breached a new chamber: ${undiscovered.name}.`);
      return;
    }

    const generated = spawnDynamicNode();
    if (!generated) return addEvent("No stable anchor exists for deeper exploration.");
    setResources((prev) => ({ ...prev, sugar: prev.sugar - exploreCost }));
    addEvent(`New pocket uncovered: ${generated.name}.`);
  };

  /**
   * Handles the node upgrade action.
   * Consumes sugar to increase the upgrade level of a random eligible node.
   */
  const handleUpgrade = () => {
    if (resources.sugar < 90) return addEvent("Insufficient sugar to upgrade a node.");
    const candidate = nodes.find(
      (node) =>
        node.discovered &&
        ["water", "carbon", "nutrient", "spring", "spore", "enzyme", "artery"].includes(node.type) &&
        node.upgradeLevel < 3,
    );
    if (!candidate) return addEvent("All resource pockets are tuned to their limit.");

    setResources((prev) => ({ ...prev, sugar: prev.sugar - 90 }));
    setNodes((prev) =>
      prev.map((node) =>
        node.id === candidate.id
          ? { ...node, upgradeLevel: node.upgradeLevel + 1, description: `${node.description} (refined)` }
          : node,
      ),
    );
    addEvent(`${candidate.name} now channels resources 35% faster.`);
  };

  /**
   * Handles the edge reinforcement action.
   * Consumes sugar to increase the capacity and reduce strain of the most stressed edge.
   */
  const handleReinforce = () => {
    if (resources.sugar < 70) return addEvent("Reinforcement requires more sugar reserves.");
    const target = [...edges].sort((a, b) => b.strain - a.strain)[0];
    if (!target) return;

    setResources((prev) => ({ ...prev, sugar: prev.sugar - 70 }));
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === target.id
          ? { ...edge, capacity: edge.capacity + 6, strain: Math.max(0.2, edge.strain - 0.25), reinforced: true }
          : edge,
      ),
    );
    addEvent(`Hyphae thickened along ${target.id}, easing pressure.`);
  };

  /**
   * Handles the toxin purification action.
   * Consumes sugar and spores to purify a toxic node.
   */
  const handlePurify = () => {
    const toxicNode = nodes.find((node) => node.type === "toxic" && node.discovered && !node.purified);
    if (!toxicNode) return addEvent("No corrupted soil currently threatens the network.");
    if (resources.sugar < 110 || resources.spores < 1)
      return addEvent("Purification needs 110 sugar and a spore charge.");

    setResources((prev) => ({ ...prev, sugar: prev.sugar - 110, spores: Math.max(0, prev.spores - 1) }));
    setNodes((prev) => prev.map((node) => (node.id === toxicNode.id ? { ...node, purified: true } : node)));
    addEvent(`${toxicNode.name} neutralized with enzyme wash.`);
  };

  /**
   * Handles the prestige (fruiting) action.
   * Resets the network and awards spores based on progress.
   */
  const handlePrestige = () => {
    const discoveredCount = nodes.filter((node) => node.discovered).length;
    if (discoveredCount < 6) return addEvent("The network is too small to fruit.");
    if (resources.sugar < 380) return addEvent("Fruiting needs 380 sugar to gather strength.");

    const sporeGain = Math.max(
      2,
      Math.round((discoveredCount * 0.9 + flowRate * 0.8 + resources.sugar / 90) * prestigeEffects.sporeBonus),
    );

    resetNetwork(resources.spores + sporeGain);
    setPrestigeLevel((level) => level + 1);
    addEvent(`Fruiting body rises, scattering ${format(sporeGain)} spores into memory.`);
  };

  /**
   * Handles the purchase of a prestige upgrade.
   *
   * @param id - The ID of the upgrade to purchase.
   */
  const handlePurchaseUpgrade = (id: PrestigeUpgrade["id"]) => {
    const upgrade = prestigeUpgrades.find((entry) => entry.id === id);
    if (!upgrade) return;
    if (purchasedUpgrades.includes(id)) return addEvent(`${upgrade.name} already woven through the hyphae.`);
    if (resources.spores < upgrade.cost) return addEvent("Not enough spores to weave this trait.");

    setResources((prev) => ({ ...prev, spores: prev.spores - upgrade.cost }));
    setPurchasedUpgrades((prev) => [...prev, id]);
    addEvent(`${upgrade.name} woven into the lineage.`);
  };

  const networkPulse = useMemo(() => Math.max(0, pulse), [pulse]);

  const buttons = [
    { label: "Explore Soil", onClick: handleExplore, icon: Map, glow: "from-purple-500/50 to-cyan-400/40" },
    { label: "Upgrade Node", onClick: handleUpgrade, icon: ArrowUpCircle, glow: "from-lime-400/40 to-purple-400/30" },
    { label: "Reinforce Hyphae", onClick: handleReinforce, icon: ShieldCheck, glow: "from-cyan-400/40 to-purple-400/30" },
    { label: "Purify Toxins", onClick: handlePurify, icon: TestTubeDiagonal, glow: "from-amber-400/40 to-rose-400/30" },
  ];

  const discoveredNodes = nodes.filter((node) => node.discovered);

  return (
    <div className="min-h-screen bg-soil-900 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 w-72 h-72 bg-purple-500 nebula-blur" />
        <div className="absolute right-10 top-20 w-64 h-64 bg-cyan-400 nebula-blur" />
        <div className="absolute left-20 bottom-8 w-72 h-72 bg-lime-400 nebula-blur" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-purple-200/80">Mycelial Empire</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-50 drop-shadow-hyphae">
              Beneath the canopy, the network never sleeps.
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Grow luminous hyphae, siphon hidden resources, and balance pressure before the colony collapses.
            </p>
          </div>
          <div className="blur-card px-5 py-4 rounded-2xl flex gap-6 items-center panel-sheen relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Network className="h-10 w-10 text-purple-300" />
              <div>
                <p className="text-xs uppercase text-slate-300">Flow Rate</p>
                <p className="text-2xl font-semibold text-purple-50">{format(flowRate)} /s</p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-600/40" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-lime-300" />
              <div>
                <p className="text-xs uppercase text-slate-300">Network Health</p>
                <p className="text-2xl font-semibold text-lime-50">{Math.round(networkHealth)}%</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          <div className="space-y-6">
            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-purple-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-purple-200/80">Resources</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {resourceOrder.map((key) => (
                  <div
                    key={key}
                    className="border border-slate-700/50 rounded-2xl px-3 py-3 bg-white/5 flex flex-col gap-1 shadow-panel"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      {resourceCopy[key].icon}
                      <span className="uppercase tracking-[0.25em] text-slate-400">{resourceCopy[key].label}</span>
                    </div>
                    <p className={`text-2xl font-semibold ${resourceCopy[key].color}`}>{format(resources[key])}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-300">
                Idle extraction channels {format(networkPulse)} flow/sec back to the Heart.
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-cyan-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-cyan-200/80">Commands</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {/* eslint-disable-next-line react-hooks/refs */}
                {buttons.map(({ icon: Icon, label, onClick, glow }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-purple-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${glow} opacity-40`} />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{label}</p>
                        <p className="text-xs text-slate-300">
                          {label === "Explore Soil" && "Reveal hidden pockets and junctions."}
                          {label === "Upgrade Node" && "Refine absorbers to pull faster."}
                          {label === "Reinforce Hyphae" && "Widen stressed connections."}
                          {label === "Purify Toxins" && "Cleanse corrupted soil to restore flow."}
                        </p>
                      </div>
                      <Icon className="h-5 w-5 text-purple-100" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-5 w-5 text-amber-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-amber-200/80">Fruiting & Evolution</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase text-slate-300">Prestige Level</p>
                  <p className="text-2xl font-semibold text-amber-100">{prestigeLevel}</p>
                </div>
                <button
                  onClick={handlePrestige}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/80 to-purple-400/70 text-soil-900 font-semibold shadow hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-soil-900"
                  disabled={resources.sugar < 380 || nodes.filter((node) => node.discovered).length < 6}
                >
                  Trigger Fruiting
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Reset the network for spores. Requires 380 sugar and at least six discovered nodes. Upgrades persist.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {prestigeUpgrades.map((upgrade) => {
                  const owned = purchasedUpgrades.includes(upgrade.id);
                  const affordable = resources.spores >= upgrade.cost;
                  return (
                    <div
                      key={upgrade.id}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-50">{upgrade.name}</p>
                          <p className="text-xs text-slate-300">{upgrade.description}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full border border-slate-700/60 text-amber-200 bg-amber-500/10">
                          {owned ? "Integrated" : `${upgrade.cost} spores`}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePurchaseUpgrade(upgrade.id)}
                        disabled={owned || !affordable}
                        className="text-sm font-semibold px-3 py-2 rounded-xl border border-amber-400/40 text-amber-100 bg-amber-500/10 hover:bg-amber-400/20 transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      >
                        {owned ? "Locked In" : "Weave Upgrade"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-amber-200/80">Events</p>
              </div>
              <ul
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="space-y-2 text-sm text-slate-200"
              >
                {events.map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="h-2 w-2 mt-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(124,58,237,0.65)]" />
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Map className="h-5 w-5 text-purple-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-purple-200/80">Network Map</p>
              </div>
              <div className="rounded-3xl border border-slate-800/60 hyphae-grid relative h-[440px] overflow-hidden">
                <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                  const colorMap: Record<NodeType, string> = {
                    heart: "from-purple-500 to-indigo-500",
                    junction: "from-slate-200 to-purple-200",
                    water: "from-cyan-400 to-sky-400",
                    carbon: "from-slate-300 to-slate-100",
                    nutrient: "from-lime-400 to-amber-300",
                    ancient: "from-amber-400 to-purple-300",
                    artery: "from-purple-300 to-cyan-200",
                    enzyme: "from-emerald-300 to-lime-300",
                    spore: "from-amber-300 to-rose-200",
                    toxic: node.purified ? "from-emerald-400 to-cyan-400" : "from-rose-500 to-amber-500",
                    rival: "from-slate-200 to-red-300",
                    spring: "from-cyan-300 to-emerald-300",
                  };

                  const pulse = node.type === "heart" ? "animate-pulse" : "";

                  return (
                    <div
                      key={node.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 select-none`}
                      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                    >
                      <div
                        className={`relative rounded-full px-3 py-2 bg-gradient-to-r ${colorMap[node.type]} text-soil-900 shadow-lg ${pulse}`}
                      >
                        <p className="text-xs font-semibold">{node.name}</p>
                        <p className="text-[11px] text-soil-800/80">LV {node.upgradeLevel + 1}</p>
                        {node.type === "toxic" && !node.purified && (
                          <div className="absolute -right-2 -top-2 bg-amber-400 text-soil-900 text-[10px] font-bold px-2 py-1 rounded-full shadow">
                            Toxic
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm text-slate-200">
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-purple-200/80">Flow</p>
                  <p className="text-lg font-semibold text-purple-50">{format(flowRate)} /s</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Clog Risk</p>
                  <p className="text-lg font-semibold text-amber-100">{cloggedEdges.length} branches</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-lime-200/80">Maintenance</p>
                  <p className="text-lg font-semibold text-lime-50">-{format(edges.length * 0.35)} sugar</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/60">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-200/80">Pulse</p>
                  <p className="text-lg font-semibold text-slate-50">{format(networkPulse)} /s</p>
                </div>
              </div>
            </section>

            <section className="blur-card rounded-3xl p-5 backdrop-blur-sm panel-sheen relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <BadgeCheck className="h-5 w-5 text-lime-300" />
                <p className="uppercase text-xs tracking-[0.3em] text-lime-200/80">Active Nodes</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {discoveredNodes.map((node) => (
                  <div key={node.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-50">{node.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-slate-700/60 text-slate-200">
                        LV {node.upgradeLevel + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 min-h-[40px]">{node.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      {node.type === "toxic" && !node.purified ? (
                        <div className="flex items-center gap-1 text-amber-200">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Corroding hyphae</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-lime-200">
                          <Flame className="h-4 w-4" />
                          <span>Flow stable</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
