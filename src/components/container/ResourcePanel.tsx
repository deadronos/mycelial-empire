import { format, useGameStore } from "@/store/gameStore";
import { ResourcePanelPresentational } from "../presentational/ResourcePanelPresentational";

export const ResourcePanel = () => {
  const { resources, pulse } = useGameStore();
  const pulseDisplay = format(Math.max(0, pulse));

  return <ResourcePanelPresentational resources={resources} pulseDisplay={pulseDisplay} />;
};
