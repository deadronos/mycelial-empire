# Progress — Mycelial Empire

## What Works

- The tick loop governed by `useGameLoop` keeps `step()` running every second and ties into the store mutations safely.
- `useAutosave` + `useHydrateFromStorage` reliably persist progress using `serializeGameState` / `parseGameSave` so players can resume immediately.
- `GraphScene` and the Miniplex world render the hyphae graph while keeping entity IDs stable for smooth R3F transitions.
- HUD overlays (`ResourceTray`, `StatsPanel`, `ActionBar`, `SettingsDialog`, `ToastHub`) mirror store state via batched selectors to minimize re-renders.

## What's Left

- Add more node/edge/upgrade types and balancing logic within `useGameStore` to expand gameplay variety.
- Layer `GraphScene` with bloom/post-processing effects and hover tooltips for richer visualization.
- Tighten import/export messaging (toast + inline errors) plus add more debug toggles referenced in `useUiStore`.
- Document the memory structure (this task) so future agents can find context quickly.

## Known Issues & Risks

- Real-time synchronization between store updates and Miniplex entities must stay deterministic—any change to IDs or ordering can break transitions.
- Without CI or automated tests, changes rely on manual validation (`npm run dev`) and thorough toasts/messages.
- Memory docs (`/memory`) can become stale if not touched alongside code updates; regular reviews are necessary.

## Confidence & Notes

The repository has a strong base (stores, ECS, renderer, HUD, toasts) that works locally. The current focus on documentation closes the onboarding gap but should be revisited after new gameplay features land to ensure accuracy.

## Memory Links

- `activeContext.md` describes what is currently being worked on.
- `DES002-memory-context.md` contains the plan that brought these updates to life.
