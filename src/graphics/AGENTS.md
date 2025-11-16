# AGENTS — `src/graphics/`

Overview

- Purpose: React-Three-Fiber scene and components responsible for visualizing the graph world produced by the ECS.

Files

- `GraphScene.tsx`: Main 3D scene. Reads the Miniplex `world` snapshot to render meshes. Designed so mesh layers read entities directly for performant updates.

Notes

- Keep entity IDs stable in the sync process to enable React-Three-Fiber transitions and avoid janky visual updates.
- Use the `world` snapshot as a read-only source for rendering; do not perform simulation updates inside render code.
