# Tech Context — Mycelial Empire

## Stack Overview

The repo runs on Vite + React 19 + TypeScript with `@/` path aliases declared in `tsconfig.app.json`. Styling leans on Tailwind CSS v4 through `tailwind.config.ts`, and immutable state is managed via Zustand stores (`useGameStore`, `useUiStore`). Rendering relies on Miniplex + `@react-three/fiber` + `drei`, while Radix delivers accessible dialogs and toast mechanics.

## Tooling & Commands

- `npm install` to bootstrap dependencies.
- `npm run dev` launches the Vite server with Fast Refresh for the UI and `GraphScene` canvas.
- `npm run lint` / `npm run lint:fix` run the ESLint config defined in `eslint.config.js`.
- `npm run format` enforces Prettier rules based on `prettier.config.js`.
- `npm run typecheck` runs the TypeScript references build via `tsconfig.json`.
- `npm run build` executes `tsc -b` followed by the Vite production build.

## Environment

Developers should use the Node.js version documented in `.nvmrc` (when present) or the version used to install dependencies. LocalStorage serves as the persistence layer, keyed by `AUTOSAVE_KEY`, and the project assumes a modern browser for WebGL rendering.

## Constraints & Decisions

- Client-only: no API server, so serialization relies on `serializeGameState` and `parseGameSave` from `src/lib/serialization.ts`.
- The Miniplex world prevents direct DOM mutations—updates flow through the store to keep ECS entities consistent.
- Toast feedback is the single error/confirmation channel; avoid creating parallel notification systems.

## Dependencies of Note

- **Zustand** for stores + middleware compatibility.
- **Miniplex** + `miniplex-react` for ECS mirroring.
- **@react-three/fiber** + `drei` for the hyphae renderer.
- **Radix UI** for overlays (dialogs, toasts).
- **Zod** for serialization validation and save parsing.
- **Tailwind CSS v4** for styling tokens.

## Automation Notes

Autosave hooks (`useAutosave.ts`) run alongside the game loop, so there is no separate scheduler. Watch mode is available via `npm run dev`, and manual exports (save + copy) can be implemented through `serializeGameState`.

## Memory Links

- `systemPatterns.md` explains how these tools map to the architecture.
- `progress.md` captures how well each toolchain area is working over time.
