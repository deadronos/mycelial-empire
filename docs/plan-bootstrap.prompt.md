## Plan: Mycelial Empire Repo Bootstrap v4

Deliver a modern Vite + React + TS stack (Tailwind v4, Zustand, Miniplex, R3F, Radix UI) that reimplements the prototype while introducing a dedicated UI preference store and Radix-based toast/dialog scaffolding around the gameplay loop.

### Steps
1. Scaffold the project (Vite TS template) with Tailwind v4 config, Radix UI primitives/toast, Zustand, Miniplex/miniplex-react, react-three-fiber+drei, ESLint/Prettier, comprehensive `.gitignore`, and `README.md`.
2. Port simulation logic into typed modules: `src/state/useGameStore.ts` (resources, nodes/edges, 1 s tick, explore/upgrade actions) plus `src/ecs/world.ts` mirroring the current node/edge generation inside Miniplex systems.
3. Implement `src/state/useUiStore.ts` for UI prefs/settings (autosave toggle + interval slider, dialog visibility states, export/import flow) separate from the gameplay store.
4. Build the full R3F orthographic renderer in `src/graphics/GraphScene.tsx`, feeding entity data from the ECS/store and matching the glowing hyphae aesthetic.
5. Compose Radix-driven UI shells (`src/App.tsx`, HUD, action bar, stats) with a centralized dialog provider and toast viewport; wire settings dialog gear icon to expose autosave controls and export/import buttons while using Radix Toast for action feedback.
6. Future-proofing the ECS architecture for upcoming gameplay features (e.g., new node types, resource mechanics).

### Further Considerations
1. Validation UX for import failures: toast message only vs. toast + inline dialog error?
2. Need dev-only toggles (SVG fallback, ECS inspector) exposed through the UI store now or can wait?
