import { useGameStore } from "@/store/gameStore";
import { getDiscoveredNodes } from "@/utils/gameLogic";

import { NodeListPresentational } from "../presentational/NodeListPresentational";

export const NodeList = () => {
  const { nodes } = useGameStore();
  const discoveredNodes = getDiscoveredNodes(nodes);

  return <NodeListPresentational nodes={discoveredNodes} />;
};
