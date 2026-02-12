import { useGameStore } from "@/store/gameStore";

import { NodeListPresentational } from "../presentational/NodeListPresentational";

export const NodeList = () => {
  const { nodes } = useGameStore();
  const discoveredNodes = nodes.filter((n) => n.discovered);

  return <NodeListPresentational nodes={discoveredNodes} />;
};
