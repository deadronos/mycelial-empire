# AGENTS — `src/components/`

Overview

- Purpose: Collection of UI components used across the app (HUD, action controls, settings, overlays).

Folder layout

- `actions/` — game action controls (e.g. `ActionBar.tsx`).
- `hud/` — heads-up display components (resource tray, stats, drawers).
- `settings/` — app settings and toggles (e.g. `SettingsDialog.tsx`).
- `ui/` — small UI primitives and overlays (toasts, canvas masks).

Usage notes

- Components should read from `useGameStore` / `useUiStore` via selectors to avoid unnecessary re-renders.
- Prefer composing small UI primitives; HUD components are intentionally thin and read from the store for live updates.
