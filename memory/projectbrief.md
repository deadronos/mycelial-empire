# Project Brief — Mycelial Empire

## Mission

Mycelial Empire is a Vite + React 19 sandbox that invites contributors to steward a glowing fungal colony simulator. The goal of this memory artifact is to make the project’s mission, scope, and success criteria quick to digest before anyone writes new code—especially when following the Spec-Driven Workflow outlined in `.github/instructions`.

## Scope

- Model an underground fungal graph where resources, nodes, and edges are driven by `useGameStore` and explained through HUD overlays (`ResourceTray`, `StatsPanel`, `ActionBar`).
- Render the colony as an ECS-driven hyphae graph (`GraphScene`, `world.ts`) that mirrors the store snapshots sent through `syncGraphWorld`.
- Provide Radix-powered UI chrome (`SettingsDialog`, `ToastHub`) plus dev helpers (`useHydrateFromStorage`, `useAutosave`, grid toggles) to keep experimentation safe.

## Key Goals

- Keep `useGameStore` as the single truth for resources, nodes, edges, and the tick loop so state mutations stay inside `set` callbacks.
- Maintain smooth transitions and deterministic entity IDs inside `GraphScene` and the Miniplex world to preserve R3F rendering stability.
- Align every new feature with the documentation in `/memory` (requirements, designs, tasks) so maintainers can reason about changes before touching code.

## Success Indicators

- The hyphae simulation runs in `npm run dev` with autosave, hydration, and toast feedback working end-to-end.
- UI overlays surface accurate resource costs (EXPLORE_COST, NODE_UPGRADE_COST, HYPHAE_UPGRADE_BASE_COST) pulled directly from the store constants.
- Story and memory docs stay updated: requirements/design/task files keep pace with feature work and are referenced in AGENTS.md.

## Boundaries & Constraints

- The project is client-only; no backend, database, or server components exist, so all saves go via `localStorage` keyed by `AUTOSAVE_KEY`.
- Tailwind CSS v4 and the theme palette (soil, hyphae, emerald) dictate styling—avoid introducing conflicting utility classes.
- Dependencies are limited to those already specified (Zustand, Miniplex, R3F, Radix, Zod); new packages must have clear project value.

## Memory Links

- `productContext.md` explains the user problems and experience goals derived from this brief.
- `systemPatterns.md` maps the architecture referenced in the mission and scope above.
- `techContext.md`, `activeContext.md`, and `progress.md` keep this brief in sync with the stack, active work, and progress signal.
