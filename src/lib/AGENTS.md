# AGENTS — `src/lib/`

Overview

- Purpose: Utility libraries and helpers reused across the codebase (numbers, randomness, serialization).

Files

- `numbers.ts` & `numbers.test.ts`: Numeric helpers, formatting and tests for predictable behaviour.
- `random.ts`: Randomness utilities used for procedural decisions.
- `serialization.ts`: Zod schemas and versioned save/restore helpers: `serializeGameState` and `parseGameSave`.

Notes

- Always use `serializeGameState` before persisting or exporting saves and `parseGameSave` when hydrating — Zod validation enforces data contracts and versions.
- Reuse `numbers` helpers instead of duplicating formatting logic.
