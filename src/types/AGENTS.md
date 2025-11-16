# AGENTS — `src/types/`

Overview

- Purpose: Shared TypeScript types and interfaces used across the app to describe the game graph and runtime data shapes.

Files

- `graph.ts`: Types for nodes, edges, hyphae, stats and other graph-related shapes. Use these central types when extending store, ECS world, or rendering code to keep signatures consistent.

Notes

- Keep types minimal and explicit; prefer naming that makes the contract obvious between `state`, `ecs`, and `graphics` layers.
