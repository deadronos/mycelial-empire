# AGENTS — `src/components/actions/`

Overview

- Purpose: UI components that trigger game actions (explore, upgrade, build). Keep UI logic minimal and call into the store for side effects.

Files

- `ActionBar.tsx`: Primary action surface. Reads cost constants from `useGameStore` and calls store action helpers. Wrap store calls with result/toast helpers rather than doing heavy logic in the component.

Notes

- Use cost constants (e.g. `EXPLORE_COST`, `NODE_UPGRADE_COST`) exported by the store when rendering or validating actions in the UI.
- Prefer `runAction` patterns that centralize user feedback and error handling.
