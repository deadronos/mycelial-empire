import { useEffect } from "react";
import { useGameStore } from "@/state/useGameStore";
import { useUiStore } from "@/state/useUiStore";

export const AUTOSAVE_KEY = "mycelial-empire:autosave";

export const useAutosave = () => {
  const autosave = useUiStore((state) => state.autosave);
  const markAutosaved = useUiStore((state) => state.markAutosaved);
  const pushToast = useUiStore((state) => state.pushToast);
  const serialize = useGameStore((state) => state.serialize);

  useEffect(() => {
    if (!autosave.enabled || typeof window === "undefined") {
      return;
    }

    const id = window.setInterval(() => {
      try {
        const payload = serialize();
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
        markAutosaved();
      } catch (error) {
        pushToast({
          title: "Autosave failed",
          description: error instanceof Error ? error.message : String(error),
          intent: "error",
        });
      }
    }, autosave.intervalMs);

    return () => window.clearInterval(id);
  }, [autosave.enabled, autosave.intervalMs, markAutosaved, pushToast, serialize]);
};
