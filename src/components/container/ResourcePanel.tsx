import { format, useGameStore } from "@/store/gameStore";
import { resourceCopy, resourceOrder } from "@/utils/uiConstants";

import { ResourcePanelPresentational } from "../presentational/ResourcePanelPresentational";

export const ResourcePanel = () => {
  const { resources, pulse } = useGameStore();
  const pulseDisplay = format(Math.max(0, pulse));

  const formattedResources = resourceOrder.map((key) => ({
    key,
    formattedValue: format(resources[key]),
    ...resourceCopy[key]
  }));

  return <ResourcePanelPresentational resources={formattedResources} pulseDisplay={pulseDisplay} />;
};
