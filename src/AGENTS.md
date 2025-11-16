# AGENTS — `src/`

Overview
- Purpose: Top-level overview for the `src` folder. Points developers at the primary app entrypoints, global hooks, stores, and the rendering surface.

Top-level files
- `main.tsx`: App bootstrap (mounts the React tree). Place for global providers if needed.
- `App.tsx`: Root application component. Wires global hooks (`useGameLoop`, `useAutosave`, `useHydrateFromStorage`) and composes the `GraphScene` plus UI overlays.
- `index.css`: Global styles (Tailwind + base theme utilities).
- `setupTests.ts`: Test harness/setup for Vitest.
- `vite-env.d.ts`: Vite/TypeScript environment types.

Important folders
- `components/`: UI components (HUD, action bar, dialogs, overlays).
- `graphics/`: React-Three-Fiber scene + mesh layers (`GraphScene.tsx`).
- `ecs/`: Miniplex ECS world and helpers (`world.ts`).
- `hooks/`: Global side-effect hooks (game loop, autosave, hydration).
- `lib/`: Utility libraries (numbers, random, serialization + Zod schemas).
- `state/`: Zustand stores — `useGameStore` is the simulation source-of-truth; `useUiStore` handles UI state and toasts.
- `types/`: Shared TypeScript types (graph shapes, stats).

Quick notes for contributors
- Simulation is driven by `useGameStore`. Keep state mutations inside the store's `set` callback to remain compatible with middleware and snapshots.
- Use `serializeGameState` / `parseGameSave` from `src/lib/serialization.ts` when persisting or hydrating saves.
- `GraphScene` reads entities exposed by the ECS `world` (stable IDs matter for smooth R3F transitions).
