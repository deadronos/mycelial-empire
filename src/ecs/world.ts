import { World } from "miniplex";
import { useEntities } from "miniplex-react";
import type { GraphEdge, GraphNode, GraphSnapshot } from "@/types/graph";

export type GraphEntity = {
  id: string;
  kind: "node" | "edge";
  node?: GraphNode;
  edge?: GraphEdge & {
    fromNode?: GraphNode;
    toNode?: GraphNode;
  };
};

export type NodeEntity = GraphEntity & { kind: "node"; node: GraphNode };
export type EdgeEntity = GraphEntity & {
  kind: "edge";
  edge: GraphEdge & {
    fromNode?: GraphNode;
    toNode?: GraphNode;
  };
};

export const graphWorld = new World<GraphEntity>();
export const nodeQuery = graphWorld.with("node");
export const edgeQuery = graphWorld.with("edge");
const nodeEntities = new Map<string, NodeEntity>();
const edgeEntities = new Map<string, EdgeEntity>();

export const syncGraphWorld = (snapshot: GraphSnapshot) => {
  const seenNodes = new Set<string>();
  const seenEdges = new Set<string>();

  const nodeLookup = new Map(snapshot.nodes.map((node) => [node.id, node]));

  snapshot.nodes.forEach((node) => {
    const existing = nodeEntities.get(node.id);
    if (existing) {
      existing.node = node;
      graphWorld.reindex(existing);
    } else {
      const entity = graphWorld.add({ kind: "node", id: node.id, node }) as NodeEntity;
      nodeEntities.set(node.id, entity);
    }
    seenNodes.add(node.id);
  });

  for (const [id, entity] of nodeEntities) {
    if (!seenNodes.has(id)) {
      graphWorld.remove(entity);
      nodeEntities.delete(id);
    }
  }

  snapshot.edges.forEach((edge) => {
    const hydrated = {
      ...edge,
      fromNode: nodeLookup.get(edge.from),
      toNode: nodeLookup.get(edge.to),
    };

    const existing = edgeEntities.get(edge.id);
    if (existing) {
      existing.edge = hydrated;
      graphWorld.reindex(existing);
    } else {
      const entity = graphWorld.add({ kind: "edge", id: edge.id, edge: hydrated }) as EdgeEntity;
      edgeEntities.set(edge.id, entity);
    }
    seenEdges.add(edge.id);
  });

  for (const [id, entity] of edgeEntities) {
    if (!seenEdges.has(id)) {
      graphWorld.remove(entity);
      edgeEntities.delete(id);
    }
  }
};

export const useNodeEntities = () => useEntities(nodeQuery);
export const useEdgeEntities = () => useEntities(edgeQuery);
