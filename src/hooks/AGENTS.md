# AGENTS — `src/hooks/`

Overview

- Purpose: App-level side-effect hooks that coordinate the tick loop, autosave, and hydration from storage.

Files

- `useGameLoop.ts`: Drives the main game tick (calls `step()` on a fixed interval). Keeps the simulation advancing.
- `useAutosave.ts`: Persists game state periodically to `localStorage` under the `AUTOSAVE_KEY`. Uses `serializeGameState` from `src/lib/serialization.ts`.
- `useHydrateFromStorage.ts`: Loads save data from storage and hydrates `useGameStore` using `parseGameSave` before the UI fully renders.

Notes

- Hooks are side-effect boundaries; they orchestrate store calls but do not contain simulation logic themselves.
- Autosave and hydration rely on the serialization helpers to remain version safe.
