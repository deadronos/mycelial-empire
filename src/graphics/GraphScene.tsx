import { Canvas } from "@react-three/fiber";
import { Line, OrthographicCamera } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3 } from "three";
import { useEdgeEntities, useNodeEntities } from "@/ecs/world";
import { useUiStore } from "@/state/useUiStore";
import type { EdgeEntity, NodeEntity } from "@/ecs/world";

const POSITION_SCALE = 0.2;

const toVec3 = (node: NodeEntity["node"], elevation = 0) =>
  new Vector3(node.position.x * POSITION_SCALE, node.position.y * POSITION_SCALE, elevation);

export const GraphScene = () => {
  const showGrid = useUiStore((state) => state.devtools.showGridOverlay);

  return (
    <div className="h-full w-full">
      <Canvas orthographic dpr={[1, 1.5]} className="bg-transparent">
        <OrthographicCamera makeDefault position={[0, 0, 60]} zoom={12} />
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 30]} intensity={1.1} color="#a855f7" />
        <pointLight position={[-30, -20, 25]} intensity={0.4} color="#22d3ee" />
        <GraphBackground showGrid={showGrid} />
        <EdgesLayer />
        <NodesLayer />
      </Canvas>
    </div>
  );
};

const GraphBackground = ({ showGrid }: { showGrid: boolean }) => (
  <group>
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[160, 160]} />
      <meshBasicMaterial color="#030712" opacity={0.92} transparent />
    </mesh>
    {showGrid && <gridHelper args={[200, 40, "#1f2937", "#0f172a"]} position={[0, 0, -4]} />}
  </group>
);

const NodesLayer = () => {
  const bucket = useNodeEntities();
  const nodes = bucket.entities as NodeEntity[];
  return (
    <group>
      {nodes.map((entity) => (
        <NodeGlyph key={entity.id} entity={entity} />
      ))}
    </group>
  );
};

const EdgesLayer = () => {
  const bucket = useEdgeEntities();
  const edges = bucket.entities as EdgeEntity[];
  return (
    <group>
      {edges.map((entity) => (
        <HyphaeEdge key={entity.id} entity={entity} />
      ))}
    </group>
  );
};

const HyphaeEdge = ({ entity }: { entity: EdgeEntity }) => {
  const { edge } = entity;
  if (!edge.fromNode || !edge.toNode) {
    return null;
  }

  const fromNode = edge.fromNode;
  const toNode = edge.toNode;

  const points = useMemo(() => {
    const from = toVec3(fromNode, -0.5);
    const to = toVec3(toNode, -0.5);
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.z -= 0.2;
    return [from, mid, to];
  }, [fromNode, toNode]);

  const color =
    edge.status === "decaying" ? "#fb7185" : edge.status === "strained" ? "#fbbf24" : "#38bdf8";
  const width = Math.max(0.15, edge.width * 0.12);

  return <Line points={points} color={color} lineWidth={width} transparent opacity={0.8} />;
};

const NodeGlyph = ({ entity }: { entity: NodeEntity }) => {
  const { node } = entity;
  const position = toVec3(node, 0.1);

  const color =
    node.kind === "heart"
      ? "#a855f7"
      : node.kind === "waterPocket"
      ? "#22d3ee"
      : node.kind === "carbonPocket"
      ? "#f8fafc"
      : node.kind === "nutrientPocket"
      ? "#bef264"
      : node.kind === "junction"
      ? "#38bdf8"
      : "#f87171";

  const radius = node.kind === "heart" ? 3 : 1.6 + (node.tier - 1) * 0.2;

  return (
    <group position={position.toArray()}>
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[radius * 1.8, 32]} />
        <meshBasicMaterial color={color} opacity={0.12} transparent />
      </mesh>
      <mesh>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};
