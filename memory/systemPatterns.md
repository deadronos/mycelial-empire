# System Patterns

## Architecture Overview

The project centers on a single source of truth (`useGameStore`) that emits snapshots of resources, nodes, and edges. Those snapshots are mirrored into Miniplex entities (`ecs/world.ts`) and consumed by `GraphScene` so R3F can render the hyphae graph deterministically.

## Layer Map

| Layer | Primary Modules | Responsibility |
| --- | --- | --- |
| Gameplay store | `useGameStore.ts`, `useUiStore.ts` | Maintain resources, node/edge definitions, autosave/hydration logic, and dev toggles. |
| ECS + sync | `ecs/world.ts`, `syncGraphWorld` | Mirror store snapshots into entities, keep IDs stable, and publish updates to the renderer. |
| Rendering | `graphics/GraphScene.tsx`, `components/*` | Render hyphae meshes, HUD overlays, and toast/setting portals while reacting to store selectors. |
| UI orchestration | `App.tsx`, `hooks/useGameLoop.ts`, `hooks/useAutosave.ts`, `hooks/useHydrateFromStorage.ts` | Manage the tick loop, persistence, hydration, and side effects that drive gameplay every second. |

## Component Relationships

- `App.tsx` wires HUD overlays (`ResourceTray`, `StatsPanel`, `ActionBar`, `SettingsDialog`, `ToastHub`) around `GraphScene` and shares selectors through the stores.
- `useGameLoop` drives the per-second `step()` call, which updates the store and triggers `syncGraphWorld` to keep the ECS/world in sync.
- `ActionBar` and other controls dispatch actions via `runAction` helpers that wrap store mutations inside `set`, ensuring middleware compatibility.

## Design Patterns

- **Central Store**: `useGameStore` holds the authoritative state, exposing constants like `EXPLORE_COST` and `NODE_UPGRADE_COST` for UI consistency.
- **ECS Mirror**: The Miniplex world keeps a lightweight entity list that mirrors graph data, so rendering and click detection stay separate from game logic.
- **Event Feedback**: Toasts (`ToastHub`) act as a side channel, summarizing the outcomes of `runAction` calls and surfacing errors or confirmations.
- **Hook Encapsulation**: `useAutosave`, `useHydrateFromStorage`, and `useGameLoop` encapsulate key lifecycle behaviors so they can be reused across dev and production builds.

## Data Flow

1. UI actions and hooks mutate `useGameStore` within `set` callbacks.
2. `syncGraphWorld` publishes snapshots into the Miniplex world immediately after the store update.
3. `GraphScene` rerenders using the updated ECS entities while HUD components read the same store snapshot.
4. Toasts and alerts fire via `runAction` results to provide feedback, and autosave persists the next state snapshot.

## Observability & Ops

- Autosave uses the `AUTOSAVE_KEY` to persist JSON from `serializeGameState`, while hydration rehydrates via `parseGameSave` before UI renders.
- Dev toggles in `useUiStore` (grid overlay, sync diagnostics) help debug spatial alignment in `GraphScene`.
- Additional instrumentation can hook into the tick loop and toast queue for telemetry if needed.

## Memory Links

- `DES002-memory-context.md` explains how this architecture feeds the new memory docs.
- `projectbrief.md` and `productContext.md` reference these layers to ground the simulation story.
