# Active Context — Mycelial Empire

## Current Focus

The primary focus right now is finishing the foundational `/memory` docs (project brief, product context, system patterns, tech context, active/progress logs) so future agents have a complete onboarding path. These docs reference the mission and architecture that AGENTS.md introduced earlier.

## Recent Changes

- `AGENTS.md` now codifies the Spec-Driven workflow, collaboration patterns, and agent guardrails.
- `memory/requirements.md` now includes EARS entries (R5–R9) that justify the new documents.
- `memory/designs/DES002-memory-context.md` maps the requirements to deliverables and implementation tasks.

## Decisions Underway

- Document the interplay between `useGameStore`, Miniplex, and the renderer inside `systemPatterns.md` to reduce friction for visual engineers.
- Capture the stack, tooling, and automation scripts in `techContext.md` so contributions stay consistent with the existing commands.
- Determine the best level of detail for `activeContext.md`/`progress.md` so they stay current without needing daily edits.

## Next Milestones

- Publish the remaining `/memory` docs with the agreed structure and ensure they reference the new DES002 plan.
- Update `memory/tasks/TASK002` with progress logs once the docs are live and adjust the index to show completion.
- Invite maintainers to review the new context files before moving on to gameplay feature work.

## Dependencies & Risks

- Accurate stack information depends on keeping `README.md`, `eslint.config.js`, and `package.json` aligned with reality.
- The precision of these docs relies on `useGameStore` remaining the gameplay source of truth.
- Risk: the context docs can become stale if they are not updated alongside `AGENTS.md` and the stores; future contributions should touch the docs when touching the core systems.
