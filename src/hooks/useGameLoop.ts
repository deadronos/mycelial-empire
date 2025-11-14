import { useEffect } from "react";
import { useGameStore } from "@/state/useGameStore";

const TICK_MS = 1_000;

export const useGameLoop = () => {
  const step = useGameStore((state) => state.step);

  useEffect(() => {
    const id = window.setInterval(() => step(), TICK_MS);
    return () => window.clearInterval(id);
  }, [step]);
};
