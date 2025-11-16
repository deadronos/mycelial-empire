# AGENTS — `src/ecs/`

Overview

- Purpose: Holds the ECS world implementation and helpers used to mirror the game graph into entities that `GraphScene` can render.

Files

- `world.ts`: Creates and manages the Miniplex world (entities for nodes, edges, hyphae). Provides sync utilities used by the store to publish snapshots.

Notes

- The ECS world is read-only for render code; mutations should happen in the simulation (`useGameStore`) and then be synced into the world snapshot used by `GraphScene`.
