# AGENTS — `src/components/hud/`

Overview

- Purpose: Heads-up display (HUD) components that surface game state to the player.

Files

- `LeftDrawer.tsx`: Side panel hosting additional controls and information.
- `ResourceTray.tsx`: Shows current resources and progress bars. There is a unit test at `ResourceTray.test.tsx`.
- `StatsPanel.tsx`: Displays global stats and highlights (net sugar, production rates, etc.).

Notes

- HUD components should select only the pieces of state they render to keep re-renders localized.
- Tests for HUD components live next to the component implementations and use the store helpers to simulate state.
