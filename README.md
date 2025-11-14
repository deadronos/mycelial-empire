# Mycelial Empire

A modern Vite + React + TypeScript sandbox for simulating a glowing underground fungal colony. It ports the original JSX prototype into a typed architecture with Zustand stores, Miniplex ECS hydration, R3F graph rendering, and Radix-powered UI/UX utilities.

## Stack

- **Vite + React 19 + TypeScript** with path aliases via `@/`
- **Tailwind CSS v4** (via `@tailwindcss/vite`) for styling tokens and utility-first layout
- **Zustand** gameplay + UI preference stores (autosave, dialogs, toast queue)
- **Miniplex + miniplex-react** to mirror graph nodes/edges as ECS entities for the renderer
- **@react-three/fiber + drei** to render the orthographic hyphae network
- **Radix UI (Dialog + Toast)** for accessible overlays and feedback
- **Prettier + ESLint** with flat config setup for consistent linting/formatting

## Getting started

```bash
npm install
npm run dev
```

Additional scripts:

- `npm run lint` / `npm run lint:fix`
- `npm run format`
- `npm run typecheck`
- `npm run build`

## Key files

```
src/
 ├─ App.tsx                   # Screen composition + HUD overlays
 ├─ graphics/GraphScene.tsx   # R3F renderer consuming Miniplex entities
## Testing

This repository uses Vitest + Testing Library for tests. Run the following commands:

- Run tests once: `npm test` or `npm run test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage: `npm run test:coverage`

Tests use `tsconfig.test.json` to load typing and test globals.
 ├─ state/useGameStore.ts     # Resources, nodes/edges, actions, tick loop
 ├─ state/useUiStore.ts       # Autosave prefs, dialogs, toasts, dev toggles
 ├─ hooks/                    # Autosave + hydration + ticker hooks
 ├─ components/               # HUD, action bar, settings dialog, toast hub
 └─ ecs/world.ts              # Miniplex world + sync helpers
```

Reference material from the original prototype, mock UI, and design doc now lives in `docs/` for quick lookup.

## Next steps

1. Flesh out additional node types and rival colony events inside `useGameStore`.
2. Expand `GraphScene` with bloom/post-processing and hover tooltips.
3. Hook up import validation messaging (toast + inline error state) and add more dev toggles per the plan.
4. Layer in ECS inspectors or overlays leveraging the existing UI store toggles.
