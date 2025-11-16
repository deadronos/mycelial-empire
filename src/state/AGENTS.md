# AGENTS — `src/state/`

Overview

- Purpose: Contains the central Zustand stores that hold the simulation and UI state.

Files

- `useGameStore.ts`: The simulation source-of-truth. Manages resources, nodes, edges, hyphae, costs, and the `step()` tick logic. Exposes constants like `EXPLORE_COST`, `NODE_UPGRADE_COST`, and `HYPHAE_UPGRADE_BASE_COST`.
- `useUiStore.ts`: UI-focused store: developer toggles (e.g. `showGridOverlay`), toast queue (`pushToast`), and ephemeral UI state.

Important rules

- Keep all state mutations inside the store's `set` callback to remain compatible with middleware and to ensure snapshot consistency used by render code.
- When adding new selectors, group related fields to avoid causing unnecessary re-renders in large components (combine selectors where it makes sense).
