# AGENTS — `src/components/settings/`

Overview

- Purpose: Settings UI and developer toggles exposed to users.

Files

- `SettingsDialog.tsx`: Dialog for user preferences and dev toggles. Uses `useUiStore` to read/update toggles like `showGridOverlay`.

Notes

- Keep settings read/write operations small and use `useUiStore` helpers so changes propagate to rendering (for example `GraphScene` reads `showGridOverlay`).
