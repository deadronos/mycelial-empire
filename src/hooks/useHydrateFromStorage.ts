import { useEffect, useRef } from "react";
import { useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";
import { parseGameSave } from "@/lib/serialization";
import { AUTOSAVE_KEY } from "./useAutosave";

export const useHydrateFromStorage = () => {
  const hydrate = useGameStore((state) => state.hydrate);
  const pushToast = useUiStore((state) => state.pushToast);
  const didHydrate = useRef(false);

  useEffect(() => {
    if (didHydrate.current || typeof window === "undefined") {
      return;
    }

    didHydrate.current = true;
    const cached = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!cached) {
      return;
    }

    try {
      const payload = parseGameSave(JSON.parse(cached));
      hydrate(payload);
      pushToast({
        title: "Autosave restored",
        description: "Loaded your most recent colony snapshot.",
        intent: "info",
      });
    } catch (error) {
      pushToast({
        title: "Autosave corrupted",
        description: error instanceof Error ? error.message : String(error),
        intent: "error",
      });
    }
  }, [hydrate, pushToast]);
};
