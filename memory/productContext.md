# Product Context — Mycelial Empire

## Problem Space

Contributors need a shared story that explains why the fungal colony simulator exists: it is a resource-driven experience where every node, edge, and toast message is part of an emergent underground ecosystem. Without this context, it is hard to align UI behavior, renderer updates, and store actions with the desired feel.

## Value Proposition

This project combines `useGameStore`’s snapshot-based tick loop with Miniplex + R3F rendering so maintainers can build immersive, performant hyphae visuals while editors still understand how actions mutate state and trigger toasts.

## Target Personas & Experiences

- **Core maintainers:** they tune node/edge upgrades, resource costs, and explorer actions, relying on the store constants (`EXPLORE_COST`, `NODE_UPGRADE_COST`, `HYPHAE_UPGRADE_BASE_COST`) for accuracy.
- **Visual engineers:** they extend `GraphScene` and the Miniplex world, keeping entity IDs stable to preserve R3F transitions.
- **New contributors:** they consume AGENTS.md, this product context, and the memory docs to understand where to add features safely.

## Experience Goals

- Action feedback should feel crisp: `ActionBar` buttons, `ResourceTray`, and `StatsPanel` must show real-time resource deltas.
- Toasts (`ToastHub`) should deliver success/failure narratives tied to actions executed through `runAction` helpers.
- Settings (`SettingsDialog`) must feel stable while exposing dev toggles like grid overlays from `useUiStore`.

## Key Journeys

- **Explore:** the player expands the network, paying `EXPLORE_COST`, then the store adds nodes/edges and triggers sync to the renderer.
- **Upgrade:** upgrading nodes or hyphae adjusts resources, updates stats, and pushes a toast summarizing the change.
- **Inspect:** toggling overlays or using dev helpers (autosave, hydrate) keeps debugging manageable.

## Validation

- Each journey is testable via the UI (click `ActionBar` actions and verify toasts, stats, and GraphScene updates).
- UI components reuse store selectors to avoid redundant renders; memos or multi-selector hooks are acceptable.
- Any architectural change is referenced in `/memory/systemPatterns.md` and `/memory/techContext.md` before being merged.

## Memory Links

- `projectbrief.md` shares the mission that anchors these product goals.
- `systemPatterns.md` and `techContext.md` explain the architecture and tooling that brings this context to life.
